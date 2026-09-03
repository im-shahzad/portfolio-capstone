"use client";

import React, { useRef, useState } from "react";
import SendButton from "@/components/SendButton";

/**
 * Demo page for the Send button's five-state motion choreography.
 *
 * Features:
 *   - A SendButton wired to a fake async call (500-1500ms random delay, 20% failure rate)
 *   - "Force Success" and "Force Error" trigger buttons so reviewers can see both states on demand
 *   - Live state readout via data-state attribute observation
 *   - Design notes explaining duration/easing choices
 */

type ForceOutcome = "none" | "success" | "error";

export default function SendButtonDemoPage() {
  const [forceOutcome, setForceOutcome] = useState<ForceOutcome>("none");
  const [lastOutcome, setLastOutcome] = useState<string>("—");
  const [callCount, setCallCount] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Observe the data-state attribute on the button to display live state
  const [liveState, setLiveState] = useState("idle");

  // Poll data-state via a ref callback (lightweight, no MutationObserver needed for a demo)
  const updateLiveState = () => {
    const btn = buttonRef.current?.querySelector("[data-state]");
    if (btn) {
      setLiveState(btn.getAttribute("data-state") || "idle");
    }
  };

  const fakeAsyncCall = async (): Promise<void> => {
    const delay = 500 + Math.random() * 1000; // 500-1500ms
    await new Promise((resolve) => setTimeout(resolve, delay));

    let shouldFail: boolean;

    if (forceOutcome === "success") {
      shouldFail = false;
    } else if (forceOutcome === "error") {
      shouldFail = true;
    } else {
      // 20% random failure rate
      shouldFail = Math.random() < 0.2;
    }

    // Reset force after use (one-shot)
    setForceOutcome("none");
    setCallCount((c) => c + 1);

    if (shouldFail) {
      setLastOutcome("❌ Error");
      throw new Error("Simulated failure");
    } else {
      setLastOutcome("✅ Success");
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1917] text-[#F2EDE4] px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* ── Header ── */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight">
            Send Button Demo
          </h1>
          <p className="text-sm sm:text-base text-[#B3AAA0] leading-relaxed max-w-lg mx-auto">
            Five-state motion choreography: <strong className="text-[#D9A441]">idle → hover/focus → loading → success/error → idle</strong>.
            All motion uses <code className="text-xs bg-[#2A241E] px-1.5 py-0.5 rounded border border-[#3C342A] text-[#D9A441]">transform</code> and <code className="text-xs bg-[#2A241E] px-1.5 py-0.5 rounded border border-[#3C342A] text-[#D9A441]">opacity</code> only (compositor-friendly, no layout thrash).
          </p>
        </div>

        {/* ── Interactive Demo ── */}
        <section className="bg-[#231F1B] border border-[#2F2923] rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold font-heading text-[#F2EDE4]">
            Interactive Test
          </h2>

          {/* Button + State Display */}
          <div className="flex items-center gap-6" ref={buttonRef}>
            <div
              onMouseEnter={updateLiveState}
              onClick={() => setTimeout(updateLiveState, 50)}
              onMouseLeave={updateLiveState}
            >
              <SendButton
                disabled={false}
                onSend={async () => {
                  setTimeout(updateLiveState, 50);
                  try {
                    await fakeAsyncCall();
                  } finally {
                    setTimeout(updateLiveState, 50);
                    setTimeout(updateLiveState, 700);
                  }
                }}
              />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8A8175] uppercase tracking-wider font-semibold">State:</span>
                <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                  liveState === "loading" ? "bg-amber-900/40 text-amber-300 border border-amber-700/50" :
                  liveState === "success" ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50" :
                  liveState === "error" ? "bg-rose-900/40 text-rose-300 border border-rose-700/50" :
                  "bg-[#2A241E] text-[#D9A441] border border-[#3C342A]"
                }`}>
                  {liveState}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#8A8175]">
                <span>Last: <span className="text-[#B3AAA0]">{lastOutcome}</span></span>
                <span>Calls: <span className="text-[#B3AAA0]">{callCount}</span></span>
              </div>
            </div>
          </div>

          {/* Force Trigger Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setForceOutcome("success")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
                forceOutcome === "success"
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-md"
                  : "bg-[#2A241E] border-[#3C342A] text-emerald-400 hover:bg-emerald-900/30 hover:border-emerald-700/50"
              }`}
            >
              {forceOutcome === "success" ? "✓ Next call → Success" : "Force Success"}
            </button>
            <button
              onClick={() => setForceOutcome("error")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
                forceOutcome === "error"
                  ? "bg-rose-600 border-rose-500 text-white shadow-md"
                  : "bg-[#2A241E] border-[#3C342A] text-rose-400 hover:bg-rose-900/30 hover:border-rose-700/50"
              }`}
            >
              {forceOutcome === "error" ? "✓ Next call → Error" : "Force Error"}
            </button>
            <button
              onClick={() => setForceOutcome("none")}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#2A241E] border border-[#3C342A] text-[#B3AAA0] hover:bg-[#352E26] transition-all"
            >
              Reset (20% random failure)
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-[#1C1917] rounded-xl p-4 border border-[#2F2923] space-y-2 text-xs sm:text-sm text-[#A89F93]">
            <p className="font-semibold text-[#D9A441]">How to test all five states:</p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1">
              <li><strong className="text-[#F2EDE4]">Idle →</strong> The button&apos;s default state (gold, Send icon).</li>
              <li><strong className="text-[#F2EDE4]">Hover/Focus →</strong> Hover the button (lifts up + glow) or <kbd className="px-1 py-0.5 rounded bg-[#2A241E] border border-[#3C342A] text-[10px] font-mono text-[#D9A441]">Tab</kbd> to it (visible focus ring).</li>
              <li><strong className="text-[#F2EDE4]">Loading →</strong> Click the button. The Send icon crossfades to a spinner (500-1500ms random delay).</li>
              <li><strong className="text-[#F2EDE4]">Success →</strong> Click &ldquo;Force Success&rdquo; first, then click Send. Spinner crossfades to a green checkmark, then auto-returns to idle.</li>
              <li><strong className="text-[#F2EDE4]">Error →</strong> Click &ldquo;Force Error&rdquo; first, then click Send. Button shakes, turns red, shows retry icon. Click again to retry.</li>
            </ol>
            <p className="text-[#8A8175] pt-1">
              <strong>Reduced motion:</strong> Open DevTools → Rendering → &ldquo;Emulate CSS media: prefers-reduced-motion: reduce&rdquo;. The shake disappears but the color/label change persists.
            </p>
          </div>
        </section>

        {/* ── Design Notes ── */}
        <section className="bg-[#231F1B] border border-[#2F2923] rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-lg font-semibold font-heading text-[#F2EDE4]">
            Duration &amp; Easing Rationale
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#A89F93] leading-relaxed">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-[#1C1917] rounded-xl p-4 border border-[#2F2923]">
                <p className="font-semibold text-[#D9A441] mb-1">Hover lift — 150ms ease-out</p>
                <p>Fast enough to feel instant, but <code className="text-[10px] bg-[#2A241E] px-1 py-0.5 rounded text-[#D9A441]">ease-out</code> decelerates naturally so it doesn&apos;t pop. The 2px <code className="text-[10px] bg-[#2A241E] px-1 py-0.5 rounded text-[#D9A441]">translateY</code> is subtle — users feel it more than see it.</p>
              </div>

              <div className="bg-[#1C1917] rounded-xl p-4 border border-[#2F2923]">
                <p className="font-semibold text-[#D9A441] mb-1">Icon crossfade — 200ms ease-in-out</p>
                <p>The sweet spot between &ldquo;feels snappy&rdquo; and &ldquo;not a hard cut&rdquo;. Below 150ms it looks like a toggle; above 300ms it feels sluggish for a frequently-used control.</p>
              </div>

              <div className="bg-[#1C1917] rounded-xl p-4 border border-[#2F2923]">
                <p className="font-semibold text-[#D9A441] mb-1">Success hold — 250ms + crossfade</p>
                <p>Long enough for users to register the checkmark (research: ~200ms for icon recognition), short enough not to block the next message. Total success phase: ~600ms.</p>
              </div>

              <div className="bg-[#1C1917] rounded-xl p-4 border border-[#2F2923]">
                <p className="font-semibold text-[#D9A441] mb-1">Error shake — 300ms ease-in-out</p>
                <p>A single back-and-forth rattle. Longer shakes feel like an earthquake (and annoy users); shorter ones are imperceptible. Uses only <code className="text-[10px] bg-[#2A241E] px-1 py-0.5 rounded text-[#D9A441]">translateX</code> — compositor-only, zero layout recalc.</p>
              </div>
            </div>

            <div className="bg-[#1C1917] rounded-xl p-4 border border-[#2F2923]">
              <p className="font-semibold text-[#D9A441] mb-1">Why transform + opacity only?</p>
              <p>Animating <code className="text-[10px] bg-[#2A241E] px-1 py-0.5 rounded text-[#D9A441]">width</code>, <code className="text-[10px] bg-[#2A241E] px-1 py-0.5 rounded text-[#D9A441]">height</code>, or <code className="text-[10px] bg-[#2A241E] px-1 py-0.5 rounded text-[#D9A441]">margin</code> triggers layout recalculation, which forces the browser to reflow surrounding elements on every frame. <code className="text-[10px] bg-[#2A241E] px-1 py-0.5 rounded text-[#D9A441]">transform</code> and <code className="text-[10px] bg-[#2A241E] px-1 py-0.5 rounded text-[#D9A441]">opacity</code> are handled entirely by the GPU compositor thread — zero main-thread work, guaranteed 60fps even on low-end devices.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
