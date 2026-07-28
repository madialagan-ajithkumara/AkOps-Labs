module akops-sandbox

go 1.22

require (
	github.com/docker/docker v25.0.5+incompatible
	github.com/docker/go-connections v0.5.0
	github.com/gorilla/websocket v1.5.1
	golang.org/x/time v0.5.0
)

// NOTE: go.sum is intentionally not included. This dev environment has no
// Go toolchain or internet access to the module proxy, so a real go.sum
// (with correct hashes) cannot be generated here. Run `go mod tidy` after
// copying this project to a machine with Go + network access — it will
// fetch the correct transitive dependencies (containerd, opencontainers
// image-spec, etc. are indirect deps of github.com/docker/docker) and
// generate a valid go.sum for you.
