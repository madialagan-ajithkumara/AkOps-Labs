import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import { Target, Users, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "About AkOps Labs — Our Story, Mission & Values",
  description:
    "AkOps Labs is the parent company behind AkOps Consulting, AkOps Resume AI, AkOps Academy, and the AKOps YouTube community. Learn our story and mission.",
};

const values = [
  {
    icon: Target,
    title: "Practitioner-first",
    desc: "Everything we build and teach comes from real production experience, not theory.",
  },
  {
    icon: Users,
    title: "Community over gatekeeping",
    desc: "We believe technical knowledge should be accessible, not locked behind paywalls and jargon.",
  },
  {
    icon: Rocket,
    title: "Build for outcomes",
    desc: "Whether it's a client's infrastructure or a candidate's resume, we optimize for real results.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="glow absolute inset-0" />
        <Container className="relative py-24 text-center">
          <Badge>About AkOps Labs</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Built by engineers, for engineers.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            AkOps Labs is the parent company behind a growing ecosystem of consulting,
            AI products, education, and community content — all built around one idea:
            enterprise-grade engineering knowledge should be accessible.
          </p>
        </Container>
      </section>

      <section className="border-b border-hairline py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-4 border-accent-soft shadow-md">
                <Image
                  src="/founder.jpg"
                  alt="Ajith Kumar, Founder of AkOps Labs"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Ajith Kumar</p>
                <p className="text-sm text-muted">Founder, AkOps Labs</p>
              </div>
            </div>
            <div className="mt-8">
              <SectionHeading eyebrow="Our Story" title="From consulting practice to full ecosystem." />
            </div>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
              <p>
                AkOps Labs began as a single DevOps consulting practice, helping
                engineering teams modernize infrastructure and ship faster. Along the
                way, a pattern became clear: the same skills gap that made consulting
                valuable to enterprises was also holding back individual engineers
                trying to break into the field or level up their careers.
              </p>
              <p>
                That realization led to AkOps Resume AI — an AI-powered platform to
                help job seekers get past ATS filters and land interviews — and later
                to AkOps Academy, our training and certification arm, and the AKOps
                YouTube channel, where we share what we learn in public, including a
                growing library of Tamil-language content.
              </p>
              <p>
                Today, AkOps Labs operates as one connected ecosystem: enterprise
                consulting funds and informs our products and education, our products
                help individuals grow, and our community content brings new engineers
                into the fold. Each part makes the others stronger.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="What we believe" title="The principles behind everything we build." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <Card key={v.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="card-surface rounded-3xl px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Want to work with us — or join us?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted">
              Whether you&apos;re hiring for consulting, exploring a partnership, or
              just want to connect — we&apos;d love to hear from you.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/contact">Get in touch</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
