import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { projects } from "@/lib/projects";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "End-to-End DevOps Projects",
  description: "Download complete DevOps projects with source code, configs and step-by-step guides.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="border-b border-hairline py-20 text-center">
        <Container>
          <Badge>Projects</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Real end-to-end projects you can download.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Full source, configs and a guide for each. Included in the Project and Pro plans, and great for your portfolio.
          </p>
        </Container>
      </section>
      <section className="py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="card-surface flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ borderTop: `3px solid ${p.color}` }}
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                  <span style={{ color: p.color }}>{p.level}</span>
                  {p.status === "coming-soon" && <span className="rounded-full bg-tint px-2 py-0.5 text-muted">Coming soon</span>}
                </div>
                <h2 className="mt-3 text-xl font-extrabold tracking-tight">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tools.map((t) => (
                    <span key={t} className="rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-muted">{t}</span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: p.color }}>
                  <Download className="h-4 w-4" /> View project
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
