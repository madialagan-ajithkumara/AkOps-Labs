import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import TerraformEscapeRoom from "@/components/game/TerraformEscapeRoom";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terraform Escape Room — AkOps Playground",
  description: "Five locked doors, five Terraform puzzles. Answer correctly to escape.",
};

export default function EscapeRoomPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs"><div className="blob blob-mint" /></div>
        <Container className="relative py-16 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> Playground
          </Link>
          <Badge>Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Terraform Escape Room</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">Solve your way out, one door at a time.</p>
        </Container>
      </section>
      <section className="py-16"><Container><TerraformEscapeRoom /></Container></section>
    </>
  );
}
