"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Track = {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  yearly: number; // per-month price when billed yearly
  color: string;
  features: string[];
  badge?: string;
};

// Placeholder pricing — edit freely. Prices are USD per month.
const tracks: Track[] = [
  {
    id: "01",
    name: "DevOps",
    tagline: "Every DevOps skill you need to learn.",
    monthly: 5.99,
    yearly: 2.49,
    color: "#00c853",
    features: ["Linux & networking", "Git & CI/CD", "Docker & containers", "All Playground games", "Daily tasks & XP"],
  },
  {
    id: "02",
    name: "Cloud",
    tagline: "DevOps plus the major cloud platforms.",
    monthly: 9.99,
    yearly: 3.49,
    color: "#f43f5e",
    features: ["Everything in DevOps", "AWS & Azure labs", "Infrastructure as Code", "FinOps basics", "Cost-detective scenarios"],
  },
  {
    id: "03",
    name: "Kubernetes",
    tagline: "From first pod to production clusters.",
    monthly: 9.99,
    yearly: 3.49,
    color: "#6366f1",
    features: ["Everything in DevOps", "Pods, Services, Deployments", "Helm & GitOps", "Troubleshooting scenarios", "Terminal challenges"],
  },
  {
    id: "04",
    name: "Pro",
    tagline: "Every skill on the platform, one pass.",
    monthly: 13.99,
    yearly: 4.99,
    color: "#eab308",
    badge: "All of it",
    features: ["Everything in DevOps, Cloud & Kubernetes", "Priority access to new labs", "Early access to new tracks", "Progress & achievements"],
  },
];

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
          return (
            <div
              key={t.id}
              className="card-surface flex flex-col rounded-2xl p-6"
              style={{ borderTop: `3px solid ${t.color}` }}
            >
              <p className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: t.color }}>
                Track {t.id}
                {t.badge ? ` · ${t.badge}` : ""}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{t.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t.tagline}</p>

              <div className="mt-5 flex items-baseline gap-2">
                {yearly && <span className="text-sm text-muted line-through">${t.monthly.toFixed(2)}</span>}
                <span className="text-4xl font-extrabold tracking-tight">${price.toFixed(2)}</span>
                <span className="text-sm text-muted">/mo</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {yearly ? `Billed $${(t.yearly * 12).toFixed(2)} for 12 months` : "Billed monthly, cancel anytime"}
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: t.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/playground"
                className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: t.color }}
              >
                Get started
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
