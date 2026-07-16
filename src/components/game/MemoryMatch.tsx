"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw, Trophy, BookOpen } from "lucide-react";
import { conceptPairs } from "@/lib/concept-pairs";
import { addXp } from "@/lib/progress";

const BEST_MOVES_KEY = "akops-conceptmatch-best-moves";
const PAIR_COUNT = 6;

type Status = "intro" | "playing" | "finished";
type CardT = { key: string; pairId: string; kind: "term" | "definition"; text: string };

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(): CardT[] {
  const chosen = shuffle(conceptPairs).slice(0, PAIR_COUNT);
  const cards = chosen.flatMap((p) => [
    { key: `${p.id}-term`, pairId: p.id, kind: "term" as const, text: p.term },
    { key: `${p.id}-def`, pairId: p.id, kind: "definition" as const, text: p.definition },
  ]);
  return shuffle(cards);
}

export default function MemoryMatch() {
  const [status, setStatus] = useState<Status>("intro");
  const [deck, setDeck] = useState<CardT[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<string[]>([]);
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

    if (cardA && cardB && cardA.pairId === cardB.pairId && cardA.kind !== cardB.kind) {
      setMatched((m) => [...m, cardA.pairId]);
      setFlipped([]);
    } else {
      setWrongPair([a, b]);
      const t = setTimeout(() => {
        setFlipped([]);
        setWrongPair([]);
      }, 900);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  useEffect(() => {
    if (status === "playing" && deck.length > 0 && matched.length === PAIR_COUNT) {
      setStatus("finished");
      if (bestMoves === null || moves < bestMoves) {
        window.localStorage.setItem(BEST_MOVES_KEY, String(moves));
        setBestMoves(moves);
      }
      addXp(Math.max(20, 100 - moves * 3), "concept-match");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  function startGame() {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setWrongPair([]);
    setMoves(0);
    setSeconds(0);
    setStatus("playing");
  }

  function handleFlip(key: string) {
    if (status !== "playing" || flipped.length === 2) return;
    const card = deck.find((c) => c.key === key);
    if (!card || flipped.includes(key) || matched.includes(card.pairId)) return;
    setFlipped((f) => [...f, key]);
  }

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">Concept Match</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Flip two cards at a time to pair each DevOps term with its correct
            definition. Match all {PAIR_COUNT} pairs in as few moves as possible —
            no guessing by shape, you actually have to know what each term means.
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

          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {deck.map((card) => {
              const isFlipped = flipped.includes(card.key) || matched.includes(card.pairId);
              const isWrong = wrongPair.includes(card.key);
              return (
                <button
                  key={card.key}
                  onClick={() => handleFlip(card.key)}
                  className={`flex min-h-[92px] items-center justify-center rounded-xl border p-2 text-center text-[11px] font-semibold leading-tight transition-all duration-200 ${
                    isWrong
                      ? "border-red-400 bg-red-50 text-red-700"
                      : isFlipped
                      ? card.kind === "term"
                        ? "border-accent/40 bg-accent-soft text-foreground"
                        : "border-hairline bg-surface text-foreground"
                      : "border-hairline bg-tint text-transparent hover:bg-tint"
                  }`}
                >
                  {isFlipped || isWrong ? card.text : "?"}
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
