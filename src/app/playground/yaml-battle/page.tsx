import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import YamlBattle from "@/components/game/YamlBattle";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "YAML Battle — AkOps Playground",
  description: "Battle the Bug — find the broken line in real YAML/config snippets before it hits you back.",
};

export default function YamlBattlePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs"><div className="blob blob-peach" /></div>
        <Container className="relative py-16 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> Playground
          </Link>
          <Badge>Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">YAML Battle</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">Find the bug before it finds you.</p>
        </Container>
      </section>
      <section className="py-16"><Container><YamlBattle /></Container></section>
    </>
  );
}
