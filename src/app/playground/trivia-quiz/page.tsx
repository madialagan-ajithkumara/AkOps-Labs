import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import TriviaQuiz from "@/components/game/TriviaQuiz";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "DevOps Trivia Quiz — AkOps Playground",
  description: "Timed multiple-choice questions on Docker, Kubernetes, CI/CD, Cloud, and Git.",
};

export default function TriviaQuizPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-sky" />
        </div>
        <Container className="relative py-20 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All games
          </Link>
          <Badge>AkOps Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            DevOps Trivia Quiz
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            How well do you really know Docker, Kubernetes, CI/CD, and the cloud?
            Answer fast for a higher score.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <TriviaQuiz />
        </Container>
      </section>
    </>
  );
}
