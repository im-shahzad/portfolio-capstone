"use client";

import dynamic from "next/dynamic";

// Decorative, non-critical widget (small top-right accent-color switcher).
// Lazy-loaded so its JS (useSyncExternalStore + MutationObserver wiring)
// doesn't compete with the critical hero content during initial hydration.
// Kept in its own "use client" file because next/dynamic's { ssr: false }
// is not allowed directly inside a Server Component (Hero.tsx).
const AccentSwitcher = dynamic(() => import("./AccentSwitcher"), {
  ssr: false,
  loading: () => <div className="w-[104px] h-4 sm:w-[124px] sm:h-5" aria-hidden="true" />,
});

export default AccentSwitcher;
