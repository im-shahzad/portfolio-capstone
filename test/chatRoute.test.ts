import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock 'ai' and '@ai-sdk/google'
vi.mock("ai", () => ({
  streamText: vi.fn().mockReturnValue({
    toDataStreamResponse: vi.fn().mockReturnValue(new Response("mock stream", { status: 200 })),
    toUIMessageStreamResponse: vi.fn().mockReturnValue(new Response("mock stream", { status: 200 })),
  }),
  convertToModelMessages: vi.fn(async (messages) => messages),
}));

vi.mock("@ai-sdk/google", () => ({
  google: vi.fn().mockReturnValue("mock-gemini-model"),
}));

describe("API Route: app/api/chat/route.ts", () => {
  const originalEnv = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  beforeEach(() => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "mock-api-key-12345";
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalEnv;
  });

  it("returns 500 if GOOGLE_GENERATIVE_AI_API_KEY is missing", async () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // Dynamically import to ensure fresh module state
    const { POST } = await import("@/app/api/chat/route");
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("GOOGLE_GENERATIVE_AI_API_KEY is not set");
  });

  it("returns 400 if messages payload is not an array", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: "invalid string" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Invalid request payload");
  });

  it("safeguard: returns 429 if conversation length exceeds 20 messages", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const messages = Array.from({ length: 21 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i + 1}`,
    }));

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.0.1" },
      body: JSON.stringify({ messages }),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toContain("Conversation length limit reached (20 messages)");
  });

  it("safeguard: returns 400 if message content exceeds 2000 characters", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const longMessage = "a".repeat(2001);

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.0.2" },
      body: JSON.stringify({
        messages: [{ role: "user", content: longMessage }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Message is too long");
  });

  it("safeguard: returns 429 when IP rate limit (>15 requests/min) is exceeded", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const testIp = "192.168.1.99";

    // Send 15 valid requests
    for (let i = 0; i < 15; i++) {
      const req = new Request("http://localhost/api/chat", {
        method: "POST",
        headers: { "x-forwarded-for": testIp },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Ping ${i}` }],
        }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 16th request should hit 429 rate limit
    const blockedReq = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "x-forwarded-for": testIp },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Should be blocked" }],
      }),
    });

    const blockedRes = await POST(blockedReq);
    expect(blockedRes.status).toBe(429);
    const body = await blockedRes.json();
    expect(body.error).toContain("Rate limit exceeded");
  });

  it("successfully streams response for a valid request", async () => {
    const { POST } = await import("@/app/api/chat/route");
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "x-forwarded-for": "10.0.0.5" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Tell me about your background." }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
