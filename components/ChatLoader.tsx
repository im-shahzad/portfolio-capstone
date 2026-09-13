"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-[640px] sm:h-[700px] bg-bg border border-border rounded-2xl shadow-xl overflow-hidden font-body text-text animate-pulse">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-surface border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-alt border border-accent/50" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 rounded bg-surface-alt" />
            <div className="h-2.5 w-24 rounded bg-surface-alt" />
          </div>
        </div>
      </header>
      <div className="flex-1 px-3 sm:px-6 py-4 space-y-3">
        <div className="h-10 w-3/4 rounded-xl bg-surface-alt" />
        <div className="h-10 w-1/2 rounded-xl bg-surface-alt ml-auto" />
        <div className="h-10 w-2/3 rounded-xl bg-surface-alt" />
      </div>
      <footer className="p-3 sm:p-4 bg-surface border-t border-border">
        <div className="h-10 rounded-xl bg-surface-inset border border-border-subtle" />
      </footer>
    </div>
  ),
});

export default function ChatLoader() {
  return <Chat />;
}
