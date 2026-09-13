"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-alt border border-error/40 text-error">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-heading text-text">
            Something went wrong
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            An unexpected error occurred while loading this page. Please try
            again.
          </p>
        </div>

        {error.digest && (
          <p className="text-xs text-text-dim font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-fg text-sm font-semibold outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-all active:scale-95"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
