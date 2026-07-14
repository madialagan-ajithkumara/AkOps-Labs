import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import BugSquash from "@/components/game/BugSquash";
import TriviaQuiz from "@/components/game/TriviaQuiz";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Kubernetes Games — AkOps Playground",
  description: "Kubernetes-themed games: Bug Squash and a Kubernetes trivia sprint.",
};

export default function KubernetesGamesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="hero-blobs">
          <div className="blob blob-sky" />
        </div>
        <Container className="relative py-16 text-center">
          <Link href="/playground/games" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All categories
          </Link>
          <Badge>Kubernetes</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Kubernetes Games
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Squash bugs before they take down your cluster, then test your Pods,
            Deployments, and Services knowledge.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-16">
          <div>
            <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-muted">Featured — Bug Squash</h2>
            <BugSquash />
          </div>
          <div>
            <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-widest text-muted">Kubernetes Trivia Sprint</h2>
            <TriviaQuiz
              categories={["Kubernetes"]}
              title="Kubernetes Trivia Sprint"
              accentFrom="#0ea5e9"
              accentTo="#38bdf8"
              storageKey="akops-trivia-kubernetes-best"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
