"use client";

import dynamic from "next/dynamic";

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

export default function ChatLoader() {
  return <Chat />;
}
