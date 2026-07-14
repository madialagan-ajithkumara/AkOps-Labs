import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { gameCategories } from "@/lib/game-categories";
import { Boxes, Cloud, CloudCog, GitBranch, FileWarning, ArrowLeft, ArrowRight, LayoutGrid, HelpCircle, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "DevOps Games — AkOps Playground",
  description: "Five DevOps game categories: Kubernetes, AWS, Azure, CI/CD, and IaC. More coming soon.",
};

const icons = { Boxes, Cloud, CloudCog, GitBranch, FileWarning };

export default function GamesHub() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
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
            sprint. New categories and games added over time.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gameCategories.map((cat) => {
              const CatIcon = icons[cat.icon as keyof typeof icons];
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

            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 p-6 text-center">
              <Sparkles className="h-5 w-5 text-muted" />
              <p className="mt-3 text-sm font-semibold text-muted">More categories coming soon</p>
              <p className="mt-1 text-xs text-muted">Docker, Linux, Security, and more are on the roadmap.</p>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="text-center text-lg font-extrabold tracking-tight">Bonus Games</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Link
                href="/playground/memory-match"
                className="card-surface group flex flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">Icon Memory Match</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  A casual warm-up — flip and match DevOps tool icons.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Play now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/playground/trivia-quiz"
                className="card-surface group flex flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">All-Topics Trivia</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  The full mixed question bank — every category in one quiz.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Play now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
