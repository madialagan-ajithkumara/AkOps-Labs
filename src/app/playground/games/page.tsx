import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import GamesGrid from "@/components/playground/GamesGrid";
import { playgroundGames } from "@/lib/site-config";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "DevOps Games — AkOps Playground",
  description: "All AkOps Playground games in one place. Filter by Kubernetes, AWS, Azure, CI/CD, or IaC and start playing.",
};

export default function GamesHub() {
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
            All games, one page.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Filter by topic if you want, or just pick a card and start playing.
            No extra menus in the way.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <GamesGrid games={playgroundGames} />
        </Container>
      </section>
    </>
  );
}
