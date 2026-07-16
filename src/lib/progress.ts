"use client";

import { useEffect, useState } from "react";

const XP_KEY = "akops-xp";
const SOURCES_KEY = "akops-xp-sources";
const EVENT_NAME = "akops-progress-updated";

export type Level = { level: number; title: string; xpRequired: number };

export const LEVELS: Level[] = [
  { level: 1, title: "Rookie Operator", xpRequired: 0 },
  { level: 2, title: "Junior Engineer", xpRequired: 150 },
  { level: 3, title: "DevOps Practitioner", xpRequired: 400 },
  { level: 4, title: "Cloud Specialist", xpRequired: 800 },
  { level: 5, title: "Platform Engineer", xpRequired: 1400 },
  { level: 6, title: "Site Reliability Engineer", xpRequired: 2200 },
  { level: 7, title: "Principal Engineer", xpRequired: 3200 },
  { level: 8, title: "DevOps Architect", xpRequired: 4500 },
  { level: 9, title: "Distinguished Engineer", xpRequired: 6200 },
  { level: 10, title: "AkOps Legend", xpRequired: 8500 },
];

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (stats: { xp: number; gamesPlayed: number; streak: number }) => boolean;
};

export const BADGES: Badge[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first game or task.",
    icon: "Footprints",
    check: (s) => s.gamesPlayed >= 1,
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Try 5 different games or tasks.",
    icon: "Compass",
    check: (s) => s.gamesPlayed >= 5,
  },
  {
    id: "all-rounder",
    name: "All-Rounder",
    description: "Try 10 different games or tasks.",
    icon: "Layers",
    check: (s) => s.gamesPlayed >= 10,
  },
  {
    id: "xp-500",
    name: "Rising Star",
    description: "Earn 500 total XP.",
    icon: "Star",
    check: (s) => s.xp >= 500,
  },
  {
    id: "xp-2000",
    name: "Power User",
    description: "Earn 2,000 total XP.",
    icon: "Zap",
    check: (s) => s.xp >= 2000,
  },
  {
    id: "xp-5000",
    name: "Elite Operator",
    description: "Earn 5,000 total XP.",
    icon: "Crown",
    check: (s) => s.xp >= 5000,
  },
  {
    id: "streak-3",
    name: "Warming Up",
    description: "Reach a 3-day task streak.",
    icon: "Flame",
    check: (s) => s.streak >= 3,
  },
  {
    id: "streak-7",
    name: "Consistent",
    description: "Reach a 7-day task streak.",
    icon: "Flame",
    check: (s) => s.streak >= 7,
  },
  {
    id: "streak-30",
    name: "Unstoppable",
    description: "Reach a 30-day task streak.",
    icon: "Flame",
    check: (s) => s.streak >= 30,
  },
];

export function getLevelInfo(xp: number) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
  }
  const nextIndex = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = LEVELS[nextIndex] ?? null;
  const xpIntoLevel = xp - current.xpRequired;
  const xpForNextLevel = next ? next.xpRequired - current.xpRequired : 0;
  const progressPct = next ? Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100)) : 100;
  return { level: current.level, title: current.title, next, xpIntoLevel, xpForNextLevel, progressPct };
}

export function addXp(amount: number, source: string) {
  if (typeof window === "undefined") return;
  const current = Number(window.localStorage.getItem(XP_KEY) || "0");
  const next = current + amount;
  window.localStorage.setItem(XP_KEY, String(next));

  const sources: string[] = JSON.parse(window.localStorage.getItem(SOURCES_KEY) || "[]");
  if (!sources.includes(source)) {
    sources.push(source);
    window.localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { amount, source } }));
  return next;
}

function readStreak(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem("akops-task-streak");
  if (!raw) return 0;
  try {
    return JSON.parse(raw).streak ?? 0;
  } catch {
    return 0;
  }
}

export function getProgress() {
  if (typeof window === "undefined") {
    return { xp: 0, sources: [] as string[], streak: 0, ...getLevelInfo(0), badges: [] as Badge[] };
  }
  const xp = Number(window.localStorage.getItem(XP_KEY) || "0");
  const sources: string[] = JSON.parse(window.localStorage.getItem(SOURCES_KEY) || "[]");
  const streak = readStreak();
  const levelInfo = getLevelInfo(xp);
  const badges = BADGES.filter((b) => b.check({ xp, gamesPlayed: sources.length, streak }));
  return { xp, sources, streak, ...levelInfo, badges };
}

export function useProgress() {
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
    const handler = () => setProgress(getProgress());
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return progress;
}
