"use client";

import { ACCENTS, useAccent, type Accent } from "@/components/theme/accent-provider";
import { cn } from "@/lib/utils";

const ACCENT_SWATCH_COLOR: Record<Accent, string> = {
  amber: "#D9A441",
  emerald: "#10B981",
  violet: "#8B5CF6",
  cyan: "#22D3EE",
  red: "#EF4444",
};

export function AccentSwitcher() {
  const { accent, setAccent } = useAccent();

  return (
    <div role="group" aria-label="Accent color" className="flex items-center gap-1.5">
      {ACCENTS.map((option) => (
        <button
          key={option}
          type="button"
          aria-label={`${option} accent`}
          aria-pressed={accent === option}
          onClick={() => setAccent(option)}
          className={cn(
            "size-5 rounded-full border-2 transition-transform outline-none",
            "focus-visible:ring-3 focus-visible:ring-ring/50",
            accent === option
              ? "border-foreground scale-110"
              : "border-transparent hover:scale-105"
          )}
          style={{ backgroundColor: ACCENT_SWATCH_COLOR[option] }}
        />
      ))}
    </div>
  );
}
