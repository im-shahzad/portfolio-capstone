"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Hero from "@/components/hero/Hero";
import Chat from "@/components/Chat";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";

type View = "hero" | "chat";

export default function PortfolioExperience() {
  const [view, setView] = useState<View>("hero");

  return (
    <AnimatePresence mode="wait">
      {view === "hero" ? (
        <motion.div
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Hero onLaunchChat={() => setView("chat")} />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-3 py-6"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setView("hero")}
            className="self-start"
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
          <ErrorBoundary>
            <Chat />
          </ErrorBoundary>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
