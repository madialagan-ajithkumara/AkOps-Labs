"use client";

import { Download, LogIn } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DownloadButton({
  url,
  next,
  color,
  disabled,
}: {
  url?: string;
  next: string;
  color: string;
  disabled?: boolean;
}) {
  const { user, loading } = useAuth();
  const cls =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

  if (disabled) {
    return (
      <button disabled className={cls} style={{ background: color }}>
        Coming soon
      </button>
    );
  }
  if (loading) {
    return (
      <button disabled className={cls} style={{ background: color }}>
        Checking account…
      </button>
    );
  }
  if (!user) {
    return (
      <a href={`/login?next=${encodeURIComponent(next)}`} className={cls} style={{ background: color }}>
        <LogIn className="h-4 w-4" />
        Sign in to download (free)
      </a>
    );
  }
  if (!url) {
    return (
      <button disabled className={cls} style={{ background: color }}>
        Download link coming soon
      </button>
    );
  }
  return (
    <a href={url} className={cls} style={{ background: color }}>
      <Download className="h-4 w-4" />
      Download project
    </a>
  );
}
