import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import ChatLoader from "@/components/ChatLoader";

export const metadata: Metadata = {
  title: "AI Chat Assistant | Portfolio",
  description:
    "Ask my streaming AI assistant about my background, AI engineering projects like the Meme Caption Generator, and approach to GenAI development.",
};

export default function ChatPage() {
  return (
    <main className="w-full max-w-4xl mx-auto py-8 sm:py-12 px-2 sm:px-4">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-alt border border-accent/40 text-accent text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Representative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-text tracking-tight">
          Ask My AI Assistant
        </h1>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          Ask about my practical GenAI projects, technical approach, engineering principles, or how I turn LLM prototypes into production-ready software.
        </p>
      </div>

      {/* Main Chat Interface */}
      <ChatLoader />
    </main>
  );
}
