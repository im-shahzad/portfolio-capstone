"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const ACCENTS = ["amber", "emerald", "violet", "cyan", "red"] as const;
export type Accent = (typeof ACCENTS)[number];

const STORAGE_KEY = "portfolio-accent";
const DEFAULT_ACCENT: Accent = "amber";

interface AccentContextValue {
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const AccentContext = createContext<AccentContextValue | null>(null);

export function AccentProvider({
  children,
  defaultAccent = DEFAULT_ACCENT,
}: {
  children: ReactNode;
  defaultAccent?: Accent;
}) {
  const [accent, setAccentState] = useState<Accent>(defaultAccent);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Accent | null;
      if (stored && (ACCENTS as readonly string[]).includes(stored)) {
        setAccentState(stored);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — keep default
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  const setAccent = (next: Accent) => {
    setAccentState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures
    }
  };

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) {
    throw new Error("useAccent must be used within AccentProvider");
  }
  return ctx;
}
