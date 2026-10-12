"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { plans, discountPct, type PlanId } from "@/lib/tracks";
import { courses } from "@/lib/courses";
import { projects } from "@/lib/projects";

type Item = { text: string; soon?: boolean; bold?: boolean };

function itemsFor(id: PlanId): Item[] {
  const courseItems: Item[] = courses.map((c) => ({ text: c.title, soon: c.status === "coming-soon" }));
  const projectItems: Item[] = projects.map((p) => ({ text: p.title, soon: p.status === "coming-soon" }));
  if (id === "devops") {
    return [...courseItems, { text: "Hands-on Playground labs" }, { text: "Daily tasks & XP" }, { text: "Completion certificates" }];
  }
  if (id === "project") {
    return [...projectItems, { text: "Full source code, configs & guides" }, { text: "New projects added regularly" }];
  }
  return [
    { text: "Everything in DevOps (Plan 01)", bold: true },
    { text: "Everything in Project (Plan 02)", bold: true },
    { text: "Personal help from Ajith, ask anytime", bold: true },
    { text: "Career guidance & project reviews" },
    { text: "Complete platform access" },
  ];
}

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

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const price = yearly ? p.yearly : p.monthly;
          return (
            <div key={p.id} className="card-surface flex flex-col rounded-2xl p-6" style={{ borderTop: `3px solid ${p.color}` }}>
              <p className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: p.color }}>
                Plan {p.number}
                {p.id === "pro" ? " · All of it" : ""}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{p.name}</h3>
              {yearly && (
                <span className="mt-2 inline-block w-fit rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase" style={{ color: p.color, borderColor: `${p.color}66` }}>
                  {discountPct(p)}% off yearly
                </span>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.tagline}</p>

              <div className="mt-5 flex items-baseline gap-2">
                {yearly && <span className="text-sm text-muted line-through">${p.monthly.toFixed(2)}</span>}
                <span className="text-4xl font-extrabold tracking-tight">${price.toFixed(2)}</span>
                <span className="text-sm text-muted">/mo</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {yearly ? `Billed $${(p.yearly * 12).toFixed(2)} for 12 months` : "Billed monthly, cancel anytime"}
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {itemsFor(p.id).map((it) => (
                  <li key={it.text} className={`flex items-start gap-2.5 text-sm ${it.soon ? "text-muted" : "text-foreground"} ${it.bold ? "font-semibold" : ""}`}>
                    {it.soon ? (
                      <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: p.color }} />
                    )}
                    {it.text}
                    {it.soon ? " — coming soon" : ""}
                  </li>
                ))}
              </ul>

              <Link
                href="/login?next=/pricing"
                className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: p.color }}
              >
                Get {p.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
