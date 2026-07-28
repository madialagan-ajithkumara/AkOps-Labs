# Multi-stage build: compile a static binary, ship it in a minimal image.
# The backend container itself runs as a normal (non-sandboxed) process —
# it's trusted server code, not learner-controlled — but it needs the host
# Docker socket bind-mounted in (see docker-compose.yml) to create/manage
# the actual learner containers. That's a standard "sibling containers"
# pattern, not Docker-in-Docker.
FROM golang:1.22-bookworm AS build
WORKDIR /src
COPY go.mod ./
# go.sum is intentionally not committed (see go.mod comment) — this RUN
# generates it at build time, which requires network access during
# `docker build` (fine for local dev and for the Oracle box; there is no
# offline/free-tier constraint on outbound builds, only on the runtime
# learner containers).
RUN go mod download || true
COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /out/akops-sandbox .

# Using the root (not :nonroot) distroless variant deliberately: this
# process needs to read/write /var/run/docker.sock, which is normally
# owned root:docker with 660 perms. Root avoids fiddling with GID
# matching between host and container for local dev; if you want to run
# this as a non-root UID in production instead, add the container's user
# to a group matching the host docker.sock GID.
FROM gcr.io/distroless/static-debian12
COPY --from=build /out/akops-sandbox /akops-sandbox
EXPOSE 8080
ENTRYPOINT ["/akops-sandbox"]
