"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { tracks, ownCourses, discountPct } from "@/lib/tracks";

export default function PricingTracks() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      <div className="inline-flex rounded-xl border border-hairline bg-surface p-1">
        {[true, false].map((isYearly) => (
          <button
            key={String(isYearly)}
            onClick={() => setYearly(isYearly)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
              yearly === isYearly ? "bg-tint text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {isYearly ? "Yearly" : "Monthly"}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tracks.map((t) => {
          const price = yearly ? t.yearly : t.monthly;
          const courseList = ownCourses(t.id).filter((c) => c.status === "available");
          const head = t.extras.filter((f) => f.startsWith("Everything"));
          const tail = t.extras.filter((f) => !f.startsWith("Everything"));
          const soonCourses = ownCourses(t.id).filter((c) => c.status === "coming-soon").map((c) => c.title);
          return (
            <div key={t.id} className="card-surface flex flex-col rounded-2xl p-6" style={{ borderTop: `3px solid ${t.color}` }}>
              <p className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: t.color }}>
                Track {t.number}
                {t.id === "pro" ? " · All of it" : ""}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{t.name}</h3>
              {yearly && (
                <span className="mt-2 inline-block w-fit rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase" style={{ color: t.color, borderColor: `${t.color}66` }}>
                  {discountPct(t)}% off yearly
                </span>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.tagline}</p>

              <div className="mt-5 flex items-baseline gap-2">
                {yearly && <span className="text-sm text-muted line-through">${t.monthly.toFixed(2)}</span>}
                <span className="text-4xl font-extrabold tracking-tight">${price.toFixed(2)}</span>
                <span className="text-sm text-muted">/mo</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {yearly ? `Billed $${(t.yearly * 12).toFixed(2)} for 12 months` : "Billed monthly, cancel anytime"}
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {head.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: t.color }} /> {f}
                  </li>
                ))}
                {courseList.map((c) => (
                  <li key={c.slug} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: t.color }} /> {c.title}
                  </li>
                ))}
                {[...soonCourses, ...t.comingSoon].map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-muted">
                    <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" /> {c} — coming soon
                  </li>
                ))}
                {tail.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: t.color }} /> {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/login?next=/pricing`}
                className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: t.color }}
              >
                Get {t.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
