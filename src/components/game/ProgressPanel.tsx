"use client";

import {
  Trophy,
  Flame,
  Zap,
  Footprints,
  Compass,
  Layers,
  Star,
  Crown,
  Lock,
} from "lucide-react";
import { useProgress, BADGES } from "@/lib/progress";

const badgeIcons = { Footprints, Compass, Layers, Star, Zap, Crown, Flame };

export default function ProgressPanel() {
  const progress = useProgress();
  const earnedIds = new Set(progress.badges.map((b) => b.id));

  return (
    <div>
      <div className="card-surface mx-auto max-w-2xl rounded-3xl p-8 sm:p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Level {progress.level}</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{progress.title}</h2>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Trophy className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs font-semibold text-muted">
            <span>{progress.xp} XP</span>
            <span>{progress.next ? `${progress.next.xpRequired} XP for Level ${progress.next.level}` : "Max level"}</span>
          </div>
          <div className="mt-1.5 h-2 w-full rounded-full bg-tint">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-accent to-[#17b978] transition-all duration-500"
              style={{ width: `${progress.progressPct}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm font-bold text-orange-500">
          <Flame className={`h-4 w-4 ${progress.streak > 0 ? "fill-orange-500" : ""}`} />
          {progress.streak} day{progress.streak === 1 ? "" : "s"} task streak
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <h3 className="text-center text-lg font-extrabold tracking-tight">Achievements</h3>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted">
          Earned locally in this browser — {progress.badges.length} of {BADGES.length} unlocked.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {BADGES.map((badge) => {
            const earned = earnedIds.has(badge.id);
            const Icon = badgeIcons[badge.icon as keyof typeof badgeIcons] ?? Star;
            return (
              <div
                key={badge.id}
                className={`card-surface flex flex-col items-center rounded-2xl p-5 text-center ${earned ? "" : "opacity-50"}`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    earned ? "bg-accent-soft text-accent" : "bg-tint text-muted"
                  }`}
                >
                  {earned ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <p className="mt-3 text-sm font-bold">{badge.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-xl rounded-2xl border border-dashed border-hairline p-6 text-center">
        <p className="text-sm font-semibold text-foreground">Global leaderboards are coming soon</p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Right now your XP, level, and badges are tracked locally in this
          browser. Once accounts ship, this progress will be ready to sync and
          compete on a global leaderboard.
        </p>
      </div>
    </div>
  );
}
