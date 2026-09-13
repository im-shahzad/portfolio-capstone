# Portfolio Capstone

AI-powered portfolio site built with Next.js, showcasing projects that demonstrate practical LLM integration. Features a streaming AI chat assistant that answers visitor questions about my work using tool-calling and structured outputs.

## Setup & Run

```bash
git clone <repo-url>
cd portfolio-capstone
npm install
```

Create `.env.local` in the project root:

```
GOOGLE_GENERATIVE_AI_API_KEY=<your-google-ai-studio-api-key>
```

Get a free key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture Overview

```
app/
├── page.tsx                  Home — headline + links to /work and /chat
├── work/page.tsx             Case study: Meme Caption Generator
├── about/page.tsx            Bio and engineering philosophy
├── contact/page.tsx          Contact form (client component)
├── chat/page.tsx             AI chat interface page
├── 3d-viewer/page.tsx        Drag-and-drop GLB/GLTF model viewer
├── health/page.tsx           Deployment health check (fetches external API)
├── playground/page.tsx       Accessible UI component demos (Disclosure, Tabs, Modal)
├── playground/send-button/   Send button animation state playground
└── api/chat/route.ts         Chat API endpoint (Edge runtime)
```

**`lib/chatConfig.ts`** — Central configuration for the AI chat: model selection, system prompt, rate limits, abuse safeguards, and suggested starter questions.

**`lib/utils.ts`** — Shared utility (`cn` for conditional classnames).

**`components/`** — All UI components, one per file, PascalCase:

| Component | Purpose |
|---|---|
| `Chat.tsx` | Full chat interface — message list, input, streaming, error handling, auto-scroll, timeout guard |
| `ChatLoader.tsx` | Dynamic-import wrapper for `Chat` (SSR disabled, skeleton fallback) |
| `ChatMessage.tsx` | Individual message bubble (user vs assistant styling) |
| `SendButton.tsx` | Five-state animated send button (idle → hover → loading → success → error) |
| `ProjectCard.tsx` | Tool result card for `getProjectInfo` — shows name, tech stack, problem, outcome, repo link |
| `FitCard.tsx` | Tool result card for `checkJobFit` — shows matching skills, gaps, overall assessment |
| `NavBar.tsx` | Top navigation with active-page highlighting |
| `ContactForm.tsx` | Client-side contact form |
| `three/` | 3D viewer components — `ModelViewerCanvas`, `MaterialControls`, `types` |
| `playground/` | Accessible UI demos — `Disclosure`, `Tabs`, `Modal` |

## AI Integration

### Model Choice

**Google Gemini Flash-Lite** (`gemini-flash-lite-latest`) via the Vercel AI SDK.

Why Flash-Lite specifically: `gemini-flash-latest` resolves to a "thinking" model whose free tier is capped at 20 requests/day and burns output budget on hidden reasoning tokens (sometimes producing zero visible output). Flash-Lite skips the reasoning phase, has a much higher free-tier quota, and is the practical choice for a public-facing portfolio chatbot.

### How Tool-Calling Works

The chat API (`app/api/chat/route.ts`) defines two tools that Gemini can invoke during a conversation:

**`getProjectInfo`** — Called when a visitor asks about projects or work. Returns structured data: project name, tech stack, problem statement, what was built, outcome (with honest caveats), and repo link. The AI is instructed in the system prompt to *always* call this tool rather than describing projects from memory.

**`checkJobFit`** — Called when a visitor pastes a job description. Compares the posting against a predefined skill keyword list (`SKILL_KEYWORDS`) and a gap list (`GAP_KEYWORDS`) using regex pattern matching. Returns matching skills, gaps, and a ratio-based overall assessment. The skill/gap lists are kept honest — they reflect actual experience, not aspirations.

Both tools use Zod schemas for input validation and return structured objects that the frontend renders as dedicated card components (`ProjectCard`, `FitCard`) with loading/fetching/result/error states.

### Why Edge Runtime

The chat route uses `export const runtime = 'edge'` specifically. This was chosen to fix a buffering bug where the Node.js runtime would buffer the entire streamed response before sending it to the client, breaking the real-time streaming UX. Edge runtime streams tokens as they arrive from Gemini, giving users the immediate "thinking → typing" feedback loop.

### Abuse Safeguards

These protect the free-tier API quota on a public-facing site:

- **20 messages per conversation** — session cap, user sees a counter and can reset
- **2,000 characters per message** — prevents payload flooding
- **15 requests per IP per minute** — in-memory rate limiter with automatic cleanup

### System Prompt

The system prompt (`lib/chatConfig.ts`) instructs the AI to speak in first person, stay strictly honest (never invent credentials or fake metrics), steer off-topic questions back to the portfolio, and always use tools rather than answering from memory.

## Known Limitations

- **Meme Caption Generator isn't deployed live** — it exists as a repo + screenshots only. The `/work` page is a static case study, not a live demo.
- **Chat has a 20-message conversation cap** and 15 req/min rate limit to protect free-tier API quota. These are intentional trade-offs, not bugs.
- **Formal user testing hasn't been done** on the Meme Caption Generator or the chat interface. Claims about reduced friction are based on personal use, not measured data.
- **No backend/database** — the contact form doesn't persist submissions yet. It's a client-side form awaiting a backend integration.
- **Single case study** — only the Meme Caption Generator is showcased so far.

## Future Improvements

- Deploy the Meme Caption Generator as a live demo
- Add more case studies as new projects are built
- Integrate a backend for the contact form (form submissions, storage)
- Semantic search across project descriptions
- DRACO/meshopt decoder support for the 3D model viewer

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server (with webpack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run test:all` | Unit + E2E together |

## Tech Stack

Next.js 16 (App Router) · React 19 · Vercel AI SDK · Google Gemini API · Tailwind CSS v4 · TypeScript · Vitest · Playwright
