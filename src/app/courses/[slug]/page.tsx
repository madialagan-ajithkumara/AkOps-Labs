import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import BuyButton from "@/components/learn/BuyButton";
import { courses, getCourse } from "@/lib/courses";
import { ArrowLeft, Check, Clock, PlayCircle } from "lucide-react";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCourse(slug);
  return c ? { title: c.title, description: c.tagline } : {};
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCourse(slug);
  if (!c) notFound();

  return (
    <Container className="py-16">
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
        <ArrowLeft className="h-3.5 w-3.5" /> All courses
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: c.color }}>{c.level}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{c.title}</h1>
          <p className="mt-3 text-lg text-muted">{c.tagline}</p>

          <div className="mt-8 flex aspect-video items-center justify-center rounded-2xl border border-hairline bg-surface text-muted">
            <span className="flex items-center gap-2 text-sm"><PlayCircle className="h-5 w-5" /> Preview video coming soon</span>
          </div>

          <h2 className="mt-10 text-xl font-extrabold">What you&apos;ll learn</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {c.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: c.color }} /> {o}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-xl font-extrabold">Curriculum</h2>
          <div className="mt-4 space-y-4">
            {c.modules.map((m, i) => (
              <div key={m.title} className="card-surface rounded-2xl p-5">
                <p className="text-sm font-bold">Module {i + 1}: {m.title}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted">
                  {m.lessons.map((l) => (
                    <li key={l} className="flex items-center gap-2"><PlayCircle className="h-3.5 w-3.5" /> {l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface rounded-2xl p-6" style={{ borderTop: `3px solid ${c.color}` }}>
            <p className="text-4xl font-extrabold">₹{c.priceInr}</p>
            <p className="mt-1 text-xs text-muted">≈ ${c.priceUsd} · one-time payment, lifetime access</p>
            <div className="mt-5">
              <BuyButton
                label={c.status === "coming-soon" ? "Coming soon" : "Buy this course"}
                color={c.color}
                disabled={c.status === "coming-soon"}
              />
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted"><Clock className="h-4 w-4" /> {c.hours} hours of video</p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
