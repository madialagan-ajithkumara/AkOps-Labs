import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { playgroundGames } from "@/lib/site-config";
import {
  ArrowRight, DoorOpen, FileWarning, GitBranch, ListChecks, Siren, Terminal, TerminalSquare, Trophy,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Playground — Practice DevOps Hands-On",
  description: "Six hands-on DevOps challenges plus a daily task. Practice real commands, configs and incidents.",
};

const icons = { TerminalSquare, Terminal, FileWarning, DoorOpen, Siren, GitBranch };

export default function PlaygroundPage() {
  return (
    <>
      <section className="border-b border-hairline py-20 text-center">
        <Container>
          <Badge>Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Practice DevOps the way you&apos;ll use it.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Real commands, real configs, real incidents. Earn XP as you go.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/playground/tasks" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white">
              <ListChecks className="h-4 w-4" /> Today&apos;s task
            </Link>
            <Link href="/playground/progress" className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold hover:border-accent/50 hover:text-accent">
              <Trophy className="h-4 w-4" /> My progress
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {playgroundGames.map((g) => {
              const Icon = icons[g.icon as keyof typeof icons] ?? Terminal;
              return (
                <Link
                  key={g.slug}
                  href={`/playground/${g.slug}`}
                  className="card-surface group flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${g.color}1a`, color: g.color }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide" style={{ background: `${g.color}1a`, color: g.color }}>
                      {g.tag}
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-bold">{g.name}</h2>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{g.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Play now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
