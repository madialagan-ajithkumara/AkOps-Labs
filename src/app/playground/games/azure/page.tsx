import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import TriviaQuiz from "@/components/game/TriviaQuiz";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Azure Games — AkOps Playground",
  description: "Azure trivia sprint covering Virtual Machines, AKS, Resource Groups, and more.",
};

export default function AzureGamesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-sky" />
        </div>
        <Container className="relative py-16 text-center">
          <Link href="/playground/games" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All categories
          </Link>
          <Badge>Azure</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Azure Games
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Virtual Machines, AKS, Resource Groups, Azure Functions — test your
            Azure fundamentals.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-10">
          <TriviaQuiz
            categories={["Azure"]}
            title="Azure Trivia Sprint"
            accentFrom="#2563eb"
            accentTo="#38bdf8"
            storageKey="akops-trivia-azure-best"
          />
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-dashed border-hairline p-5 text-center">
            <Sparkles className="mx-auto h-5 w-5 text-muted" />
            <p className="text-sm text-muted">A dedicated arcade game for Azure is on the roadmap — for now, the trivia sprint is the fastest way to test yourself.</p>
          </div>
        </Container>
      </section>
    </>
  );
}
