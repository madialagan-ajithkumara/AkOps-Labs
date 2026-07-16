import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import AwsCostDetective from "@/components/game/AwsCostDetective";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "AWS Cost Detective — AkOps Playground",
  description: "Find the wasteful or misconfigured resource in a mock AWS bill before time runs out.",
};

export default function CostDetectivePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs"><div className="blob blob-peach" /></div>
        <Container className="relative py-16 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> Playground
          </Link>
          <Badge>Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">AWS Cost Detective</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">Someone's bill has a problem. Find it.</p>
        </Container>
      </section>
      <section className="py-16"><Container><AwsCostDetective /></Container></section>
    </>
  );
}
