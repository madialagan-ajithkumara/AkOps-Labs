"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Container from "@/components/ui/Container";
import { useAuth, type OAuthProvider } from "@/components/auth/AuthProvider";

const providers: { id: OAuthProvider; label: string; icon: string }[] = [
  { id: "google", label: "Continue with Google", icon: "G" },
  { id: "github", label: "Continue with GitHub", icon: "GH" },
  { id: "linkedin_oidc", label: "Continue with LinkedIn", icon: "in" },
];

function LoginInner() {
  const { user, configured, signIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  async function handle(p: OAuthProvider) {
    setError(null);
    const err = await signIn(p, next);
    if (err) setError(err);
  }

  return (
    <Container className="py-24">
      <div className="card-surface mx-auto max-w-md rounded-3xl p-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Sign in to AkOps Labs</h1>
        <p className="mt-2 text-sm text-muted">
          Free account: download projects, track your progress, and unlock your courses.
        </p>

        <div className="mt-8 space-y-3">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => handle(p.id)}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-tint text-[11px] font-bold">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {!configured && (
          <p className="mt-6 rounded-lg bg-tint px-3 py-2 text-xs text-muted">
            Login isn&apos;t configured on this deployment yet (Supabase keys missing).
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
