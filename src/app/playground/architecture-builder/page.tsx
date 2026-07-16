import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import TriviaQuiz from "@/components/game/TriviaQuiz";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Architecture Builder — AkOps Playground",
  description: "Pick the right architecture building block for each real-world scenario.",
};

export default function ArchitectureBuilderPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs"><div className="blob blob-sky" /></div>
        <Container className="relative py-16 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> Playground
          </Link>
          <Badge>Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Architecture Builder</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Given the requirement, pick the right building block — HA, scaling, messaging, and more.
          </p>
        </Container>
      </section>
      <section className="py-16">
        <Container>
          <TriviaQuiz
            categories={["Architecture"]}
            title="Architecture Builder"
            description="6 scenarios — choose the right architecture pattern each time."
            questionCount={6}
            accentFrom="#2563eb"
            accentTo="#7c3aed"
            storageKey="akops-archbuilder-best"
          />
        </Container>
      </section>
    </>
  );
}
