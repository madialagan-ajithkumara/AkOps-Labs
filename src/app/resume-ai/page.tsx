import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { siteConfig, resumeAiFeatures } from "@/lib/site-config";
import { CheckCircle2, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "AkOps Resume AI — AI-Powered Resume Analysis & Career Coaching",
  description:
    "AkOps Resume AI is our flagship product: AI resume analysis, ATS scoring, career coaching, and an AI-powered resume builder. Live and helping candidates get hired.",
};

const steps = [
  { title: "Upload your resume", desc: "Drop in your existing resume or start from scratch with the AI builder." },
  { title: "Get instant analysis", desc: "Receive an ATS compatibility score and section-by-section feedback." },
  { title: "Apply AI suggestions", desc: "Use career-coach recommendations to strengthen every section." },
  { title: "Export & apply", desc: "Download a recruiter-ready resume and start applying with confidence." },
];

export default function ResumeAiPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="glow absolute inset-0" />
        <Container className="relative py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge>Flagship Product · Live Now</Badge>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              AkOps <span className="text-gradient">Resume AI</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              An AI-powered career platform that analyzes, scores, and improves your
              resume — then coaches you toward the job you actually want. Already
              live and helping candidates get hired.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href={siteConfig.resumeAiUrl} external>
                Launch AkOps Resume AI
              </Button>
              <Button href="/contact" variant="secondary" showArrow={false}>
                Talk to us about integration
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted">
              Opens {siteConfig.resumeAiUrl.replace("https://", "")} in a new tab
            </p>
          </div>
        </Container>
      </section>

      {/* Product features */}
      <section className="border-b border-black/5 py-24">
        <Container>
          <SectionHeading
            eyebrow="What it does"
            title="Everything you need to land the interview."
            description="AkOps Resume AI combines resume analysis, ATS scoring, career coaching, and AI-assisted writing into one platform."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resumeAiFeatures.map((f) => (
              <Card key={f.name}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon name={f.icon as any} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-b border-black/5 py-24">
        <Container>
          <SectionHeading eyebrow="How it works" title="From upload to offer, in four steps." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Card key={s.title}>
                <span className="text-sm font-semibold text-accent">0{i + 1}</span>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Score preview + why it matters */}
      <section className="border-b border-black/5 py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="card-surface rounded-2xl p-8">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <span className="text-sm font-medium text-muted">ATS Compatibility Score</span>
                <span className="text-2xl font-semibold text-gradient">94%</span>
              </div>
              <div className="mt-6 space-y-4">
                {["Keyword Match", "Formatting", "Section Structure", "Readability"].map((row, i) => (
                  <div key={row}>
                    <div className="flex justify-between text-xs text-muted">
                      <span>{row}</span>
                      <span>{[92, 88, 97, 90][i]}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-black/[0.04]">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2"
                        style={{ width: `${[92, 88, 97, 90][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Why ATS compatibility matters
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Over 75% of resumes are filtered by Applicant Tracking Systems before
                a human ever sees them. AkOps Resume AI reverse-engineers real ATS
                behavior so your resume gets past the filter — and into the hands of
                a recruiter.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Benchmarked against real-world ATS platforms",
                  "Keyword optimization tied to the job description",
                  "Instant, actionable feedback — not generic tips",
                  "Built by engineers who understand hiring pipelines",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="card-surface relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
            <div className="glow absolute inset-0" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your next resume starts here.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted">
                Free to try. No credit card required. Get your ATS score in minutes.
              </p>
              <div className="mt-8 flex justify-center">
                <a
                  href={siteConfig.resumeAiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:opacity-90"
                >
                  Launch AkOps Resume AI
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
