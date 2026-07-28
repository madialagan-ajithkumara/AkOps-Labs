// Package ratelimit throttles session-creation requests per source IP.
// This is separate from the per-IP *concurrency* cap in session.Manager —
// rate limiting stops someone from rapid-firing create/destroy cycles even
// while staying under the concurrency cap, and the concurrency cap stops
// someone from holding many sessions open at once even while staying under
// the rate limit. You need both.
package ratelimit

import (
	"sync"
	"time"

	"golang.org/x/time/rate"
)

type PerIPLimiter struct {
	mu       sync.Mutex
	limiters map[string]*entry
	rate     rate.Limit
	burst    int
	maxIdle  time.Duration
}

type entry struct {
	limiter  *rate.Limiter
	lastUsed time.Time
}

// New creates a limiter allowing `burst` creations immediately, refilling
// at a rate that permits `perWindow` total creations per `window` on
// average (e.g. perWindow=5, window=10m -> ~1 every 2 minutes, bursting
// up to `burst`).
func New(perWindow int, window time.Duration, burst int) *PerIPLimiter {
	if perWindow < 1 {
		perWindow = 1
	}
	r := rate.Every(window / time.Duration(perWindow))
	l := &PerIPLimiter{
		limiters: make(map[string]*entry),
		rate:     r,
		burst:    burst,
		maxIdle:  2 * window, // evict IPs that haven't tried in a while
	}
	go l.janitor()
	return l
}

// Allow reports whether a session-creation request from ip should proceed.
// Every distinct IP gets its own token bucket, created lazily on first use.
func (l *PerIPLimiter) Allow(ip string) bool {
	l.mu.Lock()
	e, ok := l.limiters[ip]
	if !ok {
		e = &entry{limiter: rate.NewLimiter(l.rate, l.burst)}
		l.limiters[ip] = e
	}
	e.lastUsed = time.Now()
	l.mu.Unlock()

	return e.limiter.Allow()
}

// janitor periodically evicts limiters for IPs we haven't seen in a while,
// so a public endpoint hit by many distinct (possibly spoofed-looking, but
// still bounded by TCP handshake cost) source IPs doesn't grow this map
// without bound.
func (l *PerIPLimiter) janitor() {
	ticker := time.NewTicker(l.maxIdle)
	defer ticker.Stop()
	for range ticker.C {
		cutoff := time.Now().Add(-l.maxIdle)
		l.mu.Lock()
		for ip, e := range l.limiters {
			if e.lastUsed.Before(cutoff) {
				delete(l.limiters, ip)
			}
		}
		l.mu.Unlock()
	}
}
