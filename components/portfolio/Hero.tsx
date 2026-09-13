import Link from "next/link";
import { cn } from "@/lib/utils";
import SocialLinks from "./SocialLinks";
import LazyAccentSwitcher from "./LazyAccentSwitcher";
import EnterChatButton from "./EnterChatButton";

// Server Component: no "use client" here. Everything below is static markup
// (the LCP heading/tagline, decorative gradients, links) that doesn't need
// to be part of the client JS bundle or React's hydration pass at all.
// The only interactive pieces — the accent switcher and the chat-entry
// button — are small client "islands" imported from their own files, per
// Next.js's recommended pattern for keeping Client Component boundaries as
// deep/narrow as possible. This shrinks how much of the tree React needs to
// reconcile during hydration (the biggest remaining TBT contributor once
// framer-motion was removed and there was no more unused JS to trim).

// Staggered reveal is done with plain CSS (.animate-fade-up + inline
// animation-delay) instead of Framer Motion.
const STAGGER_STEP_MS = 120;
const STAGGER_BASE_MS = 200;
const staggerDelay = (index: number) => `${STAGGER_BASE_MS + index * STAGGER_STEP_MS}ms`;

export default function Hero() {
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
        <LazyAccentSwitcher />
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
            LCP element, confirmed via PerformanceObserver. */}
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
          <EnterChatButton />

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
