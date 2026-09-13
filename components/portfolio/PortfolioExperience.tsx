"use client";

import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Hero from "./Hero";
import ChatLoader from "@/components/ChatLoader";

type View = "hero" | "chat";

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit:    { opacity: 0, scale: 1.02, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function PortfolioExperience() {
  const [view, setView] = useState<View>("hero");

  const enterChat = useCallback(() => setView("chat"), []);
  const backToHero = useCallback(() => setView("hero"), []);

  return (
    <div className="relative w-full min-h-[calc(100vh-8rem)]">
      <AnimatePresence mode="wait">
        {view === "hero" ? (
          <motion.div
            key="hero"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Hero onEnterChat={enterChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-8"
          >
            {/* Back button */}
            <button
              onClick={backToHero}
              className={cn(
                "inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl",
                "text-sm text-text-muted hover:text-accent",
                "border border-border-subtle bg-surface hover:bg-surface-hover",
                "transition-all duration-200 outline-none",
                "focus-visible:ring-2 focus-visible:ring-accent"
              )}
              aria-label="Back to portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
              Portfolio
            </button>

            <ChatLoader />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
