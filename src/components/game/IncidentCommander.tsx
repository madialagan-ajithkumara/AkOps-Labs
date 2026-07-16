"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, Trophy, Siren, Timer as TimerIcon, CheckCircle2 } from "lucide-react";
import { incidentScenarios } from "@/lib/incident-scenarios";
import { addXp } from "@/lib/progress";

type Status = "intro" | "playing" | "scenario-complete" | "finished";

const BEST_KEY = "akops-incidentcommander-best-score";
const MISTAKE_PENALTY = 3;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function IncidentCommander() {
  const [status, setStatus] = useState<Status>("intro");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const startedAt = useRef(0);

  const scenario = incidentScenarios[scenarioIndex];
  const totalScore = useMemo(() => scores.reduce((a, b) => a + b, 0), [scores]);

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0) {
      finish(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  function start(idx: number) {
    const sc = incidentScenarios[idx];
    setScenarioIndex(idx);
    setPool(shuffle(sc.steps.map((s) => s.id)));
    setPlaced([]);
    setMistakes(0);
    setTimeLeft(sc.timeLimit);
    startedAt.current = Date.now();
    setStatus("playing");
  }

  function finish(timedOut: boolean) {
    const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
    const ratio = placed.length / scenario.steps.length;
    const score = Math.max(0, Math.round(1000 * ratio - mistakes * 40 - elapsed * 4));
    setScores((prev) => [...prev, score]);
    if (!timedOut && scenarioIndex < incidentScenarios.length - 1) {
      setStatus("scenario-complete");
    } else {
      setStatus("finished");
    }
  }

  function pick(id: string) {
    if (status !== "playing") return;
    const expected = scenario.steps[placed.length]?.id;
    if (id === expected) {
      const next = [...placed, id];
      setPool((p) => p.filter((x) => x !== id));
      setPlaced(next);
      if (next.length === scenario.steps.length) finish(false);
    } else {
      setMistakes((m) => m + 1);
      setTimeLeft((t) => Math.max(0, t - MISTAKE_PENALTY));
    }
  }

  function restart() {
    setScores([]);
    start(0);
  }

  useEffect(() => {
    if (status === "finished") {
      if (bestScore === null || totalScore > bestScore) {
        window.localStorage.setItem(BEST_KEY, String(totalScore));
        setBestScore(totalScore);
      }
      addXp(Math.max(20, Math.round(totalScore / 10)), "incident-commander");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const stepLabel = (id: string) => scenario.steps.find((s) => s.id === id)?.label ?? id;
  const progressPct = scenario ? Math.round((timeLeft / scenario.timeLimit) * 100) : 0;

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Siren className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Incident Commander</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Click the incident-response steps in the right order before the
            timer runs out. Three scenarios, real triage playbooks.
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={() => start(0)}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35"
          >
            <Play className="h-4 w-4" />
            Declare Incident
          </button>
        </div>
      )}

      {status === "playing" && scenario && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent">{scenario.name}</p>
              <p className="mt-1 text-sm text-muted">
                Scenario {scenarioIndex + 1} of {incidentScenarios.length} · Mistakes: {mistakes}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <TimerIcon className="h-4 w-4 text-accent" />
              {timeLeft}s
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-tint">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Response timeline</p>
            <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-dashed border-hairline bg-tint p-3 min-h-[52px]">
              {placed.length === 0 && <span className="text-xs text-muted">Click steps below in the right order...</span>}
              {placed.map((id, i) => (
                <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {i + 1}. {stepLabel(id)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {pool.map((id) => (
              <button
                key={id}
                onClick={() => pick(id)}
                className="rounded-xl border border-hairline bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
              >
                {stepLabel(id)}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "scenario-complete" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Incident resolved</h2>
          <p className="mt-2 text-sm text-muted">
            Score: <span className="font-bold text-foreground">{scores[scores.length - 1]}</span>
          </p>
          <button
            onClick={() => start(scenarioIndex + 1)}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35"
          >
            Next scenario
            <Play className="h-4 w-4" />
          </button>
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">All clear!</h2>
          <p className="mt-2 text-sm text-muted">Total score</p>
          <p className="text-4xl font-extrabold text-gradient">{totalScore}</p>
          {bestScore !== null && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best: {bestScore}
            </p>
          )}
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
