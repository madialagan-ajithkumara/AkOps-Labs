"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Trophy, Bug as BugIcon, Heart } from "lucide-react";

const GRID_SIZE = 20; // 5 x 4
const GAME_DURATION = 45; // seconds
const START_LIVES = 5;
const BEST_SCORE_KEY = "akops-bugsquash-best-score";

type Status = "intro" | "playing" | "finished";
type BugState = { cell: number; bornAt: number; ttl: number };

export default function BugSquash() {
  const [status, setStatus] = useState<Status>("intro");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [bug, setBug] = useState<BugState | null>(null);
  const [squashedCell, setSquashedCell] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const spawnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const missTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_SCORE_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0 || lives <= 0) {
      endGame();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft, lives]);

  function spawnBug() {
    const cell = Math.floor(Math.random() * GRID_SIZE);
    // ttl shrinks as score grows, min 550ms
    const ttl = Math.max(550, 1400 - score * 12);
    const bornAt = Date.now();
    setBug({ cell, bornAt, ttl });

    if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
    missTimeoutRef.current = setTimeout(() => {
      setLives((l) => Math.max(0, l - 1));
      setBug(null);
      scheduleNextSpawn();
    }, ttl);
  }

  function scheduleNextSpawn() {
    const delay = Math.max(300, 900 - score * 6);
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    spawnTimeoutRef.current = setTimeout(spawnBug, delay);
  }

  function handleCellClick(cell: number) {
    if (status !== "playing" || !bug || bug.cell !== cell) return;
    if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
    setScore((s) => s + 10);
    setSquashedCell(cell);
    setBug(null);
    setTimeout(() => setSquashedCell(null), 250);
    scheduleNextSpawn();
  }

  function startGame() {
    setScore(0);
    setLives(START_LIVES);
    setTimeLeft(GAME_DURATION);
    setBug(null);
    setStatus("playing");
    scheduleNextSpawn();
  }

  function endGame() {
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
    setBug(null);
    setStatus("finished");
  }

  useEffect(() => {
    if (status === "finished") {
      if (bestScore === null || score > bestScore) {
        window.localStorage.setItem(BEST_SCORE_KEY, String(score));
        setBestScore(score);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    return () => {
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
    };
  }, []);

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <BugIcon className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Bug Squash</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Bugs pop up across the grid — click them before they escape. Miss
            {" "}{START_LIVES} and it&apos;s game over. Speed increases the longer you survive.
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={startGame}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35"
          >
            <Play className="h-4 w-4" />
            Start Squashing
          </button>
        </div>
      )}

      {status === "playing" && (
        <div>
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Score: <span className="text-accent">{score}</span></span>
            <span className="flex items-center gap-1">
              {Array.from({ length: START_LIVES }).map((_, i) => (
                <Heart
                  key={i}
                  className={`h-4 w-4 ${i < lives ? "fill-red-500 text-red-500" : "text-black/10"}`}
                />
              ))}
            </span>
            <span>{timeLeft}s</span>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2.5">
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleCellClick(i)}
                className={`flex aspect-square items-center justify-center rounded-xl border transition-all duration-150 ${
                  bug?.cell === i
                    ? "border-red-300 bg-red-50"
                    : squashedCell === i
                      ? "border-accent/40 bg-accent-soft"
                      : "border-black/5 bg-black/[0.02]"
                }`}
              >
                {bug?.cell === i && <BugIcon className="h-6 w-6 animate-shake text-red-600" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "finished" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
            {lives <= 0 ? "Outage! Production is down." : "Time's up!"}
          </h2>
          <p className="mt-2 text-sm text-muted">Final score</p>
          <p className="text-4xl font-extrabold text-gradient">{score}</p>
          {bestScore !== null && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best: {bestScore}
            </p>
          )}
          <button
            onClick={startGame}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
