"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw, Trophy, FileWarning, CheckCircle2, XCircle } from "lucide-react";
import { debugSnippets, type Snippet } from "@/lib/debug-snippets";
import { addXp } from "@/lib/progress";

const ROUND_COUNT = 5;
const ROUND_TIME = 25;
const BEST_SCORE_KEY = "akops-configdebug-best-score";

type Status = "intro" | "playing" | "answered" | "finished";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ConfigDebug() {
  const [status, setStatus] = useState<Status>("intro");
  const [rounds, setRounds] = useState<Snippet[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const current = rounds[index];

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_SCORE_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0) {
      setSelectedLine(-1);
      setStatus("answered");
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  function startGame() {
    setRounds(shuffle(debugSnippets).slice(0, ROUND_COUNT));
    setIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(ROUND_TIME);
    setSelectedLine(null);
    setStatus("playing");
  }

  function handleLineClick(lineIdx: number) {
    if (status !== "playing") return;
    setSelectedLine(lineIdx);
    if (lineIdx === current.buggyLine) {
      setScore((s) => s + 40 + timeLeft * 4);
      setCorrectCount((c) => c + 1);
    }
    setStatus("answered");
  }

  function nextRound() {
    if (index + 1 >= rounds.length) {
      setStatus("finished");
      return;
    }
    setIndex((i) => i + 1);
    setTimeLeft(ROUND_TIME);
    setSelectedLine(null);
    setStatus("playing");
  }

  useEffect(() => {
    if (status === "finished") {
      if (bestScore === null || score > bestScore) {
        window.localStorage.setItem(BEST_SCORE_KEY, String(score));
        setBestScore(score);
      }
      addXp(Math.max(20, Math.round(score / 6)), "config-debug");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <FileWarning className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Config Debug Challenge</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Real YAML, Dockerfile, and Terraform snippets, each with one bug.
            Click the broken line before the {ROUND_TIME}s timer runs out — {ROUND_COUNT} rounds.
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={startGame}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35"
          >
            <Play className="h-4 w-4" />
            Start Debugging
          </button>
        </div>
      )}

      {(status === "playing" || status === "answered") && current && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Round {index + 1} of {rounds.length}</span>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">{current.title}</span>
            <span>{timeLeft}s</span>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline bg-[#0f1712] p-4 font-mono text-xs leading-relaxed">
            {current.lines.map((line, i) => {
              let rowClasses = "text-emerald-50/90 hover:bg-white/5";
              if (status === "answered") {
                if (i === current.buggyLine) rowClasses = "bg-emerald-500/15 text-emerald-300";
                else if (i === selectedLine) rowClasses = "bg-red-500/15 text-red-300";
              }
              return (
                <button
                  key={i}
                  disabled={status === "answered"}
                  onClick={() => handleLineClick(i)}
                  className={`flex w-full items-start gap-3 rounded px-2 py-1 text-left transition-colors ${rowClasses}`}
                >
                  <span className="w-5 flex-shrink-0 text-right text-emerald-50/30">{i + 1}</span>
                  <span className="whitespace-pre">{line || " "}</span>
                </button>
              );
            })}
          </div>

          {status === "answered" && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-hairline bg-tint p-4 text-sm">
              {selectedLine === current.buggyLine ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              )}
              <p className="text-muted">{current.explanation}</p>
            </div>
          )}

          {status === "answered" && (
            <button
              onClick={nextRound}
              className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
            >
              {index + 1 >= rounds.length ? "See results" : "Next round"}
            </button>
          )}
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Debug session complete!</h2>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {rounds.length} bugs found
          </p>
          <p className="text-4xl font-extrabold text-gradient">{score}</p>
          {bestScore !== null && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best: {bestScore}
            </p>
          )}
          <button
            onClick={startGame}
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
