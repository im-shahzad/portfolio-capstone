"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen bg-[#1C1917] text-[#F2EDE4] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2A241D] border border-rose-800/60 text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#F2EDE4]">
              Something went wrong
            </h2>
            <p className="text-sm text-[#A89F93] leading-relaxed">
              An unexpected error occurred while loading this site. Please try
              again.
            </p>
          </div>

          {error.digest && (
            <p className="text-xs text-[#7E7569] font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9A441] text-[#1C1917] text-sm font-semibold outline-none hover:bg-[#E5B255] focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917] transition-colors active:scale-95"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
