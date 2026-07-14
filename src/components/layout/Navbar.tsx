"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import { mainNav, siteConfig } from "@/lib/site-config";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white">
            A
          </span>
          AkOps <span className="text-accent">Labs</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            Get in touch
          </Link>
          <a
            href={siteConfig.resumeAiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-[#17b978] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-all hover:shadow-lg hover:shadow-accent/35"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Try Resume AI
          </a>
        </div>

        <button
          className="text-foreground lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-black/5 bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-black/[0.03] hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={siteConfig.resumeAiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-lg bg-gradient-to-r from-accent to-[#17b978] px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Try Resume AI ↗
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
