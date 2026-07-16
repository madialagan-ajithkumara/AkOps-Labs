"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Trophy, TerminalSquare, Lightbulb, ChevronRight } from "lucide-react";
import { terminalScenarios, isCommandCorrect } from "@/lib/terminal-scenarios";
import { addXp } from "@/lib/progress";

const BEST_KEY = "akops-terminal-completed";

type Status = "intro" | "briefing" | "playing" | "scenario-complete" | "finished";
type LogLine = { kind: "cmd" | "output" | "error" | "hint"; text: string };

export default function TerminalChallenge() {
  const [status, setStatus] = useState<Status>("intro");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [input, setInput] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [completedCount, setCompletedCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const scenario = terminalScenarios[scenarioIdx];
  const step = scenario?.steps[stepIdx];

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_KEY);
    if (stored) setCompletedCount(Number(stored));
  }, []);

  useEffect(() => {
    // Scroll only the terminal log container itself, never the page.
    const el = logContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  useEffect(() => {
    if (status === "playing") inputRef.current?.focus({ preventScroll: true });
  }, [status, stepIdx, scenarioIdx]);

  function startScenario(idx: number) {
    setScenarioIdx(idx);
    setStepIdx(0);
    setLog([]);
    setWrongCount(0);
    setStatus("briefing");
  }

  function beginTyping() {
    setStatus("playing");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !step) return;
    const cmd = input.trim();
    const correct = isCommandCorrect(cmd, step.accept);

    if (correct) {
      setLog((l) => [
        ...l,
        { kind: "cmd", text: cmd },
        { kind: "output", text: step.output },
      ]);
      setWrongCount(0);
      setInput("");

      if (stepIdx + 1 < scenario.steps.length) {
        setStepIdx((i) => i + 1);
      } else {
        const earned = scenario.xp;
        setTotalXp((x) => x + earned);
        addXp(earned, "terminal-challenge");
        setStatus("scenario-complete");
      }
    } else {
      setLog((l) => [...l, { kind: "cmd", text: cmd }, { kind: "error", text: "command not recognized — check the syntax and try again" }]);
      setWrongCount((c) => c + 1);
      setInput("");
    }
  }

  function requestHint() {
    if (!step) return;
    setLog((l) => [...l, { kind: "hint", text: step.hint }]);
  }

  function nextScenario() {
    if (scenarioIdx + 1 < terminalScenarios.length) {
      startScenario(scenarioIdx + 1);
    } else {
      const done = terminalScenarios.length;
      if (completedCount === null || done > completedCount) {
        window.localStorage.setItem(BEST_KEY, String(done));
        setCompletedCount(done);
      }
      setStatus("finished");
    }
  }

  function restart() {
    setTotalXp(0);
    startScenario(0);
  }

  return (
    <div className="card-surface mx-auto max-w-3xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-emerald-400">
            <TerminalSquare className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Terminal Challenge</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            A real DevOps incident, a real terminal. Type actual{" "}
            <span className="font-semibold text-foreground">kubectl</span>,{" "}
            <span className="font-semibold text-foreground">docker</span>, and{" "}
            <span className="font-semibold text-foreground">terraform</span>{" "}
            commands to diagnose and fix the problem — no multiple choice, no
            clicking. If you know the command, you'll get it right.
          </p>
          {completedCount !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> {completedCount}/{terminalScenarios.length} scenarios cleared
            </p>
          )}
          <button
            onClick={() => startScenario(0)}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 hover:shadow-xl"
          >
            <Play className="h-4 w-4" />
            Open Terminal
          </button>
        </div>
      )}

      {status === "briefing" && scenario && (
        <div className="text-center">
          <span className="inline-block rounded-full bg-tint px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted">
            Scenario {scenarioIdx + 1} of {terminalScenarios.length} · {scenario.tool}
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">{scenario.title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">{scenario.briefing}</p>
          <button
            onClick={beginTyping}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 hover:shadow-xl"
          >
            <ChevronRight className="h-4 w-4" />
            Start Diagnosing
          </button>
        </div>
      )}

      {status === "playing" && scenario && step && (
        <div>
          <div className="flex items-center justify-between text-sm font-bold">
            <span>{scenario.title}</span>
            <span className="text-muted">Step {stepIdx + 1}/{scenario.steps.length}</span>
          </div>
          <p className="mt-2 rounded-lg bg-accent-soft px-3 py-2 text-sm font-medium text-foreground">
            {step.instruction}
          </p>

          <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-[13px] shadow-inner">
            <div ref={logContainerRef} className="max-h-64 space-y-1 overflow-y-auto overscroll-contain pr-1">
              {log.map((line, i) => (
                <div key={i}>
                  {line.kind === "cmd" && (
                    <div className="text-slate-200">
                      <span className="text-emerald-400">{scenario.prompt} $</span> {line.text}
                    </div>
                  )}
                  {line.kind === "output" && (
                    <pre className="whitespace-pre-wrap text-slate-400">{line.text}</pre>
                  )}
                  {line.kind === "error" && (
                    <div className="text-red-400">{line.text}</div>
                  )}
                  {line.kind === "hint" && (
                    <div className="text-amber-400">hint: {line.text}</div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
              <span className="text-emerald-400">{scenario.prompt} $</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                className="flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600"
                placeholder="type a command..."
              />
            </form>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted">
              {wrongCount > 0 ? "Not quite — check the syntax." : "Press Enter to run the command."}
            </span>
            <button
              onClick={requestHint}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-muted hover:border-accent/40 hover:text-accent"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              Hint
            </button>
          </div>
        </div>
      )}

      {status === "scenario-complete" && scenario && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Incident resolved!</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            You fixed <span className="font-semibold text-foreground">{scenario.title}</span> using real {scenario.tool} commands. +{scenario.xp} XP
          </p>
          <button
            onClick={nextScenario}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 hover:shadow-xl"
          >
            {scenarioIdx + 1 < terminalScenarios.length ? (
              <>
                <ChevronRight className="h-4 w-4" />
                Next Scenario
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4" />
                Finish
              </>
            )}
          </button>
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">All incidents resolved!</h2>
          <p className="mt-2 text-sm text-muted">Total XP earned this run</p>
          <p className="text-4xl font-extrabold text-gradient">{totalXp}</p>
          <button
            onClick={restart}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-6 py-3 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
