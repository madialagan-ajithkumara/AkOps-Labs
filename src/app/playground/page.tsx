import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { Gamepad2, ListChecks, ArrowRight, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Playground — DevOps Games & Daily Tasks",
  description:
    "AkOps Labs Playground: five DevOps game categories (Kubernetes, AWS, Azure, CI/CD, IaC) and a daily task to build hands-on skills.",
};

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
            Play a little. Practice daily.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Test your skills with quick DevOps games, or build a real habit with
            one hands-on task a day.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <Link
              href="/playground/games"
              className="card-surface group flex flex-col rounded-3xl p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold tracking-tight">DevOps Games</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                Five categories — Kubernetes, AWS, Azure, CI/CD, and IaC — each
                with quick games to test your speed, reflexes, and knowledge.
                More categories coming soon.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Browse categories
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/playground/tasks"
              className="card-surface group flex flex-col rounded-3xl p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <ListChecks className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold tracking-tight">DevOps Tasks</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                One hands-on task a day — Docker, Kubernetes, CI/CD, IaC, and
                more. Build a streak, build real skills.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500">
                <Flame className="h-3.5 w-3.5" />
                Start today's task
              </span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
