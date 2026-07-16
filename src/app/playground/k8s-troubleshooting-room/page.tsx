import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ArrowLeft, Construction, Boxes } from "lucide-react";

export const metadata: Metadata = {
  title: "Kubernetes Troubleshooting Room — Coming Soon | AkOps Playground",
  description: "A real, sandboxed Kubernetes cluster to debug live — coming soon to AkOps Playground.",
};

export default function K8sTroubleshootingRoomPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-blobs"><div className="blob blob-sky" /></div>
      <Container className="relative py-24 text-center">
        <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
          <ArrowLeft className="h-3.5 w-3.5" /> Playground
        </Link>
        <Badge>Coming Soon</Badge>
        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Boxes className="h-7 w-7" />
        </div>
        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Kubernetes Troubleshooting Room
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
          This one needs a real, sandboxed Kubernetes cluster per player —
          broken pods, misconfigured services, real <code className="rounded bg-tint px-1.5 py-0.5 text-sm">kubectl</code>{" "}
          debugging. We're building the infrastructure for that. Honest answer:
          it's not here yet.
        </p>
        <div className="mx-auto mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-muted">
          <Construction className="h-4 w-4" />
          In the meantime, try the Kubernetes games below
        </div>
        <div className="mt-6">
          <Button href="/playground/games/kubernetes" variant="secondary">Kubernetes Games</Button>
        </div>
      </Container>
    </section>
  );
}
