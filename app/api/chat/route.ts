import { streamText, convertToModelMessages, tool, zodSchema } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import {
  CHAT_MODEL,
  MAX_MESSAGES_PER_CONVERSATION,
  MAX_MESSAGE_CHARACTERS,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  SYSTEM_PROMPT,
} from '@/lib/chatConfig';

export const runtime = 'edge';

/**
 * My real skill set, used by checkJobFit to compare against a pasted job
 * description. Each entry maps a canonical, human-readable skill label to
 * one or more regex patterns that indicate the skill is being asked for.
 * Keep this list honest — it should reflect actual experience, not aspiration.
 */
const SKILL_KEYWORDS: { label: string; patterns: RegExp[] }[] = [
  { label: 'Python', patterns: [/\bpython\b/i] },
  {
    label: 'JavaScript/TypeScript',
    patterns: [/\bjavascript\b/i, /\btypescript\b/i],
  },
  { label: 'React', patterns: [/\breact(\.js)?\b/i] },
  {
    label: 'Next.js (App Router)',
    patterns: [/\bnext\.js\b/i, /\bnextjs\b/i, /\bapp router\b/i],
  },
  { label: 'Vercel AI SDK', patterns: [/\bvercel ai sdk\b/i, /\bai sdk\b/i] },
  { label: 'Google Gemini API integration', patterns: [/\bgemini\b/i] },
  {
    label: 'Tool-calling with structured outputs (Zod schemas)',
    patterns: [/\btool.calling\b/i, /\bfunction.calling\b/i, /\bstructured output/i, /\bzod\b/i],
  },
  { label: 'Prompt engineering', patterns: [/\bprompt engineering\b/i] },
  { label: 'Firebase (Auth + Realtime Database)', patterns: [/\bfirebase\b/i] },
  { label: 'REST APIs', patterns: [/\brest(ful)? api/i] },
  { label: 'Tailwind CSS v4', patterns: [/\btailwind\b/i] },
  {
    label: 'Accessible components (ARIA, keyboard nav, focus management, WCAG AA)',
    patterns: [/\baccessib\w*\b/i, /\ba11y\b/i, /\baria\b/i, /\bwcag\b/i],
  },
  { label: 'Vitest', patterns: [/\bvitest\b/i] },
  { label: 'React Testing Library', patterns: [/\breact testing library\b/i, /\brtl\b/i] },
  { label: 'Playwright E2E', patterns: [/\bplaywright\b/i] },
  {
    label: 'CI/CD via GitHub Actions',
    patterns: [/\bgithub actions\b/i, /\bci\/cd\b/i, /\bci cd\b/i, /\bcontinuous integration\b/i],
  },
  { label: 'Git/GitHub workflows', patterns: [/\bgit\b/i, /\bgithub\b/i] },
];

/**
 * Common requirements that show up in job postings but are NOT in my skill
 * set. Used to surface honest gaps rather than only reporting matches.
 */
const GAP_KEYWORDS: { label: string; patterns: RegExp[] }[] = [
  { label: 'AWS', patterns: [/\baws\b/i, /\bamazon web services\b/i] },
  { label: 'Google Cloud Platform (GCP)', patterns: [/\bgcp\b/i, /\bgoogle cloud\b/i] },
  { label: 'Microsoft Azure', patterns: [/\bazure\b/i] },
  { label: 'Docker', patterns: [/\bdocker\b/i] },
  { label: 'Kubernetes', patterns: [/\bkubernetes\b/i, /\bk8s\b/i] },
  { label: 'Java', patterns: [/\bjava\b(?!script)/i] },
  { label: 'C++', patterns: [/\bc\+\+\b/i] },
  { label: 'C#/.NET', patterns: [/\bc#\b/i, /\b\.net\b/i] },
  { label: 'Go/Golang', patterns: [/\bgolang\b/i] },
  {
    label: 'SQL databases (PostgreSQL/MySQL)',
    patterns: [/\bsql\b/i, /\bpostgres(ql)?\b/i, /\bmysql\b/i],
  },
  { label: 'MongoDB', patterns: [/\bmongodb\b/i] },
  { label: 'GraphQL', patterns: [/\bgraphql\b/i] },
  { label: 'Redux', patterns: [/\bredux\b/i] },
  { label: 'Vue.js', patterns: [/\bvue(\.js)?\b/i] },
  { label: 'Angular', patterns: [/\bangular\b/i] },
  { label: 'Django/Flask', patterns: [/\bdjango\b/i, /\bflask\b/i] },
  { label: 'Node.js backend/Express', patterns: [/\bnode\.?js\b/i, /\bexpress\.js\b/i] },
  {
    label: 'Machine learning frameworks (PyTorch/TensorFlow/scikit-learn)',
    patterns: [/\bpytorch\b/i, /\btensorflow\b/i, /\bscikit-learn\b/i, /\bmachine learning\b/i, /\bdeep learning\b/i],
  },
  { label: 'LangChain', patterns: [/\blangchain\b/i] },
  { label: 'OpenAI API', patterns: [/\bopenai\b/i] },
  { label: 'Kafka', patterns: [/\bkafka\b/i] },
  { label: 'Microservices architecture', patterns: [/\bmicroservices\b/i] },
  { label: 'System design', patterns: [/\bsystem design\b/i] },
  { label: 'Agile/Scrum', patterns: [/\bagile\b/i, /\bscrum\b/i] },
  { label: 'DevOps/infra-as-code', patterns: [/\bdevops\b/i, /\bterraform\b/i] },
  { label: 'Mobile development (iOS/Android)', patterns: [/\bios\b/i, /\bandroid\b/i, /\breact native\b/i, /\bswift\b/i, /\bkotlin\b/i] },
];

// In-memory rate limiting map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();

/**
 * Clean up stale rate-limit records to avoid memory growth.
 */
function cleanupRateLimitMap(now: number) {
  if (rateLimitMap.size > 1000) {
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const active = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, active);
      }
    }
  }
}

/**
 * Check if the given client IP has exceeded the rate limit.
 */
function isRateLimited(clientIp: string, now: number): boolean {
  cleanupRateLimitMap(now);
  const timestamps = rateLimitMap.get(clientIp) || [];
  const recentTimestamps = timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(clientIp, recentTimestamps);
  return false;
}

/**
 * Log a stream-pipeline error with enough detail to diagnose it, regardless
 * of whether it's a plain Error, an AI SDK error object, or something else.
 */
function logStreamError(label: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`[${label}] message:`, error.message);
    console.error(`[${label}] name:`, error.name);
    console.error(`[${label}] cause:`, error.cause);
  } else {
    console.error(`[${label}] raw:`, error);
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            'Server configuration error: GOOGLE_GENERATIVE_AI_API_KEY is not set.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded
      ? forwarded.split(',')[0].trim()
      : req.headers.get('x-real-ip') || '127.0.0.1';

    const now = Date.now();
    if (isRateLimited(clientIp, now)) {
      return new Response(
        JSON.stringify({
          error:
            'Rate limit exceeded. Please wait a minute before sending more messages.',
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request payload. Expected an array of messages.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = body;

    if (messages.length > MAX_MESSAGES_PER_CONVERSATION) {
      return new Response(
        JSON.stringify({
          error: `Conversation length limit reached (${MAX_MESSAGES_PER_CONVERSATION} messages). To protect free tier quota, please refresh the page to start a new chat, or email me directly at imshahzad000@gmail.com.`,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      const textContent =
        typeof lastMessage.content === 'string'
          ? lastMessage.content
          : Array.isArray(lastMessage.parts)
            ? lastMessage.parts
              .filter((p: { type?: string; text?: string }) => p.type === 'text')
              .map((p: { text?: string }) => p.text || '')
              .join('')
            : '';

      if (textContent.length > MAX_MESSAGE_CHARACTERS) {
        return new Response(
          JSON.stringify({
            error: `Message is too long. Please keep questions under ${MAX_MESSAGE_CHARACTERS} characters.`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google(CHAT_MODEL),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: {
        getProjectInfo: tool({
          description:
            'Retrieve detailed information about a portfolio project. Call this when the visitor asks about projects, work, or things the candidate has built. Do not describe projects from memory — always use this tool.',
          inputSchema: zodSchema(
            z.object({
              projectName: z
                .string()
                .optional()
                .describe('Optional project name to look up. Omit for the featured project.'),
            })
          ),
          execute: async (input: { projectName?: string }) => {
            const { projectName } = input;
            const projects: Record<
              string,
              {
                name: string;
                techStack: string[];
                problem: string;
                whatIDid: string;
                outcome: string;
                repoLink: string;
              }
            > = {
              'Meme Caption Generator': {
                name: 'Meme Caption Generator',
                techStack: ['Python', 'Gemini API', 'Streamlit'],
                problem:
                  'Most AI text generators can generate content, but getting a caption that\'s actually usable often means rewriting prompts over and over.',
                whatIDid:
                  'Predefined tone options (Funny, Sarcastic, Wholesome), generation history, side-by-side comparison.',
                outcome:
                  'Reduced iteration friction significantly through repeated use; not yet formally user-tested.',
                repoLink: 'https://github.com/IMShahzad000/meme-caption-generator',
              },
            };

            const key = projectName ?? 'Meme Caption Generator';
            const project = projects[key];

            if (!project) {
              return {
                error: `Project "${key}" not found. Available projects: ${Object.keys(projects).join(', ')}`,
              };
            }

            return project;
          },
        }),
        checkJobFit: tool({
          description:
            "Compare a recruiter-pasted job description against my real skill set and report honest matches and gaps. Call this whenever a visitor pastes or describes a job posting and asks about fit — never assess fit from memory.",
          inputSchema: zodSchema(
            z.object({
              jobDescription: z
                .string()
                .describe("The full text of the job posting to evaluate."),
            })
          ),
          execute: async (input: { jobDescription: string }) => {
            const jobDescription = input.jobDescription?.trim() ?? '';

            if (!jobDescription) {
              return { error: 'No job description text was provided.' };
            }

            const matchingSkills = SKILL_KEYWORDS.filter(({ patterns }) =>
              patterns.some((pattern) => pattern.test(jobDescription))
            ).map(({ label }) => label);

            const gaps = GAP_KEYWORDS.filter(({ patterns }) =>
              patterns.some((pattern) => pattern.test(jobDescription))
            ).map(({ label }) => label);

            const matchCount = matchingSkills.length;
            const gapCount = gaps.length;

            let overallAssessment: string;
            if (matchCount === 0) {
              overallAssessment =
                "I didn't find real overlap between this posting and my current skill set. Based on what's actually listed, this doesn't look like a strong fit for me right now.";
            } else {
              const ratio = matchCount / (matchCount + gapCount);
              if (gapCount === 0) {
                overallAssessment = `This is a strong match — the posting lines up with ${matchCount} things I actually work with (${matchingSkills.slice(0, 3).join(', ')}${matchCount > 3 ? ', and more' : ''}), and I didn't spot any obvious gaps.`;
              } else if (ratio >= 0.6) {
                overallAssessment = `This looks like a reasonably solid match — I have real experience with ${matchCount} of the things this posting mentions. That said, it also calls for ${gaps.slice(0, 2).join(' and ')}${gapCount > 2 ? ', among other things,' : ''} which isn't currently part of my skill set, so it's worth being upfront about that.`;
              } else {
                overallAssessment = `Honestly, this is a partial match at best — I only line up on ${matchCount} of the areas this posting calls out, while it leans heavily on ${gaps.slice(0, 3).join(', ')}${gapCount > 3 ? ', and more' : ''}, which I don't have experience with. I wouldn't oversell this one as a strong fit.`;
              }
            }

            return { matchingSkills, gaps, overallAssessment };
          },
        }),
      },
      onError: (error) => {
        logStreamError('streamText onError', error);
      },
    });

    // Without this, the SDK's default onError silently returns "An error
    // occurred." for every failure (quota errors, no-output errors, etc.)
    // and gives no server-side visibility into what actually happened.
    return result.toUIMessageStreamResponse({
      onError: (error) => {
        logStreamError('toUIMessageStreamResponse onError', error);
        if (error instanceof Error && /quota|rate.?limit|429/i.test(error.message)) {
          return 'The AI service is temporarily rate-limited. Please try again in a minute.';
        }
        return 'Failed to generate a response. Please try again.';
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return new Response(
      JSON.stringify({
        error: `Failed to process AI chat request: ${message}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

