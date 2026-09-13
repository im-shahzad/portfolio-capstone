"use client";

import React, { useReducer, useRef, useCallback, useEffect } from "react";
import { Send, Check, Loader2, RotateCcw } from "lucide-react";

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

export interface SendButtonProps {
  onSend: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function SendButton({
  onSend,
  disabled = false,
  className = "",
}: SendButtonProps) {
  const [state, dispatch] = useReducer(reducer, "idle");
  const isMountedRef = useRef(true);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const handleClick = useCallback(async () => {
    if (state !== "idle" && state !== "error") return;
    if (disabled) return;

    dispatch({ type: state === "error" ? "RETRY" : "SEND" });

    try {
      await onSend();
      if (!isMountedRef.current) return;
      dispatch({ type: "RESOLVE_SUCCESS" });

      successTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          dispatch({ type: "RETURN_TO_IDLE" });
        }
      }, 600);
    } catch {
      if (!isMountedRef.current) return;
      dispatch({ type: "RESOLVE_ERROR" });
    }
  }, [state, disabled, onSend]);

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";
  const isDisabledVisual = disabled || isLoading || isSuccess;

  const bgColor = isError
    ? "bg-rose-600"
    : isSuccess
      ? "bg-emerald-500"
      : "bg-accent";

  const fgColor = isError || isSuccess ? "text-white" : "text-accent-fg";

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
        if (state === "error") {
          e.preventDefault();
        }
        handleClick();
      }}
      className={[
        "relative flex items-center justify-center w-10 h-10 rounded-lg",
        "font-bold min-h-[40px] min-w-[40px] shadow-sm",
        "transition-all duration-200 ease-out",
        bgColor,
        fgColor,
        "enabled:hover:translate-y-[-2px] enabled:hover:shadow-[0_4px_16px_var(--accent-muted)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "enabled:active:scale-95",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm",
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
      <Send
        className="w-4 h-4 absolute transition-opacity duration-200 ease-in-out"
        style={{ opacity: !isLoading && !isSuccess && !isError ? 1 : 0 }}
        aria-hidden="true"
      />
      <Loader2
        className="w-4 h-4 absolute send-btn-spinner transition-opacity duration-200 ease-in-out"
        style={{
          opacity: isLoading ? 1 : 0,
          animation: isLoading ? "send-btn-spin 800ms linear infinite" : "none",
        }}
        aria-hidden="true"
      />
      <Check
        className="w-4 h-4 absolute transition-opacity duration-200 ease-in-out"
        style={{ opacity: isSuccess ? 1 : 0 }}
        aria-hidden="true"
      />
      <RotateCcw
        className="w-4 h-4 absolute transition-opacity duration-200 ease-in-out"
        style={{ opacity: isError ? 1 : 0 }}
        aria-hidden="true"
      />
    </button>
  );
}
