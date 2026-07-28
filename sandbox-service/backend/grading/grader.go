// Package grading implements the "Submit" button: exec a non-interactive
// check script inside the learner's container and report pass/fail based
// on its exit code. v1 ships with a single example check; add more by
// adding entries to the `checks` map — each one is just a shell one-liner
// that exits 0 for pass, non-zero for fail.
package grading

import (
	"bytes"
	"context"
	"fmt"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

// checks maps a check ID (what the frontend's Submit button sends) to a
// shell command run inside the learner's container. Keep these idempotent
// and side-effect-free beyond what they're checking for.
var checks = map[string]string{
	// Example lesson: "create a file at /home/learner/tmp/hello".
	"created-tmp-hello": `test -f /home/learner/tmp/hello`,
}

type Result struct {
	Pass    bool
	Message string
}

// Run execs the named check inside containerID and returns whether it
// passed. An unknown checkID is treated as a server error, not a learner
// failure, so the frontend can distinguish "you got it wrong" from
// "something is misconfigured".
func Run(ctx context.Context, cli *client.Client, containerID, checkID string) (Result, error) {
	script, ok := checks[checkID]
	if !ok {
		return Result{}, fmt.Errorf("unknown check id: %q", checkID)
	}

	execCfg := container.ExecOptions{
		Cmd:          []string{"/bin/bash", "-c", script},
		Tty:          false,
		AttachStdout: true,
		AttachStderr: true,
		User:         "learner",
	}

	created, err := cli.ContainerExecCreate(ctx, containerID, execCfg)
	if err != nil {
		return Result{}, fmt.Errorf("grading exec create: %w", err)
	}

	attached, err := cli.ContainerExecAttach(ctx, created.ID, container.ExecStartOptions{})
	if err != nil {
		return Result{}, fmt.Errorf("grading exec attach: %w", err)
	}
	defer attached.Close()

	var out bytes.Buffer
	_, _ = out.ReadFrom(attached.Reader)

	inspect, err := cli.ContainerExecInspect(ctx, created.ID)
	if err != nil {
		return Result{}, fmt.Errorf("grading exec inspect: %w", err)
	}

	if inspect.ExitCode == 0 {
		return Result{Pass: true, Message: "Check passed."}, nil
	}
	return Result{Pass: false, Message: "Check failed. Keep trying!"}, nil
}
