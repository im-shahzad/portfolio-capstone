"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SocialLinks from "./SocialLinks";

// Decorative, non-critical widget (small top-right accent-color switcher).
// Lazy-loaded so its JS (useSyncExternalStore + MutationObserver wiring)
// doesn't compete with the critical hero content during initial hydration.
const AccentSwitcher = dynamic(() => import("./AccentSwitcher"), {
  ssr: false,
  loading: () => <div className="w-[104px] h-4 sm:w-[124px] sm:h-5" aria-hidden="true" />,
});

// Staggered reveal is done with plain CSS (.animate-fade-up + inline
// animation-delay) instead of Framer Motion. Lighthouse showed 4.5s of TBT
// driven by main-thread JS execution under CPU throttling; framer-motion
// was only ever used on this route (Hero + PortfolioExperience), so cutting
// it removes ~126KB of parse/execute cost from the critical path entirely
// rather than just reordering when it runs.
const STAGGER_STEP_MS = 120;
const STAGGER_BASE_MS = 200;
const staggerDelay = (index: number) => `${STAGGER_BASE_MS + index * STAGGER_STEP_MS}ms`;

interface HeroProps {
  onEnterChat?: () => void;
}

export default function Hero({ onEnterChat }: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6"
      )}
    >
      {/* ── Ambient dot-grid background ─────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-accent) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          opacity: 0.08,
        }}
      />

      {/* ── Accent glow ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, var(--color-accent-muted), transparent 70%)",
        }}
      />

      {/* ── Top-right: theme + accent switcher ───────────────────── */}
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10">
        <AccentSwitcher />
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl pt-16 sm:pt-0">
        {/* Availability pill */}
        <div className="animate-fade-up" style={{ animationDelay: staggerDelay(0) }}>
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-accent-muted border border-accent/30 text-accent text-[10px] sm:text-xs font-semibold tracking-wide uppercase mb-6 sm:mb-8 text-center max-w-[260px] sm:max-w-none">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Open to AI Engineering Internships
          </span>
        </div>

        {/* Name — rendered plain (not animated): this is the page's
            LCP element, confirmed via PerformanceObserver. Wrapping it in
            Framer Motion's fadeUp (opacity: 0 -> 1) delayed its painted
            LCP timestamp by ~1.2s, since LCP only counts once JS hydrates
            and drives the animation to opacity: 1. */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-text tracking-tight leading-[1.1]">
          Shahzad
        </h1>

        {/* Role — same reasoning; this paragraph was the actual measured
            LCP element (larger paint area than the heading). */}
        <p className="mt-4 text-lg sm:text-xl text-text-muted font-body max-w-md">
          AI Engineer building production-ready GenAI applications.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-10 animate-fade-up" style={{ animationDelay: staggerDelay(1) }}>
          <button
            onClick={onEnterChat}
            className={cn(
              "group inline-flex items-center gap-2 px-6 py-3 rounded-xl",
              "bg-accent text-accent-fg font-semibold",
              "hover:brightness-110 active:scale-[0.98]",
              "transition-all duration-200 outline-none",
              "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Chat with my AI
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <Link
            href="/work"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
              "border border-border-subtle bg-surface text-text font-semibold",
              "hover:bg-surface-hover hover:border-accent/40 hover:text-accent",
              "transition-all duration-200 outline-none",
              "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
          >
            View work
          </Link>
        </div>

        {/* Social links */}
        <div className="mt-10 animate-fade-up" style={{ animationDelay: staggerDelay(2) }}>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
