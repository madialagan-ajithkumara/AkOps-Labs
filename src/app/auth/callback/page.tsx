"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    const next = params.get("next") || "/dashboard";
    const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
    if (!supabase) {
      setError("Login isn't configured.");
      return;
    }
    const code = params.get("code");
    (async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setError(error.message);
          return;
        }
      }
      router.replace(safeNext);
    })();
  }, [params, router]);

  return (
    <div className="mx-auto max-w-md px-6 py-32 text-center">
      {error ? (
        <>
          <p className="font-semibold text-red-500">Sign-in failed</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
          <a href="/login" className="mt-4 inline-block text-sm font-semibold text-accent">Back to login</a>
        </>
      ) : (
        <p className="text-muted">Signing you in…</p>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
