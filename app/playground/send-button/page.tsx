"use client";

import React, { useRef, useState } from "react";
import SendButton from "@/components/SendButton";

type ForceOutcome = "none" | "success" | "error";

export default function SendButtonDemoPage() {
  const [forceOutcome, setForceOutcome] = useState<ForceOutcome>("none");
  const [lastOutcome, setLastOutcome] = useState<string>("—");
  const [callCount, setCallCount] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [liveState, setLiveState] = useState("idle");

  const updateLiveState = () => {
    const btn = buttonRef.current?.querySelector("[data-state]");
    if (btn) {
      setLiveState(btn.getAttribute("data-state") || "idle");
    }
  };

  const fakeAsyncCall = async (): Promise<void> => {
    const delay = 500 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    let shouldFail: boolean;

    if (forceOutcome === "success") {
      shouldFail = false;
    } else if (forceOutcome === "error") {
      shouldFail = true;
    } else {
      shouldFail = Math.random() < 0.2;
    }

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
    <div className="min-h-screen bg-bg text-text px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* ── Header ── */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight">
            Send Button Demo
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-lg mx-auto">
            Five-state motion choreography: <strong className="text-accent">idle → hover/focus → loading → success/error → idle</strong>.
            All motion uses <code className="text-xs bg-surface-alt px-1.5 py-0.5 rounded border border-border-subtle text-accent">transform</code> and <code className="text-xs bg-surface-alt px-1.5 py-0.5 rounded border border-border-subtle text-accent">opacity</code> only (compositor-friendly, no layout thrash).
          </p>
        </div>

        {/* ── Interactive Demo ── */}
        <section className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-semibold font-heading text-text">
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
                <span className="text-xs text-text-dim uppercase tracking-wider font-semibold">State:</span>
                <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${
                  liveState === "loading" ? "bg-amber-900/40 text-amber-300 border border-amber-700/50" :
                  liveState === "success" ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50" :
                  liveState === "error" ? "bg-rose-900/40 text-rose-300 border border-rose-700/50" :
                  "bg-surface-alt text-accent border border-border-subtle"
                }`}>
                  {liveState}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-dim">
                <span>Last: <span className="text-text-muted">{lastOutcome}</span></span>
                <span>Calls: <span className="text-text-muted">{callCount}</span></span>
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
                  : "bg-surface-alt border-border-subtle text-emerald-400 hover:bg-emerald-900/30 hover:border-emerald-700/50"
              }`}
            >
              {forceOutcome === "success" ? "✓ Next call → Success" : "Force Success"}
            </button>
            <button
              onClick={() => setForceOutcome("error")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
                forceOutcome === "error"
                  ? "bg-rose-600 border-rose-500 text-white shadow-md"
                  : "bg-surface-alt border-border-subtle text-rose-400 hover:bg-rose-900/30 hover:border-rose-700/50"
              }`}
            >
              {forceOutcome === "error" ? "✓ Next call → Error" : "Force Error"}
            </button>
            <button
              onClick={() => setForceOutcome("none")}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-surface-alt border border-border-subtle text-text-muted hover:bg-surface-hover transition-all"
            >
              Reset (20% random failure)
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-bg rounded-xl p-4 border border-border space-y-2 text-xs sm:text-sm text-text-muted">
            <p className="font-semibold text-accent">How to test all five states:</p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1">
              <li><strong className="text-text">Idle →</strong> The button&apos;s default state (gold, Send icon).</li>
              <li><strong className="text-text">Hover/Focus →</strong> Hover the button (lifts up + glow) or <kbd className="px-1 py-0.5 rounded bg-surface-alt border border-border-subtle text-[10px] font-mono text-accent">Tab</kbd> to it (visible focus ring).</li>
              <li><strong className="text-text">Loading →</strong> Click the button. The Send icon crossfades to a spinner (500-1500ms random delay).</li>
              <li><strong className="text-text">Success →</strong> Click &ldquo;Force Success&rdquo; first, then click Send. Spinner crossfades to a green checkmark, then auto-returns to idle.</li>
              <li><strong className="text-text">Error →</strong> Click &ldquo;Force Error&rdquo; first, then click Send. Button shakes, turns red, shows retry icon. Click again to retry.</li>
            </ol>
            <p className="text-text-dim pt-1">
              <strong>Reduced motion:</strong> Open DevTools → Rendering → &ldquo;Emulate CSS media: prefers-reduced-motion: reduce&rdquo;. The shake disappears but the color/label change persists.
            </p>
          </div>
        </section>

        {/* ── Design Notes ── */}
        <section className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-lg font-semibold font-heading text-text">
            Duration &amp; Easing Rationale
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-bg rounded-xl p-4 border border-border">
                <p className="font-semibold text-accent mb-1">Hover lift — 150ms ease-out</p>
                <p>Fast enough to feel instant, but <code className="text-[10px] bg-surface-alt px-1 py-0.5 rounded text-accent">ease-out</code> decelerates naturally so it doesn&apos;t pop. The 2px <code className="text-[10px] bg-surface-alt px-1 py-0.5 rounded text-accent">translateY</code> is subtle — users feel it more than see it.</p>
              </div>

              <div className="bg-bg rounded-xl p-4 border border-border">
                <p className="font-semibold text-accent mb-1">Icon crossfade — 200ms ease-in-out</p>
                <p>The sweet spot between &ldquo;feels snappy&rdquo; and &ldquo;not a hard cut&rdquo;. Below 150ms it looks like a toggle; above 300ms it feels sluggish for a frequently-used control.</p>
              </div>

              <div className="bg-bg rounded-xl p-4 border border-border">
                <p className="font-semibold text-accent mb-1">Success hold — 250ms + crossfade</p>
                <p>Long enough for users to register the checkmark (research: ~200ms for icon recognition), short enough not to block the next message. Total success phase: ~600ms.</p>
              </div>

              <div className="bg-bg rounded-xl p-4 border border-border">
                <p className="font-semibold text-accent mb-1">Error shake — 300ms ease-in-out</p>
                <p>A single back-and-forth rattle. Longer shakes feel like an earthquake (and annoy users); shorter ones are imperceptible. Uses only <code className="text-[10px] bg-surface-alt px-1 py-0.5 rounded text-accent">translateX</code> — compositor-only, zero layout recalc.</p>
              </div>
            </div>

            <div className="bg-bg rounded-xl p-4 border border-border">
              <p className="font-semibold text-accent mb-1">Why transform + opacity only?</p>
              <p>Animating <code className="text-[10px] bg-surface-alt px-1 py-0.5 rounded text-accent">width</code>, <code className="text-[10px] bg-surface-alt px-1 py-0.5 rounded text-accent">height</code>, or <code className="text-[10px] bg-surface-alt px-1 py-0.5 rounded text-accent">margin</code> triggers layout recalculation, which forces the browser to reflow surrounding elements on every frame. <code className="text-[10px] bg-surface-alt px-1 py-0.5 rounded text-accent">transform</code> and <code className="text-[10px] bg-surface-alt px-1 py-0.5 rounded text-accent">opacity</code> are handled entirely by the GPU compositor thread — zero main-thread work, guaranteed 60fps even on low-end devices.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
