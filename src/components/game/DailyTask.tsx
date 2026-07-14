"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";
import { dailyTasks } from "@/lib/daily-tasks";

const STREAK_KEY = "akops-task-streak";
const COMPLETED_KEY = "akops-task-completed-ids";
const EPOCH = new Date("2026-01-01T00:00:00Z").getTime();

type StreakData = { lastCompletedDate: string; streak: number };

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayNumber(): number {
  const diff = Date.now() - EPOCH;
  return Math.max(1, Math.floor(diff / 86400000) + 1);
}

const difficultyColor: Record<string, string> = {
  Beginner: "#0f9d58",
  Intermediate: "#f5a524",
  Advanced: "#dc2626",
};

export default function DailyTask() {
  const [streak, setStreak] = useState<StreakData>({ lastCompletedDate: "", streak: 0 });
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const day = dayNumber();
  const todayTask = useMemo(() => dailyTasks[day % dailyTasks.length], [day]);
  const today = todayKey();
  const isTodayDone = streak.lastCompletedDate === today;

  useEffect(() => {
    setMounted(true);
    const storedStreak = window.localStorage.getItem(STREAK_KEY);
    if (storedStreak) setStreak(JSON.parse(storedStreak));
    const storedCompleted = window.localStorage.getItem(COMPLETED_KEY);
    if (storedCompleted) setCompletedIds(JSON.parse(storedCompleted));
  }, []);

  function completeToday() {
    if (isTodayDone) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const nextStreak = streak.lastCompletedDate === yesterday ? streak.streak + 1 : 1;
    const next: StreakData = { lastCompletedDate: today, streak: nextStreak };
    setStreak(next);
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(next));
    toggleCompleted(todayTask.id, true);
  }

  function toggleCompleted(id: string, forceOn?: boolean) {
    setCompletedIds((prev) => {
      const has = prev.includes(id);
      const next = forceOn ? (has ? prev : [...prev, id]) : has ? prev.filter((x) => x !== id) : [...prev, id];
      window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
      return next;
    });
  }

  if (!mounted) return null;

  return (
    <div>
      {/* Today's task */}
      <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
            Day {day}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500">
            <Flame className={`h-4 w-4 ${streak.streak > 0 ? "fill-orange-500" : ""}`} />
            {streak.streak} day{streak.streak === 1 ? "" : "s"} streak
          </span>
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight">{todayTask.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{todayTask.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span
            className="rounded-full px-2.5 py-1"
            style={{ background: `${difficultyColor[todayTask.difficulty]}1a`, color: difficultyColor[todayTask.difficulty] }}
          >
            {todayTask.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.04] px-2.5 py-1 text-muted">
            <Clock className="h-3.5 w-3.5" />
            ~{todayTask.estMinutes} min
          </span>
          <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-muted">{todayTask.category}</span>
        </div>

        <button
          onClick={completeToday}
          disabled={isTodayDone}
          className={`mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
            isTodayDone
              ? "bg-accent-soft text-accent"
              : "bg-gradient-to-r from-accent to-[#17b978] text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35"
          }`}
        >
          {isTodayDone ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {isTodayDone ? "Completed today" : "Mark today's task complete"}
        </button>
      </div>

      {/* Task library */}
      <div className="mx-auto mt-16 max-w-4xl">
        <h3 className="text-center text-lg font-extrabold tracking-tight">Task Library</h3>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted">
          Browse every task — practice ahead, or catch up on ones you missed.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {dailyTasks.map((task) => {
            const done = completedIds.includes(task.id);
            return (
              <button
                key={task.id}
                onClick={() => toggleCompleted(task.id)}
                className={`card-surface flex items-start gap-3 rounded-xl p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  done ? "border-accent/30" : ""
                }`}
              >
                {done ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-black/15" />
                )}
                <div>
                  <p className={`text-sm font-bold ${done ? "text-accent" : "text-foreground"}`}>{task.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{task.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                    <span
                      className="rounded-full px-2 py-0.5"
                      style={{ background: `${difficultyColor[task.difficulty]}1a`, color: difficultyColor[task.difficulty] }}
                    >
                      {task.difficulty}
                    </span>
                    <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-muted">{task.category}</span>
                    <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-muted">~{task.estMinutes}m</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
