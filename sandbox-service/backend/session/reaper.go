package session

import (
	"context"
	"log"
	"time"

	"akops-sandbox/sandbox"
)

// StartReaper runs forever (until ctx is cancelled), sweeping expired
// sessions every ReapInterval. This is the enforcement mechanism behind the
// "hard TTL" requirement: a session's expiry is checked here regardless of
// whether the learner's browser tab is open, closed, or was never properly
// disconnected from.
func (m *Manager) StartReaper(ctx context.Context) {
	ticker := time.NewTicker(m.cfg.ReapInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			m.reapOnce(ctx)
		}
	}
}

func (m *Manager) reapOnce(ctx context.Context) {
	for _, id := range m.ExpiredSessionIDs() {
		if err := m.Destroy(ctx, id); err != nil {
			log.Printf("reaper: failed to destroy expired session %s: %v", id, err)
			continue
		}
		log.Printf("reaper: destroyed expired session %s", id)
	}
}

// SweepOrphans finds and removes any labeled sandbox container that exists
// in Docker but isn't in this Manager's in-memory session map. This matters
// specifically because session state is in-memory only (see package doc) —
// if the backend process restarts (crash, deploy, OOM-kill), every
// container it had been tracking would otherwise leak until someone
// noticed the box was out of RAM. Call this once at startup before serving
// any traffic.
func (m *Manager) SweepOrphans(ctx context.Context) {
	orphans, err := sandbox.ListOrphans(ctx, m.docker)
	if err != nil {
		log.Printf("startup orphan sweep: failed to list containers: %v", err)
		return
	}

	m.mu.Lock()
	tracked := make(map[string]bool, len(m.sessions))
	for _, s := range m.sessions {
		tracked[s.ContainerID] = true
	}
	m.mu.Unlock()

	for _, o := range orphans {
		if tracked[o.ContainerID] {
			continue
		}
		if err := sandbox.StopAndRemove(ctx, m.docker, o.ContainerID); err != nil {
			log.Printf("startup orphan sweep: failed to remove %s (session %s): %v", o.ContainerID, o.SessionID, err)
			continue
		}
		log.Printf("startup orphan sweep: removed leftover container %s (session %s)", o.ContainerID, o.SessionID)
	}
}
