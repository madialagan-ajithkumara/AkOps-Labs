"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

// UI only for now — payments will be wired in later.
export default function BuyButton({ label, color, disabled }: { label: string; color: string; disabled?: boolean }) {
  const [clicked, setClicked] = useState(false);
  return (
    <div>
      <button
        disabled={disabled}
        onClick={() => setClicked(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ background: color }}
      >
        <ShoppingCart className="h-4 w-4" />
        {label}
      </button>
      {clicked && (
        <p className="mt-3 rounded-lg bg-tint px-3 py-2 text-xs text-muted">
          Checkout is launching soon. Create a free account and you&apos;ll be first to know.
        </p>
      )}
    </div>
  );
}
