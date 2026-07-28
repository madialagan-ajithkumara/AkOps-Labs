# AkOps Labs — Terminal Sandbox (v1)

A self-hosted, free-tier-friendly browser terminal sandbox: learner clicks
"Start Lab," gets a real Linux shell in the browser via xterm.js, runs real
commands inside a gVisor-isolated container, and the session auto-expires.
No signup, no Kubernetes, designed to run on a single Oracle Cloud Always
Free ARM instance (4 OCPU / 24GB RAM).

## How it fits together

```
 browser (xterm.js)
      |  HTTPS: POST /api/sessions
      |  WSS:   /ws/sessions/{id}
      v
 Go backend  ──controls──>  Docker daemon (runtime=runsc / gVisor)
      |                            |
      | session map                v
      | (id -> containerID,   learner container (per session)
      |  expiry, IP)          - CapDrop ALL, no-new-privileges
      |                       - read-only rootfs + sized tmpfs
   reaper goroutine           - NetworkMode: none by default
   (sweeps expired            - Memory/CPU/PIDs limits
    sessions on a timer)      - non-root `learner` user
```

Nothing here needs Kubernetes at this scale — the "orchestrator" is an
in-memory map in the Go process plus a goroutine that sweeps it on a timer.
See `docs/ABUSE_PREVENTION.md` for what to swap in if you outgrow one box.

## ⚠️ This code was written without a Go toolchain or Docker available

The environment that wrote this project had no Go compiler, no Docker, and
no network access to the Go module proxy — so **none of this has been
compiled or run yet**. The code targets a specific, current shape of the
`docker/docker` Go SDK (`github.com/docker/docker` ~v25, see the version-
drift comment at the top of `backend/sandbox/container.go`), but Docker has
renamed option types across releases before, and it may again. The very
first thing to do is:

```bash
cd sandbox-service/backend
go mod tidy    # generates go.sum against the real module proxy
go build ./...
```

If `go build` complains about an undefined `container.XOptions` type, that
is reliably a 1:1 rename — check that type's current name in your resolved
`docker/docker` version's CHANGELOG and fix the identifier, not the logic.
Report back what you see and it's a quick fix.

## Run the full flow locally

Prerequisites: Docker + Docker Compose on your machine (gVisor is **not**
required for local testing — see below).

```bash
cd sandbox-service

# 1. Build the learner sandbox image (once, or whenever you change it)
docker build -t akops-sandbox:latest ./sandbox-image

# 2. Copy env defaults
cp .env.example .env

# 3. Bring up backend + frontend
docker compose up --build
```

Then open **http://localhost:8081**, click **Start Lab**, and you should
get a live shell within a couple seconds. Try:

```bash
whoami        # -> learner
touch /home/learner/tmp/hello
```

...then click **Submit** — it runs `test -f /home/learner/tmp/hello` inside
your container and reports pass/fail. Leave the tab open and the countdown
timer will show the session's remaining TTL; the backend's reaper destroys
the container server-side regardless of whether the tab is open.

### Why `RUNTIME` is empty by default here

Local dev machines essentially never have gVisor installed, so
`docker-compose.yml` defaults `RUNTIME=` (empty → Docker's normal `runc`
runtime) so the compose stack works out of the box. **This is not the
production configuration** — see `docs/GVISOR_SETUP.md` for turning on
`runsc` (gVisor) on the actual Oracle instance. Flipping that one env var
is the entire migration; nothing in the Go code or frontend changes,
which is the point of keeping the runtime name in config instead of
hardcoded anywhere.

## Deploying to the Oracle Always Free instance

See `docs/GVISOR_SETUP.md` for the ARM-specific install steps (Docker CE,
gVisor `runsc` + containerd shim, `daemon.json` runtime registration,
firewall/security-list rules) and `docs/ABUSE_PREVENTION.md` for what to
tune as real traffic shows up.

## Sizing the free-tier box

At the defaults (256MB / 0.5 CPU per session, `MAX_TOTAL_SESSIONS=40`):

- 40 sessions × 256MB = 10GB, leaving ~14GB headroom on a 24GB box for the
  host OS, Docker daemon, gVisor sentry processes (one per container — this
  is real overhead gVisor adds vs. plain runc, budget for it), and the
  backend itself. **Don't just raise `MAX_TOTAL_SESSIONS` to "use all the
  RAM"** — leave real headroom or the OOM killer starts picking victims for
  you, including possibly the backend process.
- 40 sessions × 0.5 NanoCPU = 20 of your 4 physical OCPUs *if fully busy at
  once*, which oversubscribes the box on paper — that's normal and fine for
  bursty interactive shell usage (nobody's shell is pegging a core
  continuously), but if lessons start including CPU-heavy commands, lower
  `MAX_TOTAL_SESSIONS` or `NANO_CPUS` rather than letting contention degrade
  everyone's terminal responsiveness.
- Start conservative (`MAX_TOTAL_SESSIONS=20-25`) and watch `docker stats`
  / host memory under real traffic before raising it.

## Where costs could sneak in (all avoidable on free tier)

- **Egress bandwidth**: irrelevant today since `NETWORK_MODE=none` means
  learner containers can't send traffic anywhere. If you later add an
  outbound allowlist for a specific lesson, that traffic *does* count
  against OCI's free egress allowance (10TB/month — very hard to hit, but
  not zero).
- **Docker Hub pull-rate limits**: not a spend, but a hard failure mode —
  anonymous pulls are capped at 100/6h per IP. This is why the sandbox
  image is built and tagged **locally** rather than pulled from a registry
  per session; the backend never calls `docker pull`.
- **Any managed service** (RDS-style DB, managed Redis, a cloud load
  balancer, managed logging/metrics): v1 needs none of these — the session
  map is in-process memory, and reaping is a goroutine. If you later add
  Redis for multi-instance session state, self-host it in a container on
  the same box rather than reaching for a managed tier.
