"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw, Trophy, Swords, Heart, Bug } from "lucide-react";
import { debugSnippets, type Snippet } from "@/lib/debug-snippets";
import { addXp } from "@/lib/progress";

const ROUND_TIME = 20;
const PLAYER_HP = 5;
const BUG_HP = 6;
const BEST_KEY = "akops-yamlbattle-best-score";

type Status = "intro" | "playing" | "answered" | "finished";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function YamlBattle() {
  const [status, setStatus] = useState<Status>("intro");
  const [rounds, setRounds] = useState<Snippet[]>([]);
  const [index, setIndex] = useState(0);
  const [playerHp, setPlayerHp] = useState(PLAYER_HP);
  const [bugHp, setBugHp] = useState(BUG_HP);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const current = rounds[index];

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_KEY);
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    if (timeLeft <= 0) {
      resolveRound(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, timeLeft]);

  function startBattle() {
    setRounds(shuffle(debugSnippets));
    setIndex(0);
    setPlayerHp(PLAYER_HP);
    setBugHp(BUG_HP);
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setSelectedLine(null);
    setStatus("playing");
  }

  function resolveRound(hit: boolean) {
    if (hit) {
      setBugHp((h) => Math.max(0, h - 1));
      setScore((s) => s + 30 + timeLeft * 3);
    } else {
      setPlayerHp((h) => Math.max(0, h - 1));
    }
    setStatus("answered");
  }

  function handleLineClick(lineIdx: number) {
    if (status !== "playing") return;
    setSelectedLine(lineIdx);
    resolveRound(lineIdx === current.buggyLine);
  }

  function nextRound() {
    const nextBugHp = bugHp;
    const nextPlayerHp = playerHp;
    if (nextBugHp <= 0 || nextPlayerHp <= 0 || index + 1 >= rounds.length) {
      setStatus("finished");
      addXp(Math.max(20, Math.round(score / 5)), "yaml-battle");
      if (bestScore === null || score > bestScore) {
        window.localStorage.setItem(BEST_KEY, String(score));
        setBestScore(score);
      }
      return;
    }
    setIndex((i) => i + 1);
    setTimeLeft(ROUND_TIME);
    setSelectedLine(null);
    setStatus("playing");
  }

  return (
    <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
      {status === "intro" && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Swords className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">YAML Battle</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Face off against the Bug — find the broken line before time runs
            out to land a hit. Miss and the Bug hits you back. {PLAYER_HP} HP each.
          </p>
          {bestScore !== null && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best score: {bestScore}
            </p>
          )}
          <button
            onClick={startBattle}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35"
          >
            <Play className="h-4 w-4" />
            Start Battle
          </button>
        </div>
      )}

      {(status === "playing" || status === "answered") && current && (
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-bold text-muted">You</p>
              <div className="mt-1 flex gap-1">
                {Array.from({ length: PLAYER_HP }).map((_, i) => (
                  <Heart key={i} className={`h-4 w-4 ${i < playerHp ? "fill-accent text-accent" : "text-hairline"}`} />
                ))}
              </div>
            </div>
            <span className="text-sm font-bold text-muted">{timeLeft}s</span>
            <div className="flex-1 text-right">
              <p className="text-xs font-bold text-muted">Bug</p>
              <div className="mt-1 flex justify-end gap-1">
                {Array.from({ length: BUG_HP }).map((_, i) => (
                  <Bug key={i} className={`h-4 w-4 ${i < bugHp ? "fill-red-500 text-red-500" : "text-hairline"}`} />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs font-semibold uppercase tracking-widest text-accent">{current.title}</p>

          <div className="mt-3 overflow-x-auto rounded-xl border border-hairline bg-[#0f1712] p-4 font-mono text-xs leading-relaxed">
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
            <>
              <div className="mt-4 rounded-xl border border-hairline bg-tint p-4 text-sm text-muted">
                {selectedLine === current.buggyLine ? "Direct hit! " : "Missed — "}
                {current.explanation}
              </div>
              <button
                onClick={nextRound}
                className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
              >
                {bugHp <= 0 || playerHp <= 0 || index + 1 >= rounds.length ? "See results" : "Next round"}
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
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
            {bugHp <= 0 ? "Bug defeated!" : playerHp <= 0 ? "You went down..." : "Battle complete!"}
          </h2>
          <p className="mt-2 text-sm text-muted">Final score</p>
          <p className="text-4xl font-extrabold text-gradient">{score}</p>
          {bestScore !== null && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Trophy className="h-4 w-4" /> Best: {bestScore}
            </p>
          )}
          <button
            onClick={startBattle}
            className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-6 py-3 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent"
          >
            <RotateCcw className="h-4 w-4" />
            Battle Again
          </button>
        </div>
      )}
    </div>
  );
}
