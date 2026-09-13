"use client";

import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatLoader from "@/components/ChatLoader";
import { EnterChatContext } from "./ViewContext";

type View = "hero" | "chat";

interface PortfolioExperienceProps {
  // Server-rendered Hero, passed down from app/page.tsx (a Server
  // Component) rather than imported here — Hero has no client JS of its
  // own, so slotting it in as children means React only needs to hydrate
  // this thin shell + the small EnterChatButton/AccentSwitcher islands
  // inside it, not the whole hero subtree.
  children: React.ReactNode;
}

export default function PortfolioExperience({ children }: PortfolioExperienceProps) {
  const [view, setView] = useState<View>("hero");

  // Skip the enter animation on the very first paint (page load) so the
  // hero's LCP text isn't gated behind a CSS opacity transition — later
  // hero/chat switches (user-triggered, post-mount) still get the fade.
  const [animate, setAnimate] = useState(false);
  const transitionClass = animate ? "animate-view-fade-in" : "";

  const enterChat = useCallback(() => {
    setAnimate(true);
    setView("chat");
  }, []);
  const backToHero = useCallback(() => {
    setAnimate(true);
    setView("hero");
  }, []);

  return (
    <div className="relative w-full min-h-[calc(100vh-8rem)] overflow-hidden">
      {view === "hero" ? (
        <div key="hero" className={transitionClass}>
          <EnterChatContext.Provider value={enterChat}>{children}</EnterChatContext.Provider>
        </div>
      ) : (
        <div
          key="chat"
          className={cn("w-full max-w-4xl mx-auto px-2 sm:px-4 py-8", transitionClass)}
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
        </div>
      )}
    </div>
  );
}
