"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProgress } from "@/lib/progress";
import { BookOpen, Download, Gamepad2, Flame } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const progress = useProgress();

  if (loading) {
    return <Container className="py-32 text-center text-muted">Loading…</Container>;
  }
  if (!user) {
    return (
      <Container className="py-32 text-center">
        <h1 className="text-3xl font-extrabold">Sign in to see your dashboard</h1>
        <Link href="/login?next=/dashboard" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white">
          Sign in
        </Link>
      </Container>
    );
  }

  const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || user.email || "there";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <Container className="py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="h-14 w-14 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-lg font-bold text-accent">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {name}</h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <button onClick={signOut} className="rounded-full border border-hairline px-4 py-2 text-sm font-semibold hover:border-accent/50 hover:text-accent">
          Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <div className="card-surface rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Level</p>
          <p className="mt-2 text-xl font-extrabold">{progress.level} · {progress.title}</p>
          <div className="mt-3 h-2 rounded-full bg-tint">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${progress.progressPct}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">{progress.xp} XP</p>
        </div>
        <div className="card-surface rounded-2xl p-6">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted"><Flame className="h-3.5 w-3.5" /> Streak</p>
          <p className="mt-2 text-xl font-extrabold">{progress.streak} days</p>
          <Link href="/playground/tasks" className="mt-3 inline-block text-sm font-semibold text-accent">Do today&apos;s task →</Link>
        </div>
        <div className="card-surface rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">My courses</p>
          <p className="mt-2 text-sm text-muted">You haven&apos;t purchased a course yet.</p>
          <Link href="/courses" className="mt-3 inline-block text-sm font-semibold text-accent">Browse courses →</Link>
        </div>
      </div>

      <h2 className="mt-12 text-lg font-extrabold">Keep learning</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        {[
          { href: "/courses", icon: BookOpen, title: "Video courses", desc: "End-to-end Kubernetes, AWS, CI/CD." },
          { href: "/projects", icon: Download, title: "Projects", desc: "Download complete projects." },
          { href: "/playground", icon: Gamepad2, title: "Playground", desc: "Practice with DevOps challenges." },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="card-surface rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <x.icon className="h-5 w-5 text-accent" />
            <p className="mt-3 font-bold">{x.title}</p>
            <p className="mt-1 text-sm text-muted">{x.desc}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
