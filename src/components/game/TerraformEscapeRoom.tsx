"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw, Trophy, DoorOpen, Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { escapeDoors } from "@/lib/escape-rooms";
import { addXp } from "@/lib/progress";

const BEST_KEY = "akops-escaperoom-best-score";

type Status = "intro" | "playing" | "answered" | "finished";

export default function TerraformEscapeRoom() {
  const [status, setStatus] = useState<Status>("intro");
  const [doorIndex, setDoorIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const door = escapeDoors[doorIndex];

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing" && status !== "answered") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  function startGame() {
    setDoorIndex(0);
    setAttempts(0);
    setShowHint(false);
    setSelected(null);
    setSeconds(0);
    setStatus("playing");
  }

  function handleAnswer(i: number) {
    if (status !== "playing") return;
    setSelected(i);
    if (i !== door.correctIndex) {
      setAttempts((a) => a + 1);
    }
    setStatus("answered");
  }

  function proceed() {
    if (selected !== door.correctIndex) {
      setSelected(null);
      setShowHint(true);
      setStatus("playing");
      return;
    }
    setShowHint(false);
    setSelected(null);
    if (doorIndex + 1 >= escapeDoors.length) {
      const score = Math.max(50, 1000 - attempts * 40 - seconds * 3);
      setStatus("finished");
      addXp(Math.max(20, Math.round(score / 8)), "terraform-escape-room");
      window.localStorage.setItem(BEST_KEY, String(Math.max(score, Number(window.localStorage.getItem(BEST_KEY) || 0))));
      setBestScore((prev) => (prev === null ? score : Math.max(prev, score)));
      return;
    }
    setDoorIndex((d) => d + 1);
    setStatus("playing");
  }

  const finalScore = Math.max(50, 1000 - attempts * 40 - seconds * 3);

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <DoorOpen className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Terraform Escape Room</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            {escapeDoors.length} locked doors, {escapeDoors.length} Terraform
            puzzles. Answer correctly to open each door — wrong answers cost
            points, but you can always try again.
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={startGame}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35"
          >
            <Play className="h-4 w-4" />
            Enter the Room
          </button>
        </div>
      )}

      {(status === "playing" || status === "answered") && door && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Door {doorIndex + 1} of {escapeDoors.length}</span>
            <span>{seconds}s elapsed</span>
          </div>

          <h3 className="mt-5 text-lg font-bold leading-snug">{door.clue}</h3>

          {showHint && status === "playing" && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {door.hint}
            </div>
          )}

          <div className="mt-5 grid gap-3">
            {door.options.map((opt, i) => {
              const isCorrect = i === door.correctIndex;
              const isSelected = i === selected;
              let stateClasses = "border-hairline bg-surface hover:border-accent/40";
              if (status === "answered") {
                if (isSelected && isCorrect) stateClasses = "border-accent bg-accent-soft text-accent";
                else if (isSelected) stateClasses = "border-red-300 bg-red-50 text-red-600";
                else stateClasses = "border-hairline bg-surface opacity-60";
              }
              return (
                <button
                  key={i}
                  disabled={status === "answered"}
                  onClick={() => handleAnswer(i)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${stateClasses}`}
                >
                  {opt}
                  {status === "answered" && isSelected && isCorrect && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
                  {status === "answered" && isSelected && !isCorrect && <XCircle className="h-4 w-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {status === "answered" && (
            <button
              onClick={proceed}
              className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
            >
              {selected === door.correctIndex
                ? doorIndex + 1 >= escapeDoors.length
                  ? "Escape!"
                  : "Open next door"
                : "Try again"}
            </button>
          )}
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">You escaped!</h2>
          <p className="mt-2 text-sm text-muted">{seconds}s · {attempts} wrong attempts</p>
          <p className="text-4xl font-extrabold text-gradient">{finalScore}</p>
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
