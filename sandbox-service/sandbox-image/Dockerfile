# Minimal learner sandbox image: just enough Linux + shell basics for
# shell-fundamentals lessons. Kept small on purpose:
#   - faster `docker build` / smaller layer cache on the Oracle box
#   - smaller attack surface inside an already-isolated (gVisor) container
#   - image is built and tagged LOCALLY (see README) so the backend never
#     needs to `docker pull` per session — that also sidesteps Docker Hub's
#     anonymous pull-rate limit (100 pulls/6h per IP), which is a real risk
#     if you ever did pull-per-session at any real traffic volume.
#
# Add tool-specific images (Terraform, etc.) later as separate Dockerfiles
# with their own tag, selected per-lesson via SANDBOX_IMAGE — don't grow
# this one into a kitchen-sink image.
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y --no-install-recommends \
        bash \
        coreutils \
        curl \
        git \
        vim-tiny \
        tmux \
        jq \
        less \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Non-root by default. Combined with the backend's CapDrop: ["ALL"],
# no-new-privileges, and read-only rootfs, a learner has no path to root
# even before gVisor's syscall interception comes into play.
RUN useradd --create-home --shell /bin/bash learner \
    && mkdir -p /home/learner/tmp \
    && chown -R learner:learner /home/learner

USER learner
WORKDIR /home/learner
ENV HOME=/home/learner

# PID 1 just keeps the container alive between exec'd shell sessions —
# the backend execs an interactive /bin/bash into this container per
# WebSocket connection (see backend/sandbox/pty.go). This is why
# --init is set in the backend's HostConfig: it reaps zombie processes
# the learner's shell leaves behind (e.g. from `sleep &`, killed pipes).
CMD ["sleep", "infinity"]
