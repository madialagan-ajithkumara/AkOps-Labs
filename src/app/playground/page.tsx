import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { playgroundGames } from "@/lib/site-config";
import { Timer, Bug, HelpCircle, LayoutGrid, FileWarning, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Playground — DevOps Games",
  description:
    "Five small DevOps games from AkOps Labs: Pipeline Speed-Run, Bug Squash, DevOps Trivia Quiz, Icon Memory Match, and Config Debug Challenge.",
};

const icons = { Timer, Bug, HelpCircle, LayoutGrid, FileWarning };

export default function PlaygroundHub() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
          <div className="blob blob-sky" />
          <div className="blob blob-peach" />
        </div>
        <Container className="relative py-20 text-center">
          <Badge>AkOps Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Small games. Real DevOps skills.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Five quick games to test your speed, reflexes, and knowledge — pick
            one and see how you score.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {playgroundGames.map((g) => {
              const GameIcon = icons[g.icon as keyof typeof icons];
              return (
                <Link
                  key={g.slug}
                  href={`/playground/${g.slug}`}
                  className="card-surface group flex flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
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
                  <h3 className="mt-4 text-lg font-bold">{g.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Play now
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
