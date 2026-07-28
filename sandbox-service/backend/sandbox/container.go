// Package sandbox owns the lifecycle of a single learner container: create,
// start, exec-a-shell-into, stop, remove. This is the only file that knows
// about Docker's HostConfig/Resources shape — the isolation-relevant bits
// (runtime, resource limits, network mode, capability drops) all come from
// config.Config, so swapping runsc for kata or firecracker-containerd later
// is a config change, not a rewrite of this file.
package sandbox

// NOTE ON DOCKER SDK VERSION DRIFT: this file targets github.com/docker/docker
// ~v25 (pinned in go.mod), using the container.StartOptions / StopOptions /
// RemoveOptions / ListOptions / ExecOptions naming convention. Docker has
// renamed these option types across major versions (older examples online
// use types.ContainerStartOptions etc). This code was NOT compiled in the
// environment that wrote it -- no Go toolchain or network access there.
// First step on a machine with Go installed: `go build ./...`. An
// "undefined: container.XOptions" error is reliably a 1:1 rename to look up
// in that version's CHANGELOG, never a logic change.

import (
	"context"
	"fmt"
	"time"

	"akops-sandbox/config"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
)

const (
	// LabelSandbox marks every container this service creates, so the
	// reaper can find and clean up orphans after a backend restart even
	// though the in-memory session map was lost.
	LabelSandbox   = "akops.sandbox"
	LabelSessionID = "akops.session.id"
	LabelCreatedAt = "akops.created.unix"
)

// NewSandboxContainer creates (but does not start) a learner container for
// the given session ID. The container runs `sleep infinity` as PID 1 so it
// stays alive between the learner's exec'd shell sessions (e.g. if their
// browser tab reconnects, or the "Submit" grading check runs after they've
// closed the terminal).
func NewSandboxContainer(ctx context.Context, cli *client.Client, cfg config.Config, sessionID string) (string, error) {
	containerCfg := &container.Config{
		Image:        cfg.SandboxImage,
		Cmd:          []string{"sleep", "infinity"},
		Tty:          false,
		OpenStdin:    false,
		User:         "learner",
		WorkingDir:   "/home/learner",
		Labels: map[string]string{
			LabelSandbox:   "true",
			LabelSessionID: sessionID,
			LabelCreatedAt: fmt.Sprintf("%d", time.Now().Unix()),
		},
	}

	hostCfg := &container.HostConfig{
		Runtime: cfg.Runtime, // "" = default runc, "runsc" = gVisor, swappable
		Resources: container.Resources{
			Memory:     cfg.MemoryLimitMB * 1024 * 1024,
			MemorySwap: cfg.MemoryLimitMB * 1024 * 1024, // == Memory disables swap
			NanoCPUs:   cfg.NanoCPUs,
			PidsLimit:  &cfg.PidsLimit,
		},
		NetworkMode: container.NetworkMode(cfg.NetworkMode), // "none" by default
		CapDrop:     []string{"ALL"},
		SecurityOpt: []string{"no-new-privileges:true"},
		// Root filesystem is read-only; the learner gets small, size-capped
		// tmpfs mounts for the two places they're actually expected to write.
		// This bounds disk usage per session regardless of what they do,
		// and means a crashed/killed container never leaves writes behind.
		ReadonlyRootfs: true,
		Tmpfs: map[string]string{
			"/tmp":              "size=64m,exec",
			"/home/learner/tmp": "size=64m,exec",
		},
		Mounts:      []mount.Mount{},
		AutoRemove:  false, // reaper removes explicitly at TTL, not Docker
		Privileged:  false,
		Init:        boolPtr(true), // tiny init process reaps zombies from learner's shell
	}

	resp, err := cli.ContainerCreate(ctx, containerCfg, hostCfg, nil, nil, "")
	if err != nil {
		return "", fmt.Errorf("create sandbox container: %w", err)
	}
	return resp.ID, nil
}

func StartContainer(ctx context.Context, cli *client.Client, containerID string) error {
	if err := cli.ContainerStart(ctx, containerID, container.StartOptions{}); err != nil {
		return fmt.Errorf("start sandbox container: %w", err)
	}
	return nil
}

// StopAndRemove is used by both the reaper (on TTL expiry) and explicit
// session-end. It gives the container a short grace period to stop cleanly,
// then force-removes it so a stuck learner process can never block cleanup.
func StopAndRemove(ctx context.Context, cli *client.Client, containerID string) error {
	timeout := 5 // seconds
	_ = cli.ContainerStop(ctx, containerID, container.StopOptions{Timeout: &timeout})

	removeCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()
	if err := cli.ContainerRemove(removeCtx, containerID, container.RemoveOptions{
		Force:         true,
		RemoveVolumes: true,
	}); err != nil {
		return fmt.Errorf("remove sandbox container: %w", err)
	}
	return nil
}

// ListOrphans returns every container this service ever created (by label)
// that is currently running. Called once at startup so that if the backend
// crashed and lost its in-memory session map, leftover containers still get
// cleaned up instead of silently eating RAM forever.
func ListOrphans(ctx context.Context, cli *client.Client) ([]OrphanContainer, error) {
	containers, err := cli.ContainerList(ctx, container.ListOptions{
		All: true,
		Filters: filtersForLabel(LabelSandbox, "true"),
	})
	if err != nil {
		return nil, fmt.Errorf("list containers: %w", err)
	}

	out := make([]OrphanContainer, 0, len(containers))
	for _, c := range containers {
		out = append(out, OrphanContainer{
			ContainerID: c.ID,
			SessionID:   c.Labels[LabelSessionID],
		})
	}
	return out, nil
}

type OrphanContainer struct {
	ContainerID string
	SessionID   string
}

func boolPtr(b bool) *bool { return &b }
