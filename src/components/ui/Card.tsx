import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`card-surface rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
