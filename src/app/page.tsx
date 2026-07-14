import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import HeroBackdrop from "@/components/effects/HeroBackdrop";
import Icon from "@/components/ui/Icon";
import {
  siteConfig,
  services,
  resumeAiFeatures,
  academyPrograms,
  youtubeSeries,
} from "@/lib/site-config";
import { ArrowUpRight, Users, Building, Rocket, Sparkles } from "lucide-react";

const partners = ["AWS", "Google Cloud", "Microsoft Azure", "Kubernetes", "Terraform", "Datadog"];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[720px] overflow-hidden border-b border-black/5">
        <HeroBackdrop />
        <Container className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge>Enterprise DevOps · Cloud · AI Career Products</Badge>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
              LAUNCH YOUR
              <br />
              <span className="text-gradient">DEVOPS &amp; CLOUD</span>
              <br />
              CAREER WITH AKOPS
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Consulting for enterprises. AI-powered resume tools for job seekers.
              Hands-on training and a growing YouTube community — one ecosystem to
              help you build, learn, and get hired.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href={siteConfig.resumeAiUrl} external className="!px-8 !py-4 !text-base">
                <Sparkles className="h-4 w-4" />
                Start with Resume AI
              </Button>
              <Link href="/services" className="btn-pill">
                My Services
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Trusted Technology Partner */}
      <section className="border-b border-black/5 py-14">
        <Container>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted">
            Trusted technology &amp; platform partners
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
            {partners.map((p) => (
              <span key={p} className="text-sm font-semibold tracking-wide text-muted">
                {p}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Ecosystem Overview */}
      <section className="border-b border-black/5 py-24">
        <Container>
          <SectionHeading
            eyebrow="The Ecosystem"
            title="One company. Four connected businesses."
            description="AkOps Labs unifies consulting, AI products, education, and community under a single brand — each reinforcing the others."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold">AkOps</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                DevOps, Cloud, Platform, FinOps &amp; AIOps consulting for enterprises.
              </p>
              <Link href="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                View services <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold">AkOps Resume AI</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Flagship AI product: resume analysis, ATS scoring, and career coaching.
              </p>
              <Link href="/resume-ai" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                Explore product <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon name="GraduationCap" className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold">AkOps Academy</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Bootcamps, courses, and certifications for individuals and teams.
              </p>
              <Link href="/academy" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                See programs <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold">AkOps YouTube</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                AKOps Tamil, DevOps tutorials, and Kubernetes learning content.
              </p>
              <Link href="/youtube" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                Watch content <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </div>
        </Container>
      </section>

      {/* Featured Product: AkOps Resume AI */}
      <section className="relative overflow-hidden border-b border-black/5 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.05] to-transparent" />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge>Flagship Product · Live Now</Badge>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                AkOps Resume AI
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Our AI-powered career platform helps job seekers analyze, optimize, and
                build resumes that pass ATS screening and land interviews. Already live
                and helping candidates get hired.
              </p>
              <ul className="mt-6 space-y-3">
                {resumeAiFeatures.map((f) => (
                  <li key={f.name} className="flex items-start gap-3 text-sm text-muted">
                    <Icon name="CheckCircle2" className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span>
                      <span className="font-semibold text-foreground">{f.name}</span> — {f.description}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={siteConfig.resumeAiUrl} external>
                  <Sparkles className="h-4 w-4" />
                  Launch Resume AI
                </Button>
                <Button href="/resume-ai" variant="secondary" showArrow={false}>
                  Learn more
                </Button>
              </div>
            </div>
            <div className="card-surface rounded-2xl p-8">
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <span className="text-sm font-medium text-muted">ATS Compatibility Score</span>
                <span className="text-2xl font-extrabold text-gradient">94%</span>
              </div>
              <div className="mt-6 space-y-4">
                {["Keyword Match", "Formatting", "Section Structure", "Readability"].map((row, i) => (
                  <div key={row}>
                    <div className="flex justify-between text-xs text-muted">
                      <span>{row}</span>
                      <span>{[92, 88, 97, 90][i]}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-black/[0.06]">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-accent to-accent-2"
                        style={{ width: `${[92, 88, 97, 90][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Consulting Services */}
      <section className="border-b border-black/5 py-24">
        <Container>
          <SectionHeading
            eyebrow="AkOps Consulting"
            title="Enterprise infrastructure, delivered by practitioners."
            description="Five focused practices covering the full lifecycle of modern cloud infrastructure."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Card key={s.slug} id={s.slug}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon name={s.icon as any} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
              </Card>
            ))}
            <Card className="flex flex-col items-start justify-center bg-transparent shadow-none">
              <p className="text-sm text-muted">Need a partner for your next migration or platform build?</p>
              <Button href="/services" variant="secondary" className="mt-4">
                View all services
              </Button>
            </Card>
          </div>
        </Container>
      </section>

      {/* Learning & Academy */}
      <section className="border-b border-black/5 py-24">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="AkOps Academy"
                title="Learn the skills enterprises actually hire for."
                description="Bootcamps, courses, workshops, and certification prep built by practitioners who ship production infrastructure."
              />
              <Button href="/academy" className="mt-8">
                Browse programs
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {academyPrograms.map((p) => (
                <Card key={p.name}>
                  <Icon name={p.icon as any} className="h-5 w-5 text-accent" />
                  <h3 className="mt-3 text-sm font-bold">{p.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{p.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* YouTube Community */}
      <section className="border-b border-black/5 py-24">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div className="order-2 grid gap-4 sm:grid-cols-2 lg:order-1">
              {youtubeSeries.map((y) => (
                <Card key={y.name}>
                  <Icon name={y.icon as any} className="h-5 w-5 text-accent" />
                  <h3 className="mt-3 text-sm font-bold">{y.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{y.description}</p>
                </Card>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading
                eyebrow="AkOps YouTube"
                title="A growing community of DevOps &amp; Cloud engineers."
                description="Tutorials, series, and Tamil-language content built for engineers learning DevOps, Kubernetes, and cloud from the ground up."
              />
              <Button href="/youtube" className="mt-8">
                Watch the channel
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Founder Story */}
      <section className="border-b border-black/5 py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge>Founder Story</Badge>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Built by engineers, for engineers.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              AkOps Labs started as a single DevOps consulting practice and grew into
              an ecosystem — because the same problems kept surfacing: teams needed
              better infrastructure, engineers needed better career tools, and the
              community needed practical, honest technical content. Today AkOps Labs
              brings all three together under one roof, built on the belief that
              great engineering knowledge shouldn&apos;t be locked away from the people
              trying to break into the field.
            </p>
            <Button href="/about" variant="secondary" className="mt-8">
              Read our story
            </Button>
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-24">
        <Container>
          <div className="card-surface relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
            <div className="glow absolute inset-0" style={{ ["--y" as string]: "0%" }} />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Let&apos;s build your next platform.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted">
                Whether it&apos;s consulting, a corporate training program, or a
                partnership — our team is ready to talk.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button href="/contact">Contact us</Button>
                <Button href={siteConfig.resumeAiUrl} external variant="secondary">
                  Try Resume AI
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
