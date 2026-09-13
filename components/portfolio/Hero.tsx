"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import AccentSwitcher from "./AccentSwitcher";
import ThemeToggle from "./ThemeToggle";
import SocialLinks from "./SocialLinks";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface HeroProps {
  onEnterChat?: () => void;
}

export default function Hero({ onEnterChat }: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center min-h-[80vh] px-6",
        "overflow-hidden"
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
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        <ThemeToggle />
        <AccentSwitcher />
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        {/* Availability pill */}
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-muted border border-accent/30 text-accent text-xs font-semibold tracking-wide uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Open to AI Engineering Internships
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-text tracking-tight leading-[1.1]"
        >
          Shahzad
        </motion.h1>

        {/* Role */}
        <motion.p
          variants={fadeUp}
          className="mt-4 text-lg sm:text-xl text-text-muted font-body max-w-md"
        >
          AI Engineer building production-ready GenAI applications.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mt-10">
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
        </motion.div>

        {/* Social links */}
        <motion.div variants={fadeUp} className="mt-10">
          <SocialLinks />
        </motion.div>
      </motion.div>
    </section>
  );
}
