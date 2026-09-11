# Accessibility & Performance Audit (FE-10)

## Overview
Comprehensive WCAG 2.1 AA accessibility and Lighthouse mobile performance audit performed on the `portfolio-capstone` web application.

## Baseline vs. Final Audit Results

| Metric | Baseline | Final | Status |
| :--- | :--- | :--- | :--- |
| **Performance (Mobile)** | 88 | **93** | PASSED |
| **Accessibility** | 100 | **100** | PASSED |
| **Best Practices** | 96 | **100** | PASSED |
| **SEO** | 100 | **100** | PASSED |
| **WAVE Errors** | 4 Errors | **0 Errors** | PASSED |
| **Keyboard Navigation** | Partial | **100% Reachable** | PASSED |

### Embedded Screenshots
* **Baseline Audit**: `![Baseline Audit](docs/images/lighthouse-before.png)`
* **Final Audit**: `![Final Audit](docs/images/lighthouse-after.png)`

## Key Fixes & Optimizations Implemented

### 1. Performance & Main-Thread Optimization (TBT)
- **Extracted Heavy Controls**: Moved `Leva` material controls into a standalone `MaterialControls.tsx` component.
- **Lazy Mounting in Production**: Dynamically imported `MaterialControls` (`ssr: false`) and deferred its execution via `requestIdleCallback` in production environments (`process.env.NODE_ENV === 'production'`). This completely eliminated main-thread blocking during initial paint.
- **Audit Methodology**: Audits were conducted using Chrome DevTools in an **Incognito window** to ensure browser extension overhead (e.g., content script injection) did not artificially skew Total Blocking Time (TBT) or performance scores.

### 2. AI Assistant Accessibility
- Wrapped streamed chat output in `role="log"` and `aria-live="polite"` so screen readers announce incoming AI tokens without interrupting current speech focus.
- Added explicit `aria-label="Message the AI assistant"` to the chat textarea.

### 3. General Accessibility & Forms
- **Keyboard-Accessible File Inputs**: Replaced `display: none` on the 3D viewer's file input with `sr-only` and focus-ring handling (`has-[:focus-visible]:ring-2`) on the parent label.
- **Hover/Focus State Uniformity**: Added `focus-visible:opacity-100` to hover-only action buttons (e.g., copy buttons) so keyboard navigation makes them visible when targeted.
- **Structural Landmarks**: Ensured proper page semantics across layout and routes (`<header>`, `<main>`, `<footer>`).
- **Color Contrast**: Updated gray text colors (`#7E7569` $\rightarrow$ `#968C7F`) to exceed the WCAG AA requirement of 4.5:1.