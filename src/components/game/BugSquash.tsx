"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Trophy, Bug as BugIcon, ShieldCheck, Heart } from "lucide-react";
import { antiPatternItems, type AntiPatternItem } from "@/lib/antipattern-items";
import { addXp } from "@/lib/progress";

const GRID_SIZE = 9; // 3 x 3
const GAME_DURATION = 45; // seconds
const START_LIVES = 5;
const BEST_SCORE_KEY = "akops-bugsquash-best-score";

type Status = "intro" | "playing" | "finished";
type SpawnedItem = { cell: number; item: AntiPatternItem; ttl: number };

function pickRandomItem(): AntiPatternItem {
  // ~70% bad practice (squash), ~30% good practice (avoid)
  const isBad = Math.random() < 0.7;
  const pool = antiPatternItems.filter((i) => i.isBad === isBad);
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function BugSquash() {
  const [status, setStatus] = useState<Status>("intro");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [spawned, setSpawned] = useState<SpawnedItem | null>(null);
  const [flashCell, setFlashCell] = useState<{ cell: number; good: boolean } | null>(null);
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

  function spawn() {
    const cell = Math.floor(Math.random() * GRID_SIZE);
    const item = pickRandomItem();
    const ttl = Math.max(1400, 2600 - score * 10);
    setSpawned({ cell, item, ttl });

    if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
    missTimeoutRef.current = setTimeout(() => {
      // A bad item that was ignored is a miss; a good item timing out is fine.
      setSpawned((current) => {
        if (current?.item.isBad) {
          setLives((l) => Math.max(0, l - 1));
        }
        return null;
      });
      scheduleNextSpawn();
    }, ttl);
  }

  function scheduleNextSpawn() {
    const delay = Math.max(350, 950 - score * 6);
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    spawnTimeoutRef.current = setTimeout(spawn, delay);
  }

  function handleCellClick(cell: number) {
    if (status !== "playing" || !spawned || spawned.cell !== cell) return;
    if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);

    if (spawned.item.isBad) {
      setScore((s) => s + 10);
      setFlashCell({ cell, good: true });
    } else {
      setLives((l) => Math.max(0, l - 1));
      setFlashCell({ cell, good: false });
    }
    setSpawned(null);
    setTimeout(() => setFlashCell(null), 300);
    scheduleNextSpawn();
  }

  function startGame() {
    setScore(0);
    setLives(START_LIVES);
    setTimeLeft(GAME_DURATION);
    setSpawned(null);
    setStatus("playing");
    scheduleNextSpawn();
  }

  function endGame() {
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
    setSpawned(null);
    setStatus("finished");
  }

  useEffect(() => {
    if (status === "finished") {
      if (bestScore === null || score > bestScore) {
        window.localStorage.setItem(BEST_SCORE_KEY, String(score));
        setBestScore(score);
      }
      addXp(Math.max(15, Math.round(score / 3)), "bug-squash");
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
            Real DevOps practices flash across the grid. Squash the{" "}
            <span className="font-semibold text-red-600">bad practices</span>{" "}
            before they escape — but leave the{" "}
            <span className="font-semibold text-accent">good practices</span> alone.
            Miss a bug or squash a good practice by mistake and you lose a life.
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
                  className={`h-4 w-4 ${i < lives ? "fill-red-500 text-red-500" : "text-hairline"}`}
                />
              ))}
            </span>
            <span>{timeLeft}s</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {Array.from({ length: GRID_SIZE }).map((_, i) => {
              const isSpawned = spawned?.cell === i;
              const isFlash = flashCell?.cell === i;
              let classes = "border-hairline bg-tint";
              if (isSpawned) {
                classes = spawned.item.isBad
                  ? "border-red-300 bg-red-50"
                  : "border-accent/40 bg-accent-soft";
              }
              if (isFlash) {
                classes = flashCell.good ? "border-accent bg-accent-soft" : "border-red-400 bg-red-100";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  className={`flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border p-2 text-center transition-all duration-150 ${classes}`}
                >
                  {isSpawned && (
                    <>
                      {spawned.item.isBad ? (
                        <BugIcon className="h-5 w-5 flex-shrink-0 text-red-600" />
                      ) : (
                        <ShieldCheck className="h-5 w-5 flex-shrink-0 text-accent" />
                      )}
                      <span className="text-[11px] font-semibold leading-tight text-foreground">
                        {spawned.item.label}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
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
