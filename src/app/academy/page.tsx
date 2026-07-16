import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { academyPrograms, successStories } from "@/lib/site-config";
import { CheckCircle2, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "AkOps Academy — DevOps & Cloud Training, Workshops, Certifications",
  description:
    "AkOps Academy offers cohort-based training programs, hands-on workshops, certification prep, and corporate training in DevOps, Cloud, and Platform Engineering.",
};

export default function AcademyPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="glow absolute inset-0" />
        <Container className="relative py-24 text-center">
          <Badge>AkOps Academy</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Learn the skills enterprises actually hire for.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Bootcamps, self-paced courses, and certification prep in DevOps, Cloud
            Engineering, and Platform Engineering — from individual learners to full
            corporate training programs.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact">Talk to our training team</Button>
            <Button href="/roadmaps" variant="secondary">See learning roadmaps</Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-hairline py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {academyPrograms.map((p) => (
              <Card key={p.name}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon name={p.icon as any} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
                <ul className="mt-5 space-y-2.5 border-t border-hairline pt-5">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Why AkOps Academy" title="Built by consultants who ship production systems." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { title: "Practitioner-led", desc: "Every course is taught by engineers actively delivering client work." },
              { title: "Hands-on labs", desc: "Real infrastructure, real tools — not slideware." },
              { title: "Career-outcome focused", desc: "Curriculum mapped to the roles and certifications employers value." },
            ].map((f) => (
              <Card key={f.title}>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>


      {/* Success Stories */}
      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Success Stories" title="Real people, real outcomes." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {successStories.map((s) => (
              <Card key={s.name}>
                <Quote className="h-5 w-5 text-accent" />
                <p className="mt-4 text-sm leading-relaxed text-muted">&ldquo;{s.quote}&rdquo;</p>
                <div className="mt-5 border-t border-hairline pt-4">
                  <p className="text-sm font-bold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted">{s.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="card-surface rounded-3xl px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Bring AkOps Academy to your team.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted">
              Custom corporate training programs designed around your stack, your team, and your timeline.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/contact">Request corporate training</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
