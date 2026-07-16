import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import ProgressPanel from "@/components/game/ProgressPanel";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Progress — AkOps Playground",
  description: "Track your level, XP, streak, and achievements earned across AkOps Labs games and daily tasks.",
};

export default function ProgressPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
        </div>
        <Container className="relative py-16 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            Playground
          </Link>
          <Badge>Your Progress</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Level, XP, and achievements
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Every game and task you complete earns XP. Level up, build a streak,
            and unlock achievements as you go.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <ProgressPanel />
        </Container>
      </section>
    </>
  );
}
