"use client";

import React, { useReducer, useRef, useCallback, useEffect } from "react";
import { Send, Check, Loader2, RotateCcw } from "lucide-react";

// ─── State Machine ─────────────────────────────────────────────────────────
// States: idle | loading | success | error
// (hover/focus are CSS-only — no JS state needed for those transitions)

type ButtonState = "idle" | "loading" | "success" | "error";

type Action =
  | { type: "SEND" }
  | { type: "RESOLVE_SUCCESS" }
  | { type: "RESOLVE_ERROR" }
  | { type: "RETURN_TO_IDLE" }
  | { type: "RETRY" };

function reducer(state: ButtonState, action: Action): ButtonState {
  switch (action.type) {
    case "SEND":
      // Only transition from idle or error (retry)
      if (state === "idle" || state === "error") return "loading";
      return state;
    case "RESOLVE_SUCCESS":
      if (state === "loading") return "success";
      return state;
    case "RESOLVE_ERROR":
      if (state === "loading") return "error";
      return state;
    case "RETURN_TO_IDLE":
      if (state === "success" || state === "error") return "idle";
      return state;
    case "RETRY":
      if (state === "error") return "loading";
      return state;
    default:
      return state;
  }
}

// ─── Props ──────────────────────────────────────────────────────────────────

export interface SendButtonProps {
  /**
   * Async callback fired when the button is clicked.
   * Must resolve on success or reject on error.
   */
  onSend: () => Promise<void>;
  /** External disabled (e.g. empty input, conversation cap) */
  disabled?: boolean;
  /** Optional className to merge */
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SendButton({
  onSend,
  disabled = false,
  className = "",
}: SendButtonProps) {
  const [state, dispatch] = useReducer(reducer, "idle");
  const isMountedRef = useRef(true);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track mount status to avoid dispatching after unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const handleClick = useCallback(async () => {
    // Guard: only fire from idle or error
    if (state !== "idle" && state !== "error") return;
    if (disabled) return;

    dispatch({ type: state === "error" ? "RETRY" : "SEND" });

    try {
      await onSend();
      if (!isMountedRef.current) return;
      dispatch({ type: "RESOLVE_SUCCESS" });

      // Auto-return to idle after the success hold
      successTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          dispatch({ type: "RETURN_TO_IDLE" });
        }
      }, 600); // 200ms crossfade-in + 250ms hold + 150ms crossfade-out
    } catch {
      if (!isMountedRef.current) return;
      dispatch({ type: "RESOLVE_ERROR" });
    }
  }, [state, disabled, onSend]);

  // ── Derived visuals ────────────────────────────────────────────────────

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";
  const isDisabledVisual = disabled || isLoading || isSuccess;

  // Background color per state
  const bgColor = isError
    ? "bg-rose-600"
    : isSuccess
      ? "bg-emerald-500"
      : "bg-accent";

  // Text/icon color per state
  const fgColor = isError || isSuccess ? "text-white" : "text-bg";

  // Shake class — only on error, CSS handles prefers-reduced-motion
  const shakeClass = isError ? "send-btn-shake" : "";

  return (
    <button
      type={state === "error" ? "button" : "submit"}
      disabled={isDisabledVisual}
      aria-disabled={isDisabledVisual}
      aria-label={
        isLoading
          ? "Sending message…"
          : isSuccess
            ? "Message sent"
            : isError
              ? "Send failed — click to retry"
              : "Send message"
      }
      data-testid="send-button"
      data-state={state}
      onClick={(e) => {
        // For error/retry, prevent form submit
        if (state === "error") {
          e.preventDefault();
        }
        handleClick();
      }}
      className={[
        // Base styles — fixed dimensions, no layout-shifting properties animated
        "relative flex items-center justify-center w-10 h-10 rounded-lg",
        "font-bold min-h-[40px] min-w-[40px] shadow-sm",
        // Transitions — only transform, opacity, background-color, box-shadow (all compositor-friendly)
        "transition-all duration-200 ease-out",
        // Background + foreground per state
        bgColor,
        fgColor,
        // Hover: lift + glow (idle only — disabled states don't get hover)
        "enabled:hover:translate-y-[-2px] enabled:hover:shadow-[0_4px_16px_color-mix(in_srgb,var(--brand-accent)_35%,transparent)]",
        // Focus ring: always visible, keyboard-accessible
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        // Active: slight press-down
        "enabled:active:scale-95",
        // Disabled styling
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm",
        // Shake animation (error state)
        shakeClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        isError
          ? { animation: "send-btn-shake 300ms ease-in-out" }
          : undefined
      }
    >
      {/* ── Icon Layers — always rendered, toggled via opacity for smooth crossfade ── */}

      {/* Send icon (idle) */}
      <Send
        className="w-4 h-4 absolute transition-opacity duration-200 ease-in-out"
        style={{ opacity: !isLoading && !isSuccess && !isError ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Spinner (loading) */}
      <Loader2
        className="w-4 h-4 absolute send-btn-spinner transition-opacity duration-200 ease-in-out"
        style={{
          opacity: isLoading ? 1 : 0,
          animation: isLoading ? "send-btn-spin 800ms linear infinite" : "none",
        }}
        aria-hidden="true"
      />

      {/* Checkmark (success) */}
      <Check
        className="w-4 h-4 absolute transition-opacity duration-200 ease-in-out"
        style={{ opacity: isSuccess ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Retry icon (error) */}
      <RotateCcw
        className="w-4 h-4 absolute transition-opacity duration-200 ease-in-out"
        style={{ opacity: isError ? 1 : 0 }}
        aria-hidden="true"
      />
    </button>
  );
}
