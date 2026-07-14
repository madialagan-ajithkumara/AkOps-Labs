import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import DailyTask from "@/components/game/DailyTask";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "DevOps Tasks — AkOps Playground",
  description: "One hands-on DevOps task a day. Build a streak, build real skills — Docker, Kubernetes, CI/CD, IaC, and more.",
};

export default function TasksPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
          <div className="blob blob-peach" />
        </div>
        <Container className="relative py-16 text-center">
          <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            Playground
          </Link>
          <Badge>DevOps Tasks</Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            One task a day builds real skills.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            A new hands-on DevOps task every day — hands on keyboard, not just
            reading. Mark it done, build your streak.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <DailyTask />
        </Container>
      </section>
    </>
  );
}
