import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import TerminalChallenge from "@/components/game/TerminalChallenge";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terminal Challenge — AkOps Playground",
  description:
    "Type real kubectl, docker, and terraform commands to diagnose and fix live DevOps incidents in a simulated terminal.",
};

export default function TerminalChallengePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-sky" />
        </div>
        <Container className="relative py-20 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All games
          </Link>
          <Badge>AkOps Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Terminal Challenge
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            No multiple choice. Type the real command, in a real terminal, to
            fix a real incident — CrashLoopBackOff pods, traffic spikes,
            broken builds, and infra drift.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <TerminalChallenge />
        </Container>
      </section>
    </>
  );
}
