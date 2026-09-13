import React from "react";

/**
 * Inline script injected in <head> to apply accent from localStorage
 * before first paint, preventing FOUC.
 */
export default function NoFlashScript() {
  const script = `
(function() {
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
