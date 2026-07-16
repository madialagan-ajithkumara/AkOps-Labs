import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import IncidentCommander from "@/components/game/IncidentCommander";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Incident Commander — AkOps Playground",
  description: "Order the correct incident-response steps against the clock across real DevOps scenarios.",
};

export default function IncidentCommanderPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs"><div className="blob blob-sky" /></div>
        <Container className="relative py-16 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> Playground
          </Link>
          <Badge>Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">Incident Commander</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">Production is on fire. You're in charge.</p>
        </Container>
      </section>
      <section className="py-16"><Container><IncidentCommander /></Container></section>
    </>
  );
}
