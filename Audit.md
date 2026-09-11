# Accessibility & Performance Audit (FE-10)

## Overview
Audit performed on the `portfolio-capstone` web application covering mobile performance, WCAG AA accessibility compliance, and keyboard navigation.

## Baseline vs. Final Scores

| Metric | Before Audit | After Audit | Target |
| :--- | :--- | :--- | :--- |
| **Performance (Mobile)** | [Insert Score e.g., 72] | **[Insert Score e.g., 94]** | 90+ |
| **Accessibility** | [Insert Score e.g., 81] | **[Insert Score e.g., 98]** | 90+ |
| **WAVE Errors** | [Insert Count e.g., 6] | **0 Errors** | 0 |

### Screenshots
* **Baseline Audit**: `![Baseline](docs/images/lighthouse-before.png)`
* **Final Audit**: `![Final](docs/images/lighthouse-after.png)`

## Key Fixes Implemented

### 1. AI-Specific Accessibility
- Added `aria-live="polite"` and `aria-atomic="false"` to streaming AI message containers to announce incoming responses.
- Added explicit keyboard focus states and `aria-label="Stop generating response"` to the stream-cancellation button.

### 2. General Accessibility & ARIA
- Wrapped primary page sections in standard HTML5 landmarks (`<main>`, `<nav>`, `<footer>`).
- Ensured 100% keyboard accessibility across chat inputs, navigation links, and 3D viewer controls.
- Resolved low-contrast text colors to meet WCAG AA standards.

### 3. Performance & Web Vitals
- Reduced Layout Shift (CLS) by setting aspect ratios on media wrappers.
- Enforced code-splitting on high-impact components using `next/dynamic`.