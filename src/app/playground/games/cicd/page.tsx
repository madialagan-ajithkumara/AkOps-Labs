import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import PipelineGame from "@/components/game/PipelineGame";
import TriviaQuiz from "@/components/game/TriviaQuiz";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "CI/CD Games — AkOps Playground",
  description: "CI/CD games: Pipeline Speed-Run and a CI/CD trivia sprint.",
};

export default function CicdGamesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
        </div>
        <Container className="relative py-16 text-center">
          <Link href="/playground/games" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All categories
          </Link>
          <Badge>CI/CD</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            CI/CD Games
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Race the clock to build a pipeline in the right order, then test
            your CI/CD knowledge.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-16">
          <div>
            <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-muted">Featured — Pipeline Speed-Run</h2>
            <PipelineGame />
          </div>
          <div>
            <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-muted">CI/CD Trivia Sprint</h2>
            <TriviaQuiz
              categories={["CI/CD"]}
              title="CI/CD Trivia Sprint"
              accentFrom="#0f9d58"
              accentTo="#17b978"
              storageKey="akops-trivia-cicd-best"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
