import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import MemoryMatch from "@/components/game/MemoryMatch";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Icon Memory Match — AkOps Playground",
  description: "Flip and match pairs of DevOps tool icons in as few moves as possible.",
};

export default function MemoryMatchPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
        </div>
        <Container className="relative py-20 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All games
          </Link>
          <Badge>AkOps Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Icon Memory Match
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            A casual break from the reflex and speed games — flip cards, find
            pairs, and try to beat your move count.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <MemoryMatch />
        </Container>
      </section>
    </>
  );
}
