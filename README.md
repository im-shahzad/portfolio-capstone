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