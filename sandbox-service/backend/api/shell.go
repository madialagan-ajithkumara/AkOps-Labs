package api

import (
	"context"

	"akops-sandbox/sandbox"
	"akops-sandbox/session"
)

// startShellForSession is a thin wrapper so handlers.go doesn't need to
// import the sandbox package directly just for this one call.
func startShellForSession(ctx context.Context, s *Server, sess *session.Session) (*sandbox.ExecSession, error) {
	return sandbox.StartShell(ctx, s.manager.Docker(), sess.ContainerID)
}
