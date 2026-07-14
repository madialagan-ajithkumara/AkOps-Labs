import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import PipelineGame from "@/components/game/PipelineGame";
import { Gauge, Timer, Trophy, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Pipeline Speed-Run — AkOps Playground",
  description:
    "Race the clock to build a CI/CD pipeline in the correct order across 3 levels of increasing difficulty.",
};

export default function PipelineSpeedRunPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
          <div className="blob blob-sky" />
        </div>
        <Container className="relative py-20 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            All games
          </Link>
          <Badge>AkOps Playground</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Pipeline Speed-Run
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Think you know CI/CD? Race the clock and put the pipeline stages in
            the right order — three levels, real DevOps stages, no partial credit.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <PipelineGame />

          <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
            <Card>
              <Timer className="h-5 w-5 text-accent" />
              <h3 className="mt-3 text-sm font-bold">Beat the clock</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Each level has a shrinking time budget — mistakes cost you seconds.
              </p>
            </Card>
            <Card>
              <Gauge className="h-5 w-5 text-accent" />
              <h3 className="mt-3 text-sm font-bold">Three difficulty levels</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                From a basic 5-stage pipeline to a full production release flow.
              </p>
            </Card>
            <Card>
              <Trophy className="h-5 w-5 text-accent" />
              <h3 className="mt-3 text-sm font-bold">Chase your best score</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Your top score is saved locally in your browser — come back and beat it.
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
