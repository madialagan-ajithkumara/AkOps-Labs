import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { roadmaps, siteConfig } from "@/lib/site-config";
import { CheckCircle2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Roadmaps — DevOps, Cloud, Kubernetes & Career Learning Paths",
  description:
    "Structured learning roadmaps from AkOps Labs: DevOps, Cloud, Kubernetes, and a Resume & Career roadmap powered by AkOps Resume AI.",
};

export default function RoadmapsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
          <div className="blob blob-peach" />
        </div>
        <Container className="relative py-24 text-center">
          <Badge>Roadmaps</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Structured paths from zero to job-ready.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            No guesswork — just the ordered steps that take you from your first
            command to a production-ready skill set, plus a roadmap to turn that
            skill set into interviews.
          </p>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-3xl space-y-16">
            {roadmaps.map((r) => (
              <Card key={r.slug} id={r.slug}>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon name={r.icon as any} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{r.name}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{r.description}</p>
                  </div>
                </div>

                <div className="relative mt-8 pl-3">
                  <div className="absolute bottom-3 left-6 top-3 w-px bg-hairline" />
                  <ol className="space-y-6">
                    {r.steps.map((step, i) => {
                      const isFirst = i === 0;
                      const isLast = i === r.steps.length - 1;
                      return (
                        <li key={step} className="relative flex items-start gap-4">
                          <span
                            className={`relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isLast ? "bg-accent text-white" : "bg-accent-soft text-accent"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{step}</p>
                            {isFirst && (
                              <span className="mt-0.5 inline-block text-xs font-bold uppercase tracking-wide text-accent">
                                Start here
                              </span>
                            )}
                            {isLast && (
                              <span className="mt-0.5 inline-block text-xs font-bold uppercase tracking-wide text-accent">
                                Job-ready
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                {r.slug === "career-roadmap" && (
                  <Button href={siteConfig.resumeAiUrl} external className="mt-8 w-full justify-center">
                    <Sparkles className="h-4 w-4" />
                    Start with Resume AI
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Why follow a roadmap" title="Learning in the right order matters." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              "No wasted time on the wrong topic at the wrong stage",
              "Each roadmap maps directly to AkOps Academy programs",
              "Backed by AkOps Resume AI to turn skills into interviews",
            ].map((item) => (
              <Card key={item}>
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm leading-relaxed text-muted">{item}</p>
              </Card>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button href="/academy">Explore Academy programs</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
