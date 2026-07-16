import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { gameCategories } from "@/lib/game-categories";
import { playgroundGames } from "@/lib/site-config";
import {
  Boxes,
  Cloud,
  CloudCog,
  GitBranch,
  FileWarning,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  HelpCircle,
  Timer,
  Bug,
  Swords,
  Terminal,
  TerminalSquare,
  DoorOpen,
  Search,
  Siren,
  MessagesSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "DevOps Games — AkOps Playground",
  description: "Ten DevOps games across Kubernetes, AWS, Azure, CI/CD, and IaC. More coming soon.",
};

const catIcons = { Boxes, Cloud, CloudCog, GitBranch, FileWarning };
const gameIcons = {
  Timer, Bug, HelpCircle, LayoutGrid, FileWarning, Swords, Terminal, TerminalSquare,
  DoorOpen, Search, GitBranch, Siren, Boxes, MessagesSquare,
};

const featuredInCategory = new Set(["pipeline-speed-run", "terminal-challenge", "config-debug"]);

export default function GamesHub() {
  const otherGames = playgroundGames.filter((g) => !featuredInCategory.has(g.slug));

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
          <div className="blob blob-sky" />
        </div>
        <Container className="relative py-20 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            Playground
          </Link>
          <Badge>DevOps Games</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Pick a category. Start playing.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Five topics to start — each with a featured game plus a quick trivia
            sprint. Ten games total, more on the way.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-muted">Categories</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gameCategories.map((cat) => {
              const CatIcon = catIcons[cat.icon as keyof typeof catIcons];
              return (
                <Link
                  key={cat.slug}
                  href={`/playground/games/${cat.slug}`}
                  className="card-surface group flex flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${cat.color}1a`, color: cat.color }}
                  >
                    <CatIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{cat.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cat.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: cat.color }}>
                    Play now
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-16">
            <h2 className="text-center text-sm font-bold uppercase tracking-widest text-muted">All Games</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {otherGames.map((g) => {
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
          </div>
        </Container>
      </section>
    </>
  );
}
