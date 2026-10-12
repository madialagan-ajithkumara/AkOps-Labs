import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { plans } from "@/lib/tracks";
import { projects, getProject } from "@/lib/projects";
import { ArrowLeft, Check } from "lucide-react";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <Container className="py-16">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-accent">
        <ArrowLeft className="h-3.5 w-3.5" /> All projects
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: p.color }}>{p.level}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{p.title}</h1>
          <p className="mt-3 text-lg text-muted">{p.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {p.tools.map((t) => (
              <span key={t} className="rounded-full bg-tint px-3 py-1 text-xs font-semibold text-muted">{t}</span>
            ))}
          </div>
          <h2 className="mt-10 text-xl font-extrabold">What&apos;s included</h2>
          <ul className="mt-4 space-y-2.5">
            {p.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: p.color }} /> {d}
              </li>
            ))}
          </ul>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-surface rounded-2xl p-6" style={{ borderTop: `3px solid ${p.color}` }}>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Included in</p>
            <ul className="mt-2 space-y-1.5">
              {plans.filter((pl) => pl.id !== "devops").map((pl) => (
                <li key={pl.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{pl.name}</span>
                  <span className="text-muted">${pl.yearly.toFixed(2)}/mo</span>
                </li>
              ))}
            </ul>
            {/* TODO: once payments exist, show <DownloadButton /> here for active Project/Pro members. */}
            <Link
              href="/pricing"
              className="mt-5 block rounded-full px-6 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: p.color }}
            >
              {p.status === "coming-soon" ? "See plans (coming soon)" : "Get project access"}
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
