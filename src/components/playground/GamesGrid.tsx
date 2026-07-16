"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Cloud,
  CloudCog,
  GitBranch,
  FileWarning,
  ArrowRight,
  LayoutGrid,
  HelpCircle,
  Timer,
  Swords,
  Terminal,
  TerminalSquare,
  DoorOpen,
  Search,
  Siren,
  MessagesSquare,
  Sparkles,
} from "lucide-react";


const gameIcons = {
  Timer, HelpCircle, LayoutGrid, FileWarning, Swords, Terminal, TerminalSquare,
  DoorOpen, Search, GitBranch, Siren, Boxes, MessagesSquare,
};

const filterIcons = { Sparkles, Boxes, Cloud, CloudCog, GitBranch, FileWarning, LayoutGrid };

const filters: { slug: string; label: string; icon: keyof typeof filterIcons }[] = [
  { slug: "all", label: "All Games", icon: "Sparkles" },
  { slug: "kubernetes", label: "Kubernetes", icon: "Boxes" },
  { slug: "aws", label: "AWS", icon: "Cloud" },
  { slug: "azure", label: "Azure", icon: "CloudCog" },
  { slug: "cicd", label: "CI/CD", icon: "GitBranch" },
  { slug: "iac", label: "IaC", icon: "FileWarning" },
  { slug: "general", label: "General", icon: "LayoutGrid" },
];

type Game = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tag: string;
  color: string;
  category: string;
};

export default function GamesGrid({ games }: { games: Game[] }) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? games : games.filter((g) => g.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => {
          const FilterIcon = filterIcons[f.icon];
          const isActive = active === f.slug;
          return (
            <button
              key={f.slug}
              onClick={() => setActive(f.slug)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-hairline text-muted hover:border-accent/40 hover:text-accent"
              }`}
            >
              <FilterIcon className="h-3.5 w-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((g) => {
          const GameIcon = gameIcons[g.icon as keyof typeof gameIcons] ?? LayoutGrid;
          const comingSoon = g.tag === "Coming Soon";
          return (
            <Link
              key={g.slug}
              href={`/playground/${g.slug}`}
              className="card-surface group flex flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${g.color}1a`, color: g.color }}
                >
                  <GameIcon className="h-5 w-5" />
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                  style={{ background: `${g.color}1a`, color: g.color }}
                >
                  {g.tag}
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold">{g.name}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{g.description}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                {comingSoon ? "Learn more" : "Play now"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted">No games in this category yet — check back soon.</p>
      )}
    </div>
  );
}
