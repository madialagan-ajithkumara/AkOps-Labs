"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function XpToast() {
  const [toast, setToast] = useState<{ amount: number; id: number } | null>(null);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as { amount: number; source: string } | undefined;
      if (!detail || !detail.amount) return;
      setToast({ amount: detail.amount, id: Date.now() });
    }
    window.addEventListener("akops-progress-updated", handler);
    return () => window.removeEventListener("akops-progress-updated", handler);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-[fadeUp_0.3s_ease-out]"
    >
      <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-[#17b978] px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-accent/30">
        <Zap className="h-4 w-4 fill-white" />
        +{toast.amount} XP
      </div>
    </div>
  );
}
