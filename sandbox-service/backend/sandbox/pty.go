// This file handles the interactive PTY side: exec a shell inside a running
// learner container with a real TTY attached, and bridge it to a WebSocket.
// We deliberately use Docker's own exec+attach machinery (rather than
// shelling out to `docker exec` or implementing our own PTY allocation) —
// it already does the right thing across runc and gVisor (runsc) runtimes,
// which is exactly the "swap the isolation layer without touching the rest
// of the stack" property we want.
package sandbox

import (
	"context"
	"fmt"
	"io"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/gorilla/websocket"
)

// ExecSession holds everything needed to talk to one interactive shell
// running inside a learner's container.
type ExecSession struct {
	ExecID string
	conn   *client.HijackedResponse
	cli    *client.Client
}

// StartShell execs an interactive login shell inside the given container
// with a TTY attached, ready to be bridged to a WebSocket.
func StartShell(ctx context.Context, cli *client.Client, containerID string) (*ExecSession, error) {
	execCfg := container.ExecOptions{
		Cmd:          []string{"/bin/bash", "-l"},
		Tty:          true,
		AttachStdin:  true,
		AttachStdout: true,
		AttachStderr: true,
		Env:          []string{"TERM=xterm-256color"},
	}

	created, err := cli.ContainerExecCreate(ctx, containerID, execCfg)
	if err != nil {
		return nil, fmt.Errorf("exec create: %w", err)
	}

	hijacked, err := cli.ContainerExecAttach(ctx, created.ID, container.ExecStartOptions{Tty: true})
	if err != nil {
		return nil, fmt.Errorf("exec attach: %w", err)
	}

	return &ExecSession{ExecID: created.ID, conn: &hijacked, cli: cli}, nil
}

// Resize applies a terminal size change (from xterm.js's fit addon) to the
// exec'd shell, so full-screen TUIs (vim, tmux, less) render correctly.
func (s *ExecSession) Resize(ctx context.Context, cols, rows uint) error {
	return s.cli.ContainerExecResize(ctx, s.ExecID, container.ResizeOptions{
		Height: rows,
		Width:  cols,
	})
}

func (s *ExecSession) Close() {
	s.conn.Close()
}

// Bridge pumps bytes between the exec'd shell's PTY and a WebSocket
// connection until either side closes. It blocks until the session ends,
// so call it in its own goroutine (or let it be the last thing the request
// handler does).
//
// Wire protocol (kept deliberately tiny so the frontend stays simple):
//   - Binary WS messages from client -> raw bytes written to the shell's stdin.
//   - Text WS messages from client, if they parse as {"resize":{"cols":N,"rows":M}},
//     trigger a Resize instead of being written to stdin.
//   - Everything the shell writes to stdout/stderr is forwarded as binary
//     WS messages to the client, unmodified.
func (s *ExecSession) Bridge(ws *websocket.Conn) error {
	errCh := make(chan error, 2)

	// Shell -> browser
	go func() {
		buf := make([]byte, 32*1024)
		for {
			n, err := s.conn.Reader.Read(buf)
			if n > 0 {
				if werr := ws.WriteMessage(websocket.BinaryMessage, buf[:n]); werr != nil {
					errCh <- werr
					return
				}
			}
			if err != nil {
				if err == io.EOF {
					errCh <- nil
				} else {
					errCh <- err
				}
				return
			}
		}
	}()

	// Browser -> shell
	go func() {
		for {
			msgType, data, err := ws.ReadMessage()
			if err != nil {
				errCh <- err
				return
			}

			if msgType == websocket.TextMessage {
				if handled := s.tryHandleControlMessage(data); handled {
					continue
				}
			}

			if _, werr := s.conn.Conn.Write(data); werr != nil {
				errCh <- werr
				return
			}
		}
	}()

	return <-errCh
}

func (s *ExecSession) tryHandleControlMessage(data []byte) bool {
	msg, ok := parseResizeMessage(data)
	if !ok {
		return false
	}
	// Best-effort; a failed resize shouldn't kill the session.
	_ = s.Resize(context.Background(), msg.Cols, msg.Rows)
	return true
}
