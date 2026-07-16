"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw, Trophy, Search, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import { billScenarios } from "@/lib/aws-bills";
import { addXp } from "@/lib/progress";

const ROUND_TIME = 25;
const BEST_KEY = "akops-costdetective-best-score";

type Status = "intro" | "playing" | "answered" | "finished";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function AwsCostDetective() {
  const [status, setStatus] = useState<Status>("intro");
  const [rounds, setRounds] = useState(billScenarios);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [selected, setSelected] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const current = rounds[index];

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0) {
      setSelected(-1);
      setStatus("answered");
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  function startGame() {
    setRounds(shuffle(billScenarios));
    setIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(ROUND_TIME);
    setSelected(null);
    setStatus("playing");
  }

  function handleClick(i: number) {
    if (status !== "playing") return;
    setSelected(i);
    if (i === current.wastefulIndex) {
      setScore((s) => s + 40 + timeLeft * 4);
      setCorrectCount((c) => c + 1);
    }
    setStatus("answered");
  }

  function nextRound() {
    if (index + 1 >= rounds.length) {
      setStatus("finished");
      addXp(Math.max(20, Math.round(score / 6)), "aws-cost-detective");
      if (bestScore === null || score > bestScore) {
        window.localStorage.setItem(BEST_KEY, String(score));
        setBestScore(score);
      }
      return;
    }
    setIndex((i) => i + 1);
    setTimeLeft(ROUND_TIME);
    setSelected(null);
    setStatus("playing");
  }

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Search className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">AWS Cost Detective</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Each round shows a mock AWS bill — find the wasteful or
            misconfigured line item before the clock runs out.
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={startGame}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35"
          >
            <Play className="h-4 w-4" />
            Start Investigating
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

          <div className="mt-5 divide-y divide-hairline rounded-xl border border-hairline">
            {current.items.map((item, i) => {
              const isFlagged = i === current.wastefulIndex;
              let rowClasses = "hover:bg-tint";
              if (status === "answered") {
                if (isFlagged) rowClasses = "bg-accent-soft";
                else if (i === selected) rowClasses = "bg-red-50";
              }
              return (
                <button
                  key={item.label}
                  disabled={status === "answered"}
                  onClick={() => handleClick(i)}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition-colors ${rowClasses}`}
                >
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <DollarSign className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
                    {item.label}
                    {status === "answered" && isFlagged && <CheckCircle2 className="h-4 w-4 text-accent" />}
                    {status === "answered" && i === selected && !isFlagged && <XCircle className="h-4 w-4 text-red-500" />}
                  </span>
                  <span className="font-mono text-sm font-bold">{item.cost}</span>
                </button>
              );
            })}
          </div>

          {status === "answered" && (
            <>
              <div className="mt-4 rounded-xl border border-hairline bg-tint p-4 text-sm text-muted">
                {current.explanation}
              </div>
              <button
                onClick={nextRound}
                className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
              >
                {index + 1 >= rounds.length ? "See results" : "Next bill"}
              </button>
            </>
          )}
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Case closed!</h2>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {rounds.length} correctly flagged
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
