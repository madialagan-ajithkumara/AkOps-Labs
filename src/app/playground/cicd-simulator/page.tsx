import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import TriviaQuiz from "@/components/game/TriviaQuiz";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "CI/CD Simulator — AkOps Playground",
  description: "Make the right call at each pipeline decision point — rollbacks, canaries, flaky tests, and more.",
};

export default function CicdSimulatorPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs"><div className="blob blob-mint" /></div>
        <Container className="relative py-16 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> Playground
          </Link>
          <Badge>Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">CI/CD Simulator</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Real pipeline decisions — rollbacks, canaries, flaky tests, secrets. Make the right call.
          </p>
        </Container>
      </section>
      <section className="py-16">
        <Container>
          <TriviaQuiz
            categories={["CI/CD Simulator"]}
            title="CI/CD Simulator"
            description="6 scenario decisions — pick the best practice each time."
            questionCount={6}
            accentFrom="#0f9d58"
            accentTo="#17b978"
            storageKey="akops-cicdsim-best"
          />
        </Container>
      </section>
    </>
  );
}
