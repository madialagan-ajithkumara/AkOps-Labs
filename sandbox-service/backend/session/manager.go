// Package session is the orchestrator: it tracks session id -> container id
// -> expiry, enforces every abuse-resistance knob at creation time, and
// exposes what the reaper (reaper.go) needs to sweep expired sessions. At
// this scale (single box, no Kubernetes) an in-memory map guarded by a
// mutex is the right amount of infrastructure — see docs/ABUSE_PREVENTION.md
// for what to swap in (Redis, etc.) if you outgrow a single instance.
package session

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"sync"
	"time"

	"akops-sandbox/config"
	"akops-sandbox/ratelimit"
	"akops-sandbox/sandbox"

	"github.com/docker/docker/client"
)

var (
	ErrRateLimited       = errors.New("too many session requests from this address, try again shortly")
	ErrTooManyConcurrent = errors.New("you already have the maximum number of active sessions")
	ErrAtCapacity        = errors.New("the lab server is at capacity, try again in a minute")
	ErrNotFound          = errors.New("session not found or already expired")
)

type Session struct {
	ID          string
	ContainerID string
	IP          string
	CreatedAt   time.Time
	ExpiresAt   time.Time
}

type Manager struct {
	mu       sync.Mutex
	sessions map[string]*Session
	ipCounts map[string]int

	cfg     config.Config
	docker  *client.Client
	limiter *ratelimit.PerIPLimiter
}

func NewManager(cfg config.Config, docker *client.Client) *Manager {
	return &Manager{
		sessions: make(map[string]*Session),
		ipCounts: make(map[string]int),
		cfg:      cfg,
		docker:   docker,
		limiter:  ratelimit.New(cfg.CreateRatePerIP, cfg.CreateRateWindow, cfg.CreateRatePerIP),
	}
}

// CreateSession enforces, in order: per-IP rate limit, per-IP concurrency
// cap, then global capacity cap — cheapest checks first so an abusive
// client gets rejected before we touch Docker at all.
func (m *Manager) CreateSession(ctx context.Context, ip string) (*Session, error) {
	if !m.limiter.Allow(ip) {
		return nil, ErrRateLimited
	}

	m.mu.Lock()
	if m.ipCounts[ip] >= m.cfg.MaxConcurrentPerIP {
		m.mu.Unlock()
		return nil, ErrTooManyConcurrent
	}
	if len(m.sessions) >= m.cfg.MaxTotalSessions {
		m.mu.Unlock()
		return nil, ErrAtCapacity
	}
	m.mu.Unlock()

	id, err := newSessionID()
	if err != nil {
		return nil, fmt.Errorf("generate session id: %w", err)
	}

	containerID, err := sandbox.NewSandboxContainer(ctx, m.docker, m.cfg, id)
	if err != nil {
		return nil, fmt.Errorf("provision sandbox: %w", err)
	}
	if err := sandbox.StartContainer(ctx, m.docker, containerID); err != nil {
		_ = sandbox.StopAndRemove(context.Background(), m.docker, containerID)
		return nil, fmt.Errorf("start sandbox: %w", err)
	}

	now := time.Now()
	sess := &Session{
		ID:          id,
		ContainerID: containerID,
		IP:          ip,
		CreatedAt:   now,
		ExpiresAt:   now.Add(m.cfg.SessionTTL),
	}

	m.mu.Lock()
	m.sessions[id] = sess
	m.ipCounts[ip]++
	m.mu.Unlock()

	return sess, nil
}

func (m *Manager) Get(id string) (*Session, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	s, ok := m.sessions[id]
	if !ok || time.Now().After(s.ExpiresAt) {
		return nil, false
	}
	return s, true
}

// Destroy stops and removes the session's container and drops it from the
// tracking map. Safe to call concurrently and safe to call twice (second
// call is a no-op) — both the reaper and an explicit "end session" request
// from the frontend can race to call this.
func (m *Manager) Destroy(ctx context.Context, id string) error {
	m.mu.Lock()
	sess, ok := m.sessions[id]
	if !ok {
		m.mu.Unlock()
		return ErrNotFound
	}
	delete(m.sessions, id)
	m.ipCounts[sess.IP]--
	if m.ipCounts[sess.IP] <= 0 {
		delete(m.ipCounts, sess.IP)
	}
	m.mu.Unlock()

	return sandbox.StopAndRemove(ctx, m.docker, sess.ContainerID)
}

// ExpiredSessionIDs returns the IDs of every session whose TTL has passed.
// Used by the reaper; kept as a pure read so reaper.go owns all the "what
// do we do about it" logic and manager.go stays focused on state.
func (m *Manager) ExpiredSessionIDs() []string {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()
	var expired []string
	for id, s := range m.sessions {
		if now.After(s.ExpiresAt) {
			expired = append(expired, id)
		}
	}
	return expired
}

func (m *Manager) ActiveCount() int {
	m.mu.Lock()
	defer m.mu.Unlock()
	return len(m.sessions)
}

func (m *Manager) Docker() *client.Client { return m.docker }
func (m *Manager) Cfg() config.Config     { return m.cfg }

func newSessionID() (string, error) {
	b := make([]byte, 16) // 128 bits — unguessable, since v1 has no auth at all
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
