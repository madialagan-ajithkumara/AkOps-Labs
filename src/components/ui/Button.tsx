import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "dark" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent to-[#17b978] text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 hover:brightness-105",
  secondary:
    "bg-surface text-foreground border border-hairline hover:border-accent/50 hover:text-accent",
  dark: "bg-foreground text-white hover:opacity-90",
  ghost: "text-foreground hover:text-accent",
};

export default function Button({
  href,
  children,
  variant = "primary",
  external = false,
  showArrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  showArrow?: boolean;
  className?: string;
}) {
  const classes = `inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        {showArrow && <ArrowRight className="h-4 w-4" />}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {showArrow && <ArrowRight className="h-4 w-4" />}
    </Link>
  );
}
