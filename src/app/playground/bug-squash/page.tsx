import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import BugSquash from "@/components/game/BugSquash";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Bug Squash — AkOps Playground",
  description: "Click bugs before they cause an outage. A fast reflex game that gets harder every round.",
};

export default function BugSquashPage() {
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
            Bug Squash
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Every bug you miss is one step closer to a production outage. Stay
            sharp — the grid gets faster the longer you survive.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <BugSquash />
        </Container>
      </section>
    </>
  );
}
