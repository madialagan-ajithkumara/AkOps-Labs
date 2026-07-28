// Package api wires HTTP + WebSocket requests to the session manager. This
// is the only layer that knows about HTTP status codes, JSON shapes, and
// the WebSocket upgrade handshake — session/manager.go and sandbox/*.go
// stay transport-agnostic.
package api

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net"
	"net/http"
	"strings"
	"time"

	"akops-sandbox/grading"
	"akops-sandbox/session"

	"github.com/gorilla/websocket"
)

type Server struct {
	manager *session.Manager
	mux     *http.ServeMux
}

func NewServer(manager *session.Manager) *Server {
	s := &Server{manager: manager, mux: http.NewServeMux()}
	s.routes()
	return s
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) { s.mux.ServeHTTP(w, r) }

func (s *Server) routes() {
	s.mux.HandleFunc("GET /healthz", s.handleHealth)
	s.mux.HandleFunc("POST /api/sessions", s.handleCreateSession)
	s.mux.HandleFunc("GET /ws/sessions/{id}", s.handleWebSocket)
	s.mux.HandleFunc("POST /api/sessions/{id}/submit", s.handleSubmit)
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status":         "ok",
		"activeSessions": s.manager.ActiveCount(),
	})
}

type createSessionResponse struct {
	SessionID string    `json:"sessionId"`
	WSPath    string    `json:"wsPath"`
	ExpiresAt time.Time `json:"expiresAt"`
}

func (s *Server) handleCreateSession(w http.ResponseWriter, r *http.Request) {
	ip := clientIP(r, s.manager.Cfg().TrustProxy)

	ctx, cancel := context.WithTimeout(r.Context(), 20*time.Second)
	defer cancel()

	sess, err := s.manager.CreateSession(ctx, ip)
	if err != nil {
		switch {
		case errors.Is(err, session.ErrRateLimited):
			writeError(w, http.StatusTooManyRequests, err.Error())
		case errors.Is(err, session.ErrTooManyConcurrent):
			writeError(w, http.StatusTooManyRequests, err.Error())
		case errors.Is(err, session.ErrAtCapacity):
			writeError(w, http.StatusServiceUnavailable, err.Error())
		default:
			log.Printf("create session failed: %v", err)
			writeError(w, http.StatusInternalServerError, "failed to start a lab session")
		}
		return
	}

	writeJSON(w, http.StatusCreated, createSessionResponse{
		SessionID: sess.ID,
		WSPath:    "/ws/sessions/" + sess.ID,
		ExpiresAt: sess.ExpiresAt,
	})
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
}

func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	sess, ok := s.manager.Get(id)
	if !ok {
		http.Error(w, "session not found or expired", http.StatusNotFound)
		return
	}

	if !originAllowed(r, s.manager.Cfg().AllowedOrigins) {
		http.Error(w, "origin not allowed", http.StatusForbidden)
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("websocket upgrade failed for session %s: %v", id, err)
		return
	}
	defer ws.Close()

	shell, err := startShellForSession(r.Context(), s, sess)
	if err != nil {
		log.Printf("failed to start shell for session %s: %v", id, err)
		_ = ws.WriteMessage(websocket.TextMessage, []byte("failed to start shell: "+err.Error()))
		return
	}
	defer shell.Close()

	if err := shell.Bridge(ws); err != nil {
		log.Printf("session %s bridge ended: %v", id, err)
	}
}

type submitRequest struct {
	CheckID string `json:"checkId"`
}

type submitResponse struct {
	Pass    bool   `json:"pass"`
	Message string `json:"message"`
}

func (s *Server) handleSubmit(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	sess, ok := s.manager.Get(id)
	if !ok {
		writeError(w, http.StatusNotFound, "session not found or expired")
		return
	}

	var req submitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	result, err := grading.Run(ctx, s.manager.Docker(), sess.ContainerID, req.CheckID)
	if err != nil {
		log.Printf("grading failed for session %s: %v", id, err)
		writeError(w, http.StatusInternalServerError, "failed to run check")
		return
	}

	writeJSON(w, http.StatusOK, submitResponse{Pass: result.Pass, Message: result.Message})
}

// clientIP extracts the request's source IP. X-Forwarded-For is only
// honored when trustProxy is true — enable that ONLY if this service sits
// behind a reverse proxy you control (e.g. Caddy/nginx on the same box),
// otherwise any learner can spoof the header and dodge every per-IP limit.
func clientIP(r *http.Request, trustProxy bool) string {
	if trustProxy {
		if fwd := r.Header.Get("X-Forwarded-For"); fwd != "" {
			parts := strings.Split(fwd, ",")
			return strings.TrimSpace(parts[0])
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func originAllowed(r *http.Request, allowed []string) bool {
	origin := r.Header.Get("Origin")
	if origin == "" {
		// No Origin header at all (e.g. a non-browser client) — allow, since
		// this is the same policy a plain HTTP API would have. Browsers
		// always send Origin for cross-origin WS, which is what we care about.
		return true
	}
	for _, a := range allowed {
		if a == origin {
			return true
		}
	}
	return false
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
