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
  roadmaps,
  successStories,
  playgroundGames,
} from "@/lib/site-config";
import { ArrowUpRight, Users, Sparkles, Flame, Trophy, Youtube, Linkedin, Github } from "lucide-react";

const partners = ["AWS", "Google Cloud", "Microsoft Azure", "Kubernetes", "Terraform", "Datadog"];

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative min-h-[680px] overflow-hidden border-b border-hairline">
        <HeroBackdrop />
        <Container className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge>Learn. Practice. Build. Get Hired.</Badge>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
              THE HANDS-ON
              <br />
              <span className="text-gradient">DEVOPS &amp; CLOUD</span>
              <br />
              LEARNING PLATFORM
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Learning paths, a game-based Playground, daily practice tasks, an
              AI resume product, and enterprise consulting — one ecosystem to
              take you from first command to hired.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/playground" className="!px-8 !py-4 !text-base">
                <Sparkles className="h-4 w-4" />
                Start Playing Free
              </Button>
              <Button href={siteConfig.resumeAiUrl} external variant="secondary">
                Try Resume AI
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Trusted partners */}
      <section className="border-b border-hairline py-14">
        <Container>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted">
            Learn the tools real teams run in production
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

      {/* 2. Learning Paths */}
      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading
            eyebrow="Learning Paths"
            title="Structured paths from zero to job-ready."
            description="No guesswork — ordered steps that take you from your first command to a production-ready skill set."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roadmaps.map((r) => (
              <Card key={r.slug}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon name={r.icon as any} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold">{r.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.description}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href="/roadmaps" variant="secondary">View all learning paths</Button>
          </div>
        </Container>
      </section>

      {/* 3. Playground */}
      <section className="relative overflow-hidden border-b border-hairline py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.05] to-transparent" />
        <Container className="relative">
          <SectionHeading
            eyebrow="Playground"
            title="Learn by playing, not just reading."
            description="Five game categories — Kubernetes, AWS, Azure, CI/CD, and IaC — each with quick games to test your speed, reflexes, and knowledge."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {playgroundGames.slice(0, 5).map((g) => (
              <Link
                key={g.slug}
                href={`/playground/${g.slug}`}
                className="card-surface group flex flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <span
                  className="inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                  style={{ background: `${g.color}1a`, color: g.color }}
                >
                  {g.tag}
                </span>
                <h3 className="mt-3 text-sm font-bold">{g.name}</h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                  Play <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href="/playground/games">Browse all game categories</Button>
          </div>
        </Container>
      </section>

      {/* 4. Daily Challenges */}
      <section className="border-b border-hairline py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Badge>Daily Challenges</Badge>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              One task a day builds real skills.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              A new hands-on DevOps task every day — Docker, Kubernetes, CI/CD,
              IaC, and more. Mark it complete, build your streak.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/playground/tasks">
                <Flame className="h-4 w-4" />
                Start today's task
              </Button>
              <Button href="/playground/progress" variant="secondary">
                <Trophy className="h-4 w-4" />
                View your progress
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Resume AI */}
      <section className="relative overflow-hidden border-b border-hairline py-24">
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
              <div className="flex items-center justify-between border-b border-hairline pb-4">
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
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-tint">
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

      {/* 6. Community */}
      <section className="border-b border-hairline py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Community"
                title="A growing community of DevOps & Cloud engineers."
                description="AKOps Tamil, DevOps tutorials, and Kubernetes learning content — join engineers learning in public."
              />
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={siteConfig.youtubeUrl} external>
                  <Youtube className="h-4 w-4" />
                  Subscribe on YouTube
                </Button>
                <Button href="/youtube" variant="secondary" showArrow={false}>
                  Explore content
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            <Card>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold">Learn together, in public</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Every game, roadmap, and daily task is designed to be shared —
                compare your streak, your progress, and what you're building
                with the rest of the community.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* 7. Success Stories */}
      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Success Stories" title="Real people, real outcomes." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {successStories.map((s) => (
              <Card key={s.name}>
                <p className="text-sm leading-relaxed text-muted">&ldquo;{s.quote}&rdquo;</p>
                <div className="mt-5 border-t border-hairline pt-4">
                  <p className="text-sm font-bold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted">{s.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. Founder */}
      <section className="border-b border-hairline py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge>Founder</Badge>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Built by Ajith Kumar, for engineers.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              AkOps Labs started as a single DevOps consulting practice and grew into
              a full learning ecosystem — because the same gap kept showing up: people
              learning DevOps needed practice, not just theory. Our mission is to help
              <span className="font-semibold text-foreground"> 100,000 engineers </span>
              learn DevOps through real, hands-on experience — games, daily tasks,
              roadmaps, and an AI-powered career platform, all built to get you hired.
            </p>
            <Button href="/about" variant="secondary" className="mt-8">
              Read our story
            </Button>
          </div>
        </Container>
      </section>

      {/* 9. Enterprise Services */}
      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading
            eyebrow="Enterprise Services"
            title="Enterprise infrastructure, delivered by practitioners."
            description="Five focused consulting practices covering the full lifecycle of modern cloud infrastructure."
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

      {/* Contact CTA (leads into Footer) */}
      <section className="py-24">
        <Container>
          <div className="card-surface relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
            <div className="glow absolute inset-0" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to learn, practice, and build?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted">
                Jump into the Playground for free, or talk to us about consulting
                and corporate training.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button href="/playground">Start Playing Free</Button>
                <Button href="/contact" variant="secondary">
                  Contact us
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
