"use client";

import { useEffect, useState } from "react";
import {
  Play,
  RotateCcw,
  Trophy,
  Container as ContainerIcon,
  Boxes,
  GitBranch,
  Cloud,
  Terminal,
  Rocket,
} from "lucide-react";

const ICONS = [
  { id: "docker", Icon: ContainerIcon, color: "#2563eb" },
  { id: "k8s", Icon: Boxes, color: "#0ea5e9" },
  { id: "git", Icon: GitBranch, color: "#ea580c" },
  { id: "cloud", Icon: Cloud, color: "#0f9d58" },
  { id: "terminal", Icon: Terminal, color: "#7c3aed" },
  { id: "rocket", Icon: Rocket, color: "#db2777" },
];

const BEST_MOVES_KEY = "akops-memorymatch-best-moves";

type Status = "intro" | "playing" | "finished";
type CardT = { key: string; iconId: string };

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(): CardT[] {
  const pairs = ICONS.flatMap((icon) => [
    { key: `${icon.id}-a`, iconId: icon.id },
    { key: `${icon.id}-b`, iconId: icon.id },
  ]);
  return shuffle(pairs);
}

export default function MemoryMatch() {
  const [status, setStatus] = useState<Status>("intro");
  const [deck, setDeck] = useState<CardT[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [bestMoves, setBestMoves] = useState<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_MOVES_KEY);
    if (stored) setBestMoves(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    const cardA = deck.find((c) => c.key === a);
    const cardB = deck.find((c) => c.key === b);
    setMoves((m) => m + 1);

    if (cardA && cardB && cardA.iconId === cardB.iconId) {
      setMatched((m) => [...m, cardA.iconId]);
      setFlipped([]);
    } else {
      const t = setTimeout(() => setFlipped([]), 700);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  useEffect(() => {
    if (status === "playing" && matched.length === ICONS.length) {
      setStatus("finished");
      if (bestMoves === null || moves < bestMoves) {
        window.localStorage.setItem(BEST_MOVES_KEY, String(moves));
        setBestMoves(moves);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  function startGame() {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStatus("playing");
  }

  function handleFlip(key: string) {
    if (status !== "playing" || flipped.length === 2) return;
    const card = deck.find((c) => c.key === key);
    if (!card || flipped.includes(key) || matched.includes(card.iconId)) return;
    setFlipped((f) => [...f, key]);
  }

  return (
    <div className="card-surface mx-auto max-w-xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
            <Boxes className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Icon Memory Match</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Flip two cards at a time to find matching DevOps tool icons. Match
            all 6 pairs in as few moves as possible.
          </p>
          {bestMoves !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best: {bestMoves} moves
            </p>
          )}
          <button
            onClick={startGame}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/35"
          >
            <Play className="h-4 w-4" />
            Start Game
          </button>
        </div>
      )}

      {status === "playing" && (
        <div>
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Moves: <span className="text-accent">{moves}</span></span>
            <span>{seconds}s</span>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3">
            {deck.map((card) => {
              const icon = ICONS.find((i) => i.id === card.iconId)!;
              const isFlipped = flipped.includes(card.key) || matched.includes(card.iconId);
              return (
                <button
                  key={card.key}
                  onClick={() => handleFlip(card.key)}
                  className={`flex aspect-square items-center justify-center rounded-xl border transition-all duration-200 ${
                    isFlipped ? "border-black/10 bg-white" : "border-black/5 bg-black/[0.04] hover:bg-black/[0.06]"
                  }`}
                >
                  {isFlipped && <icon.Icon style={{ color: icon.color }} className="h-6 w-6" />}
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
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">All matched!</h2>
          <p className="mt-2 text-sm text-muted">Completed in</p>
          <p className="text-4xl font-extrabold text-gradient">{moves} moves</p>
          <p className="mt-1 text-sm text-muted">{seconds}s elapsed</p>
          {bestMoves !== null && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best: {bestMoves} moves
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
