// Command akops-sandbox is the whole backend: it creates a Docker client,
// wires up the session manager + reaper, and serves the HTTP/WebSocket API
// that the xterm.js frontend talks to.
//
// This file intentionally stays short — every interesting decision (what
// runtime to use, what limits to apply, how long a session lives) lives in
// config.Config, and every interesting behavior lives in session/, sandbox/,
// grading/, and api/. main.go just wires them together and handles
// shutdown.
package main

import (
	"context"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"akops-sandbox/api"
	"akops-sandbox/config"
	"akops-sandbox/session"

	"github.com/docker/docker/client"
)

func main() {
	cfg := config.Load()

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	dockerOpts := []client.Opt{client.FromEnv, client.WithAPIVersionNegotiation()}
	if cfg.DockerHost != "" {
		dockerOpts = append(dockerOpts, client.WithHost(cfg.DockerHost))
	}
	docker, err := client.NewClientWithOpts(dockerOpts...)
	if err != nil {
		log.Fatalf("failed to create docker client: %v", err)
	}
	defer docker.Close()

	if _, err := docker.Ping(ctx); err != nil {
		log.Fatalf("cannot reach docker daemon (is DOCKER_HOST correct and is the socket mounted?): %v", err)
	}

	manager := session.NewManager(cfg, docker)

	log.Printf("sweeping for orphaned sandbox containers from a previous run...")
	manager.SweepOrphans(ctx)

	go manager.StartReaper(ctx)

	server := api.NewServer(manager)
	httpServer := &http.Server{
		Addr:              cfg.ListenAddr,
		Handler:           server,
		ReadHeaderTimeout: 10 * time.Second,
	}

	go func() {
		log.Printf("akops-sandbox listening on %s (runtime=%q, sandbox image=%q)", cfg.ListenAddr, cfg.Runtime, cfg.SandboxImage)
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("http server error: %v", err)
		}
	}()

	<-ctx.Done()
	log.Printf("shutting down...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		log.Printf("http server shutdown error: %v", err)
	}
}
