"use client";

import React, { useCallback } from "react";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { id: "gold",    color: "#D9A441", label: "Gold" },
  { id: "emerald", color: "#10B981", label: "Emerald" },
  { id: "violet",  color: "#8B5CF6", label: "Violet" },
  { id: "rose",    color: "#F43F5E", label: "Rose" },
  { id: "cyan",    color: "#06B6D4", label: "Cyan" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

function getStoredAccent(): AccentId {
  if (typeof window === "undefined") return "gold";
  try {
    const stored = localStorage.getItem("portfolio-accent");
    if (stored && ACCENTS.some((a) => a.id === stored)) return stored as AccentId;
  } catch {}
  return "gold";
}

function setStoredAccent(accent: AccentId) {
  try {
    localStorage.setItem("portfolio-accent", accent);
  } catch {}
  document.documentElement.setAttribute("data-accent", accent);
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const accent = getStoredAccent();
    document.documentElement.setAttribute("data-accent", accent);
  }, []);

  return <>{children}</>;
}

export function useAccent() {
  const [accent, setAccent] = React.useState<AccentId>("gold");

  React.useEffect(() => {
    setAccent(getStoredAccent());
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute("data-accent") as AccentId | null;
      if (current && ACCENTS.some((a) => a.id === current)) setAccent(current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-accent"] });
    return () => observer.disconnect();
  }, []);

  const changeAccent = useCallback((id: AccentId) => {
    setStoredAccent(id);
    setAccent(id);
  }, []);

  return { accent, changeAccent, accents: ACCENTS };
}

interface AccentSwitcherProps {
  className?: string;
}

export default function AccentSwitcher({ className }: AccentSwitcherProps) {
  const { accent, changeAccent, accents } = useAccent();

  return (
    <div
      role="radiogroup"
      aria-label="Accent color"
      className={cn("flex items-center gap-1.5", className)}
    >
      {accents.map((a) => (
        <button
          key={a.id}
          role="radio"
          aria-checked={accent === a.id}
          aria-label={a.label}
          title={a.label}
          onClick={() => changeAccent(a.id)}
          className={cn(
            "w-5 h-5 rounded-full border-2 transition-all duration-200 outline-none",
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            accent === a.id
              ? "scale-110 border-white/60 shadow-[0_0_8px_var(--accent)]"
              : "border-white/20 opacity-50 hover:opacity-100 hover:scale-105"
          )}
          style={{ backgroundColor: a.color }}
        />
      ))}
    </div>
  );
}
