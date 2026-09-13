"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEnterChat } from "./ViewContext";

export default function EnterChatButton() {
  const enterChat = useEnterChat();

  return (
    <button
      onClick={enterChat}
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
  );
}
