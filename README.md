# Portfolio Capstone

AI-powered portfolio site built with Next.js, showcasing projects that demonstrate practical LLM integration.

## Status
🚧 In progress — FlyRank AI Internship, Frontend AI Engineering track.

## Stack
Next.js, React, deployed on Vercel.

## What's Being Built
- AI chat interface that answers questions about my projects using an LLM
- Dynamic project cards auto-generated from a structured data source
- **Next milestone:** semantic search across project descriptions (Q3 2026)

## AI Chat Tools

### getProjectInfo
Server-side tool called by the AI chat assistant when a visitor asks about my work.

**Input schema:** none required (returns my current project).

**Returns:**
- `name` (string) — project name
- `techStack` (string[]) — technologies used
- `problem` (string) — the problem being solved
- `whatIDid` (string) — key implementation decisions
- `outcome` (string) — real results, including honest caveats
- `repoLink` (string) — link to the public repository

## Send Button — State-Machine Animation Choreography

The chat's Send button implements a five-state motion system: **idle → hover/focus → loading → success → idle** (and idle → loading → error → retry → idle).

### Duration & Easing Choices

| Transition | Duration | Easing | Why |
|---|---|---|---|
| Hover lift | 150ms | `ease-out` | Fast enough to feel instant; `ease-out` decelerates naturally so it doesn't pop |
| Icon crossfade | 200ms | `ease-in-out` | Below 150ms looks like a toggle; above 300ms feels sluggish |
| Success hold | ~250ms | — | Long enough for checkmark recognition (~200ms research threshold), short enough not to block |
| Error shake | 300ms | `ease-in-out` | Single rattle; longer feels excessive, shorter is imperceptible |
| Spinner | 800ms/rev | `linear` | Constant rotation matches user expectations for loading |

All animations use **`transform` and `opacity` only** — compositor-friendly, no layout thrash. The shake is skipped entirely under `prefers-reduced-motion`; color/label feedback always persists.

### Testing All States

Visit `/playground/send-button` for an interactive demo with Force Success/Error triggers, or test in the real chat at `/chat`.

| State | How to trigger |
|---|---|
| Idle | Default button state |
| Hover/Focus | Mouse hover (lift + glow) or Tab (focus ring) |
| Loading | Click Send — spinner crossfades in |
| Success | Click "Force Success" then Send — green checkmark, auto-returns to idle |
| Error | Click "Force Error" then Send — shake + red + retry icon; click to retry |
| Reduced motion | DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → shake disappears, color stays |