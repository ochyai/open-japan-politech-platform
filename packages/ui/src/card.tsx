import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddingClass = { sm: "p-4", md: "p-6", lg: "p-8" }[padding];
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}
