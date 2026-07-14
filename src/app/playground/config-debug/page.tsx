import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import ConfigDebug from "@/components/game/ConfigDebug";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Config Debug Challenge — AkOps Playground",
  description: "Spot the broken line in real YAML, Dockerfile, and Terraform snippets before time runs out.",
};

export default function ConfigDebugPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="hero-blobs">
          <div className="blob blob-peach" />
        </div>
        <Container className="relative py-20 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All games
          </Link>
          <Badge>AkOps Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Config Debug Challenge
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            The kind of bugs that actually break production — one broken line
            per snippet, real config formats, real explanations.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <ConfigDebug />
        </Container>
      </section>
    </>
  );
}
