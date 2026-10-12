import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PricingTracks from "@/components/ui/PricingTracks";

export const metadata: Metadata = {
  title: "Pricing — AkOps Labs",
  description: "Pick your track: DevOps, Cloud, Kubernetes, or Pro. The first topic of every skill is free.",
};

const steps = [
  { tag: "Read", title: "Short written lessons", desc: "Clear, focused lessons you can finish in minutes." },
  { tag: "Do", title: "Hands-on practice", desc: "Terminal challenges and games that run in your browser." },
  { tag: "Check", title: "Instant feedback", desc: "Every task checks your work as you go." },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="hero-blobs">
          <div className="blob blob-mint" />
          <div className="blob blob-sky" />
        </div>
        <Container className="relative py-20">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Pick your track.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            You learn by doing: short lessons, then real practice in your browser.
          </p>

          <div className="mt-10 grid gap-6 rounded-2xl border border-hairline bg-surface p-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.tag}>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent">{s.tag}</p>
                <p className="mt-1 text-base font-bold">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-hairline px-6 py-4 text-sm">
            <span className="font-bold">The first topic of every skill is free.</span>{" "}
            <span className="text-muted">See exactly how a lesson and lab work before you pay. </span>
            <Link href="/playground" className="font-semibold text-accent underline underline-offset-4">
              Try one free →
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <PricingTracks />
          <p className="mt-8 text-center text-xs text-muted">USD. Prices shown are placeholders and may change before launch.</p>
        </Container>
      </section>
    </>
  );
}
