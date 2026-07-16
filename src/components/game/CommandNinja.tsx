"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Trophy, Terminal, CheckCircle2, XCircle } from "lucide-react";
import { ninjaCommands } from "@/lib/ninja-commands";
import { addXp } from "@/lib/progress";

const ROUND_COUNT = 8;
const ROUND_TIME = 15;
const BEST_KEY = "akops-commandninja-best-score";

type Status = "intro" | "playing" | "answered" | "finished";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalize(s: string) {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export default function CommandNinja() {
  const [status, setStatus] = useState<Status>("intro");
  const [rounds, setRounds] = useState(ninjaCommands.slice(0, ROUND_COUNT));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = rounds[index];

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  useEffect(() => {
    if (status === "playing") inputRef.current?.focus();
  }, [status, index]);

  function startGame() {
    setRounds(shuffle(ninjaCommands).slice(0, ROUND_COUNT));
    setIndex(0);
    setInput("");
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(ROUND_TIME);
    setStatus("playing");
  }

  function submit() {
    if (status !== "playing") return;
    const correct = normalize(input) === normalize(current.command);
    setWasCorrect(correct);
    if (correct) {
      setScore((s) => s + 30 + timeLeft * 4);
      setCorrectCount((c) => c + 1);
    }
    setStatus("answered");
  }

  function nextRound() {
    if (index + 1 >= rounds.length) {
      setStatus("finished");
      addXp(Math.max(20, Math.round(score / 6)), "command-ninja");
      if (bestScore === null || score > bestScore) {
        window.localStorage.setItem(BEST_KEY, String(score));
        setBestScore(score);
      }
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setTimeLeft(ROUND_TIME);
    setStatus("playing");
  }

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <Terminal className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Command Ninja</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Type the exact Git, Docker, Kubernetes, Terraform, or Linux command
            for each prompt — {ROUND_TIME}s per round, {ROUND_COUNT} rounds.
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={startGame}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35"
          >
            <Play className="h-4 w-4" />
            Start Typing
          </button>
        </div>
      )}

      {(status === "playing" || status === "answered") && current && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Round {index + 1} of {rounds.length}</span>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">{current.category}</span>
            <span>{timeLeft}s</span>
          </div>

          <p className="mt-6 text-lg font-bold leading-snug">{current.prompt}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status === "answered"}
              placeholder="Type the command..."
              className="w-full rounded-xl border border-hairline bg-[#0f1712] px-4 py-3 font-mono text-sm text-emerald-300 placeholder:text-emerald-50/30 focus:border-accent focus:outline-none disabled:opacity-70"
            />
            {status === "playing" && (
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            )}
          </form>

          {status === "answered" && (
            <>
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-hairline bg-tint p-4 text-sm">
                {wasCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                )}
                <p className="text-muted">
                  {wasCorrect ? "Correct!" : "Not quite."} The command is{" "}
                  <code className="rounded bg-tint px-1.5 py-0.5 font-mono text-foreground">{current.command}</code>
                </p>
              </div>
              <button
                onClick={nextRound}
                className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
              >
                {index + 1 >= rounds.length ? "See results" : "Next round"}
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
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Nice typing!</h2>
          <p className="mt-2 text-sm text-muted">
            {correctCount} / {rounds.length} correct
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
