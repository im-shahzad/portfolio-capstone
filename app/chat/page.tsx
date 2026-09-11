import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-[640px] sm:h-[700px] bg-[#1C1917] border border-[#2F2923] rounded-2xl shadow-2xl overflow-hidden font-body text-[#F2EDE4] animate-pulse">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#231F1B] border-b border-[#2F2923]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2E271F] border border-[#D9A441]/50" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 rounded bg-[#2E271F]" />
            <div className="h-2.5 w-24 rounded bg-[#2E271F]" />
          </div>
        </div>
      </header>
      <div className="flex-1 px-3 sm:px-6 py-4 space-y-3">
        <div className="h-10 w-3/4 rounded-xl bg-[#2A241E]" />
        <div className="h-10 w-1/2 rounded-xl bg-[#2A241E] ml-auto" />
        <div className="h-10 w-2/3 rounded-xl bg-[#2A241E]" />
      </div>
      <footer className="p-3 sm:p-4 bg-[#231F1B] border-t border-[#2F2923]">
        <div className="h-10 rounded-xl bg-[#191614] border border-[#383129]" />
      </footer>
    </div>
  ),
});

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A241E] border border-[#D9A441]/40 text-[#D9A441] text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Representative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-[#F2EDE4] tracking-tight">
          Ask My AI Assistant
        </h1>
        <p className="text-sm sm:text-base text-[#B3AAA0] leading-relaxed">
          Ask about my practical GenAI projects, technical approach, engineering principles, or how I turn LLM prototypes into production-ready software.
        </p>
      </div>

      {/* Main Chat Interface */}
      <Chat />
    </main>
  );
}
