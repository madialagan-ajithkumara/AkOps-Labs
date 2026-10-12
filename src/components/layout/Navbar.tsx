"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import Container from "@/components/ui/Container";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { mainNav } from "@/lib/site-config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const avatar = user?.user_metadata?.avatar_url as string | undefined;
  const initial = ((user?.user_metadata?.full_name as string) || user?.email || "U").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-md">
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
          <ThemeToggle />
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40 hover:text-accent"
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">{initial}</span>
                )}
                Dashboard
              </Link>
              <button onClick={signOut} aria-label="Sign out" className="text-muted hover:text-foreground">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-accent to-[#17b978] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-all hover:shadow-lg hover:shadow-accent/35"
            >
              Sign in
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button className="text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-hairline bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-tint hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {!loading && user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button onClick={() => { setOpen(false); signOut(); }} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-muted">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-gradient-to-r from-accent to-[#17b978] px-3 py-2.5 text-center text-sm font-semibold text-white">
                Sign in
              </Link>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
