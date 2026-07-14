import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { services } from "@/lib/site-config";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "AkOps Services — DevOps, Cloud, Platform, FinOps & AIOps Consulting",
  description:
    "Enterprise DevOps consulting across DevOps automation, Cloud Engineering, Platform Engineering, FinOps, and AIOps — delivered by practitioners.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="glow absolute inset-0" />
        <Container className="relative py-24 text-center">
          <Badge>AkOps Consulting</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Enterprise infrastructure, delivered by practitioners.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Five focused practices that cover the full lifecycle of modern cloud
            infrastructure — from first deployment to enterprise scale.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="/contact">Start a project</Button>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="space-y-20">
          {services.map((s, i) => (
            <div
              key={s.slug}
              id={s.slug}
              className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={s.icon as any} className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {s.name}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  {s.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {s.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-sm text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <Card className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-center justify-between border-b border-black/5 pb-4">
                  <span className="text-sm font-medium text-muted">Engagement Model</span>
                  <span className="text-xs text-accent">Custom scoped</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-muted">
                  <p>Discovery &amp; architecture review</p>
                  <p>Implementation &amp; migration</p>
                  <p>Documentation &amp; team enablement</p>
                  <p>Ongoing support (optional)</p>
                </div>
              </Card>
            </div>
          ))}
        </Container>
      </section>

      <section className="border-t border-black/5 py-24">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="A clear, low-risk engagement process."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Discovery", desc: "We assess your current infrastructure, team, and goals." },
              { step: "02", title: "Proposal", desc: "A scoped plan with timeline, deliverables, and pricing." },
              { step: "03", title: "Execution", desc: "Hands-on implementation with regular check-ins." },
              { step: "04", title: "Handover", desc: "Documentation and team enablement so you own the outcome." },
            ].map((s) => (
              <Card key={s.step}>
                <span className="text-sm font-semibold text-accent">{s.step}</span>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-black/5 py-24">
        <Container>
          <div className="card-surface rounded-3xl px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to scope your project?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted">
              Tell us about your infrastructure and goals — we&apos;ll respond within one business day.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/contact">Contact our team</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
