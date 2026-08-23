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

