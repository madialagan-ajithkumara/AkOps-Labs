import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import ConfigDebug from "@/components/game/ConfigDebug";
import TriviaQuiz from "@/components/game/TriviaQuiz";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "IaC Games — AkOps Playground",
  description: "Infrastructure as Code games: Config Debug Challenge and an IaC trivia sprint.",
};

export default function IacGamesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-peach" />
        </div>
        <Container className="relative py-16 text-center">
          <Link href="/playground/games" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All categories
          </Link>
          <Badge>IaC</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            IaC Games
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Spot the bug in real Terraform and config files, then test your
            Infrastructure as Code fundamentals.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-16">
          <div>
            <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-muted">Featured — Config Debug Challenge</h2>
            <ConfigDebug />
          </div>
          <div>
            <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-muted">IaC Trivia Sprint</h2>
            <TriviaQuiz
              categories={["IaC"]}
              title="IaC Trivia Sprint"
              accentFrom="#ea580c"
              accentTo="#f59e0b"
              storageKey="akops-trivia-iac-best"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
