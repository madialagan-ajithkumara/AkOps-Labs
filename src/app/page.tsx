import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import { roadmaps, playgroundGames } from "@/lib/site-config";
import { courses } from "@/lib/courses";
import { projects } from "@/lib/projects";
import { ArrowUpRight, BookOpen, Download, Gamepad2, Clock } from "lucide-react";

const pillars = [
  { href: "/courses", icon: BookOpen, title: "Video courses", desc: "End-to-end Kubernetes, AWS and CI/CD courses. Learn at your own pace." },
  { href: "/projects", icon: Download, title: "Real projects", desc: "Download complete DevOps projects with code, configs and guides." },
  { href: "/playground", icon: Gamepad2, title: "Hands-on playground", desc: "Practice real commands and incidents. Earn XP every day." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
          <div className="blob blob-sky" />
          <div className="blob blob-peach" />
        </div>
        <Container className="relative py-24 text-center sm:py-32">
          <Badge>Learn DevOps from the basics</Badge>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            Learn DevOps by <span className="text-gradient">building real things.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Video courses, downloadable end-to-end projects and a hands-on playground,
            all in one place, made for beginners.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/courses">Explore courses</Button>
            <Button href="/login" variant="secondary" showArrow={false}>Create free account</Button>
          </div>
        </Container>
      </section>

      {/* Pillars */}
      <section className="border-b border-hairline py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {pillars.map((p) => (
              <Link key={p.href} href={p.href}>
                <Card className="h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Courses */}
      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Video courses" title="End-to-end courses, start to finish." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <Link
                key={c.slug}
                href={`/courses/${c.slug}`}
                className="card-surface flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ borderTop: `3px solid ${c.color}` }}
              >
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: c.color }}>{c.level}</span>
                <h3 className="mt-2 text-lg font-extrabold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{c.tagline}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted"><Clock className="h-4 w-4" /> {c.hours}h</span>
                  <span className="text-xs font-semibold text-muted">Included in tracks</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10"><Button href="/courses" variant="secondary">See all courses</Button></div>
        </Container>
      </section>

      {/* Projects */}
      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Projects" title="Download real projects. Build your portfolio." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {projects.slice(0, 2).map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="card-surface flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ borderTop: `3px solid ${p.color}` }}
              >
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: p.color }}>{p.level}</span>
                <h3 className="mt-2 text-lg font-extrabold">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{p.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: p.color }}>
                  <Download className="h-4 w-4" /> Free with an account
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10"><Button href="/projects" variant="secondary">See all projects</Button></div>
        </Container>
      </section>

      {/* Playground */}
      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Playground" title="Practice what you learn." description="Hands-on DevOps challenges. Real commands, real configs, real incidents." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playgroundGames.map((g) => (
              <Link key={g.slug} href={`/playground/${g.slug}`} className="card-surface group rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <span className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide" style={{ background: `${g.color}1a`, color: g.color }}>{g.tag}</span>
                <h3 className="mt-3 text-base font-bold">{g.name}</h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                  Play <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Roadmaps */}
      <section className="border-b border-hairline py-24">
        <Container>
          <SectionHeading eyebrow="Roadmaps" title="Not sure where to start? Follow a path." />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {roadmaps.filter((r) => r.slug !== "career-roadmap").map((r) => (
              <Link key={r.slug} href={`/roadmaps#${r.slug}`}>
                <Card className="h-full">
                  <h3 className="text-lg font-bold">{r.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{r.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder */}
      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-accent-soft shadow-lg">
              <Image src="/founder.jpg" alt="Ajith Kumar, Founder of AkOps Labs" width={96} height={96} className="h-full w-full object-cover" />
            </div>
            <div className="mt-6"><Badge>Founder</Badge></div>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Built by Ajith Kumar, for DevOps students.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              Too many people learn DevOps from theory alone. AkOps Labs gives you the
              full picture: clear video courses, real projects to build, and a
              playground to practice. The goal is to help
              <span className="font-semibold text-foreground"> 100,000 engineers </span>
              learn DevOps with real, hands-on experience.
            </p>
            <Button href="/about" variant="secondary" className="mt-8">Read our story</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
