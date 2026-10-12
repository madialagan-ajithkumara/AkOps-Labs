import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { courses } from "@/lib/courses";
import { Clock, PlayCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Video Courses — Kubernetes, AWS, CI/CD",
  description: "End-to-end DevOps video courses. Buy once, learn at your own pace.",
};

export default function CoursesPage() {
  return (
    <>
      <section className="border-b border-hairline py-20 text-center">
        <Container>
          <Badge>Video courses</Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            End-to-end DevOps courses, built for beginners.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Each course takes you from zero to a working project, step by step.
          </p>
        </Container>
      </section>
      <section className="py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link
                key={c.slug}
                href={`/courses/${c.slug}`}
                className="card-surface flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ borderTop: `3px solid ${c.color}` }}
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
                  <span style={{ color: c.color }}>{c.level}</span>
                  {c.status === "coming-soon" && <span className="rounded-full bg-tint px-2 py-0.5 text-muted">Coming soon</span>}
                </div>
                <h2 className="mt-3 text-xl font-extrabold tracking-tight">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted">{c.tagline}</p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted">
                    <Clock className="h-4 w-4" /> {c.hours}h video
                  </span>
                  <span className="font-extrabold">₹{c.priceInr}</span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: c.color }}>
                  <PlayCircle className="h-4 w-4" /> View course
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
