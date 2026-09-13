import React from "react";

/**
 * Inline script injected in <head> to apply theme + accent from localStorage
 * before first paint, preventing FOUC (flash of unstyled content).
 *
 * This is a render-only component — it emits a <script> tag, no client JS.
 */
export default function NoFlashScript() {
  const script = `
(function() {
  try {
    var t = localStorage.getItem('portfolio-theme');
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}

  try {
    var a = localStorage.getItem('portfolio-accent');
    if (a) document.documentElement.setAttribute('data-accent', a);
  } catch(e) {}
})();
`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
