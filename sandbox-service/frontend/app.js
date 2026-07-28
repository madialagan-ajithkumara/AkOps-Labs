// Minimal end-to-end client: Start Lab -> POST /api/sessions -> open a
// WebSocket -> pipe it through an xterm.js Terminal. See index.html for
// why this is plain JS with no build step.
(() => {
  const API_BASE = window.AKOPS_API_BASE || "http://localhost:8080";
  const WS_BASE = API_BASE.replace(/^http/, "ws");

  const el = {
    preStart: document.getElementById("pre-start"),
    startBtn: document.getElementById("start-btn"),
    startError: document.getElementById("start-error"),
    terminalWrap: document.getElementById("terminal-wrap"),
    terminalDiv: document.getElementById("terminal"),
    submitBtn: document.getElementById("submit-btn"),
    submitResult: document.getElementById("submit-result"),
    ended: document.getElementById("ended"),
    restartBtn: document.getElementById("restart-btn"),
    timer: document.getElementById("timer"),
    timerValue: document.getElementById("timer-value"),
  };

  let term, fitAddon, ws, sessionId, countdownInterval;

  el.startBtn.addEventListener("click", startLab);
  el.restartBtn.addEventListener("click", () => location.reload());
  el.submitBtn.addEventListener("click", submitCheck);
  window.addEventListener("resize", () => fitAddon && fitAddon.fit());

  async function startLab() {
    el.startBtn.disabled = true;
    el.startError.hidden = true;

    let res;
    try {
      res = await fetch(`${API_BASE}/api/sessions`, { method: "POST" });
    } catch (e) {
      showStartError("Could not reach the sandbox server. Is the backend running?");
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      showStartError(body.error || `Failed to start session (HTTP ${res.status}).`);
      return;
    }

    const data = await res.json();
    sessionId = data.sessionId;

    el.preStart.hidden = true;
    el.terminalWrap.hidden = false;
    el.timer.hidden = false;

    startCountdown(new Date(data.expiresAt));
    openTerminal(data.wsPath);
  }

  function showStartError(message) {
    el.startError.textContent = message;
    el.startError.hidden = false;
    el.startBtn.disabled = false;
  }

  function openTerminal(wsPath) {
    term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Menlo, Consolas, monospace",
      theme: { background: "#0f172a" },
    });
    fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(el.terminalDiv);
    fitAddon.fit();

    ws = new WebSocket(`${WS_BASE}${wsPath}`);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      sendResize();
      term.focus();
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        term.write(new Uint8Array(event.data));
      } else {
        term.write(event.data);
      }
    };

    ws.onclose = () => {
      term.write("\r\n\x1b[33m[session closed]\x1b[0m\r\n");
      endSession();
    };

    ws.onerror = () => {
      term.write("\r\n\x1b[31m[connection error]\x1b[0m\r\n");
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data);
    });

    // Re-send terminal size whenever the window (and therefore the fit
    // addon's computed cols/rows) changes, so full-screen TUIs stay correct.
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
      sendResize();
    });
    resizeObserver.observe(el.terminalDiv);
  }

  function sendResize() {
    if (!term || !ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ resize: { cols: term.cols, rows: term.rows } }));
  }

  async function submitCheck() {
    if (!sessionId) return;
    el.submitBtn.disabled = true;
    el.submitResult.textContent = "Checking...";

    try {
      const res = await fetch(`${API_BASE}/api/sessions/${sessionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkId: "created-tmp-hello" }),
      });
      const data = await res.json();
      el.submitResult.textContent = data.pass ? `✅ ${data.message}` : `❌ ${data.message}`;
    } catch (e) {
      el.submitResult.textContent = "Could not reach the sandbox server.";
    } finally {
      el.submitBtn.disabled = false;
    }
  }

  function startCountdown(expiresAt) {
    function tick() {
      const remainingMs = expiresAt.getTime() - Date.now();
      if (remainingMs <= 0) {
        el.timerValue.textContent = "00:00";
        clearInterval(countdownInterval);
        return;
      }
      const totalSec = Math.floor(remainingMs / 1000);
      const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
      const ss = String(totalSec % 60).padStart(2, "0");
      el.timerValue.textContent = `${mm}:${ss}`;
    }
    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  function endSession() {
    clearInterval(countdownInterval);
    el.terminalWrap.hidden = true;
    el.timer.hidden = true;
    el.ended.hidden = false;
  }
})();
