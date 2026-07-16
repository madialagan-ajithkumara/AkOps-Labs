import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";
import { ArrowLeft, Construction, MessagesSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Interview Arena — Coming Soon | AkOps Playground",
  description: "Live AI-powered mock interviews for DevOps roles — coming soon to AkOps Playground.",
};

export default function AiInterviewArenaPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-blobs"><div className="blob blob-peach" /></div>
      <Container className="relative py-24 text-center">
        <Link href="/playground" className="mx-auto mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
          <ArrowLeft className="h-3.5 w-3.5" /> Playground
        </Link>
        <Badge>Coming Soon</Badge>
        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <MessagesSquare className="h-7 w-7" />
        </div>
        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          AI Interview Arena
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
          A live, AI-powered mock interview needs a real LLM connected on the
          backend — we don't want to fake "AI" with canned scripts. We're
          building this properly, so it's not live yet.
        </p>
        <div className="mx-auto mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-muted">
          <Construction className="h-4 w-4" />
          For interview prep today, try AkOps Resume AI's Career Coach
        </div>
        <div className="mt-6">
          <Button href={siteConfig.resumeAiUrl} external>Try Resume AI</Button>
        </div>
      </Container>
    </section>
  );
}
