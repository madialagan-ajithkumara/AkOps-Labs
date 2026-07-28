# Abuse prevention: what's built in, and where to tune it

Every knob below lives in `backend/config/config.go` and is set via env var
(see `.env.example` / `docker-compose.yml`). Nothing abuse-relevant is
hardcoded elsewhere — if you're tuning this as you scale, this file and
`config.go` are the only two places you should need to look.

## Layer 1 — before Docker is ever touched

**Per-IP rate limit on session creation** (`ratelimit/limiter.go`,
`CREATE_RATE_PER_IP` / `CREATE_RATE_WINDOW_SECONDS`, default 5 per 10 min).
A token-bucket limiter per source IP. This stops rapid create/destroy
cycling — someone scripting "create session, run one command, let it
expire, repeat" to multiply their effective concurrency or just to hammer
the box. Tune this *down* first if you see session-creation request spam
in logs; it's the cheapest check (happens before any container work) so a
tighter limit here protects everything downstream.

**Per-IP concurrency cap** (`MAX_CONCURRENT_PER_IP`, default 2). Independent
of the rate limit above — this caps how many sessions one IP can hold
*open at once*, regardless of how slowly they were created. Raise this
only if you have a legitimate reason (e.g. a classroom scenario behind a
single NAT'd IP) — otherwise it's your main defense against one visitor
quietly consuming a large slice of `MAX_TOTAL_SESSIONS`.

**Global capacity cap** (`MAX_TOTAL_SESSIONS`, default 40). A hard ceiling
across all users combined, sized to the host's RAM (see README's sizing
section). When hit, new session requests get a 503 rather than the box
being pushed into OOM territory. This is the setting to lower first if
the host ever gets memory-pressured, and the one to raise carefully (with
`docker stats` monitoring) if you add RAM or CPU.

## Layer 2 — the container itself

**Resource limits per session** (`MEMORY_LIMIT_MB`, `NANO_CPUS`,
`PIDS_LIMIT`, all in `sandbox/container.go`'s `HostConfig.Resources`):
- Memory: caps what one session can consume; `MemorySwap` is set equal to
  `Memory` to disable swap entirely for that container (no swapping to
  disk means no session can "just page to disk forever" as a workaround).
- NanoCPUs: caps CPU *share*, not a hard freeze — a session can still burst
  briefly, it just can't sustain more than its share when the box is busy.
- PidsLimit: caps process count, which is the actual defense against a
  fork bomb (`:(){ :|:& };:`) — without this, a fork bomb inside a
  memory-capped container can still exhaust the host's PID table.

**No outbound network by default** (`NETWORK_MODE=none`). This is arguably
the single highest-leverage abuse control here: an anonymous, unauthenticated
sandbox with outbound internet access is an open invitation to be used for
port scanning, spam relaying, or joining something's botnet — regardless of
CPU/memory limits. Keeping it `none` means that risk category doesn't exist.
**If/when a lesson needs network** (e.g. "curl a public API"), don't just
flip this to `bridge` globally — add an explicit allowlist mechanism
instead: a dedicated Docker network with egress restricted via `iptables`
to specific destination IPs/ports, attached only to the containers for
that specific lesson. Treat every allowlist entry as a deliberate,
reviewed decision, not a default.

**Filesystem constraints** (`ReadonlyRootfs: true` + sized `tmpfs` mounts
for `/tmp` and `/home/learner/tmp`): bounds disk usage per session
regardless of what the learner does, and means a killed/expired container
leaves nothing behind to clean up beyond removing the container itself.

**Capability drops + no-new-privileges + non-root user**: `CapDrop: ["ALL"]`
removes every Linux capability (no `CAP_NET_ADMIN`, no `CAP_SYS_ADMIN`,
etc.), `no-new-privileges` blocks setuid-based privilege escalation even if
a learner found a setuid binary, and the image runs as a non-root
`learner` user by default (`sandbox-image/Dockerfile`). These three stack
with gVisor rather than substitute for it — gVisor limits what syscalls
can even reach the host kernel; these limit what the (already sandboxed)
process could do even if it got further than expected.

## Layer 3 — time and lifecycle

**Hard TTL + reaper** (`SESSION_TTL_SECONDS` default 1800 = 30 min,
`REAP_INTERVAL_SECONDS` default 20). The reaper sweeps every 20s and
destroys anything past its expiry, independent of whether the learner's
tab is open, closed, or the WebSocket dropped uncleanly. Raise the TTL for
longer lesson formats, but every extra minute of TTL is extra
`MAX_TOTAL_SESSIONS × TTL` worth of resource-hours available to an
abuser too — if you raise TTL significantly, consider lowering
`MAX_CONCURRENT_PER_IP` or `MAX_TOTAL_SESSIONS` to compensate.

**Startup orphan sweep** (`session.SweepOrphans`, runs once before the
server starts accepting traffic): because session state is in-memory only,
a backend crash/restart would otherwise leak every container it had been
tracking — this finds anything labeled `akops.sandbox=true` in Docker that
isn't in the (empty, post-restart) session map and removes it. This is
also why containers are labeled rather than named predictably — the label
is the source of truth for "does this service own this container," not
the in-memory map.

## Layer 4 — network-facing surface

**Unguessable session IDs** (128-bit random hex, `crypto/rand`). There's no
authentication in v1, so the session ID *is* the only thing standing
between "your terminal" and "someone else's terminal." 128 bits of
cryptographically random ID is not brute-forceable; don't switch this to
anything sequential or timestamp-based even for debugging convenience.

**WebSocket Origin check** (`ALLOWED_ORIGINS`, checked in
`api/handlers.go`'s `originAllowed`). Stops a malicious third-party page
from opening a WebSocket to a visitor's already-authenticated... well,
there's no auth in v1, but this still stops a third-party site from
puppeteering a visitor's browser into creating/attaching to sandbox
sessions using the visitor's IP/quota, which matters once IP-based limits
are your main defense.

**`TRUST_PROXY`** (default `false`). Only set this `true` if the service
sits behind a reverse proxy you control (Caddy/nginx on the same box) that
you've configured to *overwrite* rather than *append to* `X-Forwarded-For`.
If this is `true` and any client can freely set that header, every
per-IP control in this document becomes trivially bypassable — this is the
single most security-critical setting in the whole config.

## As you scale past one instance

Everything above assumes one process, one in-memory map, one Docker
daemon. If you outgrow that:

- **Session state**: move the `sessions`/`ipCounts` maps to Redis (or
  self-hosted, not a managed tier — see README's cost-avoidance section)
  so multiple backend instances share state and a per-IP cap actually
  holds across instances instead of being per-instance.
- **Rate limiting**: same story — a per-process token bucket only limits
  requests hitting *that* process. Move to a shared store (Redis again, or
  a proxy-layer rate limiter like nginx's `limit_req`) once you're behind
  a load balancer.
- **Consider Cloudflare (free tier)** in front of the public site as an
  additional, free layer of DDoS absorption and per-IP throttling before
  traffic even reaches your Oracle box — complementary to, not a
  replacement for, the app-level limits above.
- **Add a lightweight human check before session creation** (e.g. a simple
  proof-of-work challenge or Cloudflare Turnstile, both free) if you start
  seeing scripted abuse that IP-based limits alone don't catch — this is
  a bigger product decision (v1 explicitly wants no signup/friction) so
  weigh it against the abuse you're actually seeing, don't add it
  preemptively.
