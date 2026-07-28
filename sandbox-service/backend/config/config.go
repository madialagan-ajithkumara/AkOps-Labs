// Package config centralizes every tunable knob for the sandbox service.
// Nothing here is hardcoded elsewhere in the codebase — if you need to
// change a limit, change it here (or via env var) and it takes effect
// everywhere that reads Config.
package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	// ListenAddr is the address the HTTP/WebSocket server binds to.
	ListenAddr string

	// DockerHost, if set, overrides DOCKER_HOST for the Docker client.
	// Leave empty to use the default (unix:///var/run/docker.sock).
	DockerHost string

	// Runtime is the OCI runtime passed to container creation.
	// "" or "runc"  -> default Docker runtime (use this for local dev,
	//                  since most dev machines don't have gVisor installed).
	// "runsc"       -> gVisor. Use this in production on the Oracle box.
	// "kata"        -> Kata Containers, if you swap isolation layers later.
	// This is the ONLY place the isolation layer is selected — swapping
	// gVisor for Kata/Firecracker later is a one-line env var change,
	// nothing in the frontend or session manager needs to know.
	Runtime string

	// SandboxImage is the image used for learner containers. Build it
	// from sandbox-image/Dockerfile and reference it by local tag so the
	// backend never needs to pull from a registry per-session.
	SandboxImage string

	// SessionTTL is how long a session lives before the reaper kills it.
	SessionTTL time.Duration

	// ReapInterval is how often the reaper sweeps for expired sessions.
	// Keep this short (15-30s) so TTL enforcement is prompt even under load.
	ReapInterval time.Duration

	// Resource limits applied to every learner container.
	MemoryLimitMB int64
	NanoCPUs      int64 // e.g. 500_000_000 = 0.5 CPU
	PidsLimit     int64

	// NetworkMode is the Docker network mode for learner containers.
	// "none" by default — no outbound network at all. If a specific lesson
	// needs network access, that's a deliberate opt-in at the session-create
	// call site (a different, restricted network), never the default.
	NetworkMode string

	// Abuse-resistance knobs.
	MaxConcurrentPerIP int           // concurrent sessions a single IP may hold
	MaxTotalSessions   int           // hard cap across all users (sized to host RAM)
	CreateRatePerIP    int           // session creations allowed per window, per IP
	CreateRateWindow   time.Duration // the window CreateRatePerIP applies to

	// TrustProxy controls whether X-Forwarded-For is honored for client IP
	// extraction. Only enable this if the service sits behind a reverse
	// proxy/load balancer you control (e.g. Caddy/nginx on the same box) —
	// otherwise a learner can spoof this header and dodge per-IP limits.
	TrustProxy bool

	// AllowedOrigins is the set of Origin header values accepted for
	// WebSocket upgrades, to stop cross-site pages from opening terminals
	// against a visitor's browser session. Comma-separated env var.
	AllowedOrigins []string
}

func Load() Config {
	return Config{
		ListenAddr:         getEnv("LISTEN_ADDR", ":8080"),
		DockerHost:         getEnv("DOCKER_HOST", ""),
		Runtime:            getEnv("RUNTIME", ""), // "" = default runc runtime
		SandboxImage:       getEnv("SANDBOX_IMAGE", "akops-sandbox:latest"),
		SessionTTL:         time.Duration(getEnvInt("SESSION_TTL_SECONDS", 1800)) * time.Second, // 30 min
		ReapInterval:       time.Duration(getEnvInt("REAP_INTERVAL_SECONDS", 20)) * time.Second,
		MemoryLimitMB:      int64(getEnvInt("MEMORY_LIMIT_MB", 256)),
		NanoCPUs:           int64(getEnvInt("NANO_CPUS", 500_000_000)), // 0.5 CPU
		PidsLimit:          int64(getEnvInt("PIDS_LIMIT", 64)),
		NetworkMode:        getEnv("NETWORK_MODE", "none"),
		MaxConcurrentPerIP: getEnvInt("MAX_CONCURRENT_PER_IP", 2),
		MaxTotalSessions:   getEnvInt("MAX_TOTAL_SESSIONS", 40),
		CreateRatePerIP:    getEnvInt("CREATE_RATE_PER_IP", 5),
		CreateRateWindow:   time.Duration(getEnvInt("CREATE_RATE_WINDOW_SECONDS", 600)) * time.Second, // 10 min
		TrustProxy:         getEnvBool("TRUST_PROXY", false),
		AllowedOrigins:     splitCSV(getEnv("ALLOWED_ORIGINS", "http://localhost:8081")),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if v := os.Getenv(key); v != "" {
		if b, err := strconv.ParseBool(v); err == nil {
			return b
		}
	}
	return fallback
}

func splitCSV(s string) []string {
	var out []string
	start := 0
	for i := 0; i <= len(s); i++ {
		if i == len(s) || s[i] == ',' {
			if i > start {
				out = append(out, s[start:i])
			}
			start = i + 1
		}
	}
	return out
}
