# gVisor (runsc) setup on an Oracle Cloud Always Free ARM instance

This turns on real syscall-level container isolation for learner sessions.
Do this on the actual Oracle VM — not needed for local dev (see main
README for why `RUNTIME` defaults empty there).

Everything below assumes an Ubuntu (22.04+) ARM64 "Always Free" shape
(`VM.Standard.A1.Flex`, 4 OCPU / 24GB). Adjust package manager commands if
you picked Oracle Linux instead.

## 1. Install Docker CE

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Let your user run docker without sudo (log out/in after this)
sudo usermod -aG docker $USER
```

## 2. Install gVisor's `runsc` (arm64 build)

gVisor ships prebuilt arm64 binaries. Pin a specific release rather than
always pulling `latest` in production, so a gVisor update can't silently
change behavior under you — check https://gvisor.dev/docs/user_guide/install/
for the current recommended release tag and substitute it below.

```bash
ARCH=$(uname -m)   # should print aarch64
URL=https://storage.googleapis.com/gvisor/releases/release/latest/arm64

sudo curl -fsSL ${URL}/runsc -o /usr/local/bin/runsc
sudo curl -fsSL ${URL}/containerd-shim-runsc-v1 -o /usr/local/bin/containerd-shim-runsc-v1
sudo chmod +x /usr/local/bin/runsc /usr/local/bin/containerd-shim-runsc-v1
```

Sanity check the binary runs at all before wiring it into Docker:

```bash
/usr/local/bin/runsc --version
```

## 3. Register `runsc` as a Docker runtime

Edit (or create) `/etc/docker/daemon.json`:

```json
{
  "runtimes": {
    "runsc": {
      "path": "/usr/local/bin/runsc"
    }
  }
}
```

If the file already has other keys (e.g. `log-driver`), merge this in
rather than replacing the file.

```bash
sudo systemctl restart docker
```

## 4. Verify gVisor is actually intercepting syscalls

```bash
docker run --rm --runtime=runsc hello-world
```

Then confirm the container is really running under gVisor's sentry, not
silently falling back to runc:

```bash
docker run --rm --runtime=runsc ubuntu:22.04 dmesg | head -1
# Should show something like "Starting gVisor..." rather than a normal
# Linux kernel boot banner — a real Linux dmesg banner here means runsc
# isn't actually being used.
```

## 5. Point the sandbox service at it

Nothing in the Go code changes. Just set the env var (see `.env` from the
main README) before starting the backend on this box:

```bash
RUNTIME=runsc
```

## 6. Platform choice: `ptrace` vs `systrap`/KVM

gVisor supports multiple internal platforms for intercepting syscalls.
`ptrace` works everywhere with no special host support and is the safest
default to start with — it's also noticeably slower than the alternatives.
If interactive shell responsiveness feels sluggish once you have real
traffic, look at gVisor's `systrap` platform (newer, doesn't need KVM,
generally faster than ptrace) via the `--platform` flag in `runsc`'s
config — but validate ptrace works end-to-end first before optimizing.

```json
{
  "runtimes": {
    "runsc": {
      "path": "/usr/local/bin/runsc",
      "runtimeArgs": ["--platform=systrap"]
    }
  }
}
```

## 7. Oracle-specific firewall notes

Oracle's free-tier images typically ship with restrictive `iptables` rules
by default (only SSH open), **on top of** the Oracle Cloud "Security List"
/ "Network Security Group" at the VCN level — you need to open the port
your backend/frontend listen on (e.g. 443 if you put Caddy/nginx with TLS
in front, which you should for a public site) in **both** places:

```bash
# On the instance itself (iptables) — Oracle images often use netfilter-persistent
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

# In the OCI console: VCN > Security Lists (or NSGs) > add an ingress rule
# for 0.0.0.0/0 on TCP/443 (and 80 if you're doing Let's Encrypt HTTP-01
# challenges).
```

A public, anonymous, unauthenticated terminal endpoint is exactly the kind
of thing you want behind TLS from day one (WebSocket traffic carrying
keystrokes should not be plaintext) — free options: Caddy (automatic
Let's Encrypt certs, one binary) or nginx + certbot, either self-hosted on
the same instance. No paid load balancer needed at this scale.
