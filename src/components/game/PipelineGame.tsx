"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, Trophy, Timer as TimerIcon, CheckCircle2, XCircle } from "lucide-react";
import { pipelineLevels } from "@/lib/pipeline-levels";

type Status = "intro" | "playing" | "level-complete" | "finished";

const BEST_SCORE_KEY = "akops-pipeline-best-score";
const MISTAKE_PENALTY_SECONDS = 3;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PipelineGame() {
  const [status, setStatus] = useState<Status>("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [levelScores, setLevelScores] = useState<number[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const level = pipelineLevels[levelIndex];
  const totalScore = useMemo(() => levelScores.reduce((a, b) => a + b, 0), [levelScores]);

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_SCORE_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0) {
      finishLevel(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  function startLevel(idx: number) {
    const lvl = pipelineLevels[idx];
    setLevelIndex(idx);
    setPool(shuffle(lvl.stages.map((s) => s.id)));
    setPlaced([]);
    setMistakes(0);
    setTimeLeft(lvl.timeLimit);
    startedAtRef.current = Date.now();
    setStatus("playing");
  }

  function finishLevel(timedOut: boolean) {
    const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000);
    const correctCount = placed.length;
    const completionRatio = correctCount / level.stages.length;
    const raw = 1000 * completionRatio - mistakes * 50 - elapsed * 5;
    const score = Math.max(0, Math.round(raw));
    setLevelScores((prev) => [...prev, score]);

    if (!timedOut && levelIndex < pipelineLevels.length - 1) {
      setStatus("level-complete");
    } else {
      setStatus("finished");
    }
  }

  function handlePick(stageId: string) {
    if (status !== "playing") return;
    const expected = level.stages[placed.length]?.id;
    if (stageId === expected) {
      const next = [...placed, stageId];
      setPool((p) => p.filter((id) => id !== stageId));
      setPlaced(next);
      if (next.length === level.stages.length) {
        finishLevel(false);
      }
    } else {
      setMistakes((m) => m + 1);
      setTimeLeft((t) => Math.max(0, t - MISTAKE_PENALTY_SECONDS));
      setShakeId(stageId);
      setTimeout(() => setShakeId(null), 400);
    }
  }

  function nextLevel() {
    startLevel(levelIndex + 1);
  }

  function restart() {
    setLevelScores([]);
    startLevel(0);
  }

  useEffect(() => {
    if (status === "finished") {
      if (bestScore === null || totalScore > bestScore) {
        window.localStorage.setItem(BEST_SCORE_KEY, String(totalScore));
        setBestScore(totalScore);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const stageLabel = (id: string) => level.stages.find((s) => s.id === id)?.label ?? id;
  const progressPct = level ? Math.round((timeLeft / level.timeLimit) * 100) : 0;

  return (
    <div className="card-surface mx-auto max-w-3xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Play className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Pipeline Speed-Run</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Click the pipeline stages in the correct order before the timer runs
            out. Wrong picks cost you {MISTAKE_PENALTY_SECONDS} seconds. Three
            levels, increasing difficulty — how fast can you ship?
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={() => startLevel(0)}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-[#17b978] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35"
          >
            <Play className="h-4 w-4" />
            Start Game
          </button>
        </div>
      )}

      {status === "playing" && level && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent">{level.name}</p>
              <p className="mt-1 text-sm text-muted">
                Level {levelIndex + 1} of {pipelineLevels.length} · Mistakes: {mistakes}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <TimerIcon className="h-4 w-4 text-accent" />
              {timeLeft}s
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-black/[0.06]">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Your pipeline</p>
            <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-dashed border-black/10 bg-black/[0.02] p-3 min-h-[52px]">
              {placed.length === 0 && (
                <span className="text-xs text-muted">Click stages below to build the pipeline in order...</span>
              )}
              {placed.map((id, i) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {i + 1}. {stageLabel(id)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Available stages</p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pool.map((id) => (
                <button
                  key={id}
                  onClick={() => handlePick(id)}
                  className={`rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-accent/50 hover:shadow-md ${
                    shakeId === id ? "animate-shake border-red-300 bg-red-50 text-red-600" : ""
                  }`}
                >
                  {stageLabel(id)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {status === "level-complete" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Level {levelIndex + 1} shipped 🚀</h2>
          <p className="mt-2 text-sm text-muted">
            Score: <span className="font-bold text-foreground">{levelScores[levelScores.length - 1]}</span>
          </p>
          <button
            onClick={nextLevel}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-[#17b978] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35"
          >
            Next Level
            <Play className="h-4 w-4" />
          </button>
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
            {timeLeft <= 0 && placed.length < level.stages.length ? "Pipeline failed" : "All pipelines shipped!"}
          </h2>
          <p className="mt-2 text-sm text-muted">Total score</p>
          <p className="text-4xl font-extrabold text-gradient">{totalScore}</p>
          {bestScore !== null && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best: {bestScore}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-muted">
            {levelScores.map((s, i) => (
              <span key={i} className="rounded-full border border-black/10 px-3 py-1">
                Level {i + 1}: {s}
              </span>
            ))}
          </div>
          <button
            onClick={restart}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>
      )}

      {status === "playing" && mistakes > 0 && shakeId && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500">
          <XCircle className="h-3.5 w-3.5" /> Not quite — try the next stage in order
        </p>
      )}
    </div>
  );
}
