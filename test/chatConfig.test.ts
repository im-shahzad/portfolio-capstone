import { describe, it, expect } from "vitest";
import {
  CHAT_MODEL,
  MAX_MESSAGES_PER_CONVERSATION,
  MAX_MESSAGE_CHARACTERS,
  RATE_LIMIT_MAX_REQUESTS,
  SYSTEM_PROMPT,
  SUGGESTED_QUESTIONS,
} from "@/lib/chatConfig";

describe("chatConfig", () => {
  it("uses the correct Google Gemini flash-lite model", () => {
    expect(CHAT_MODEL).toBe("gemini-flash-lite-latest");
  });

  it("defines appropriate abuse safeguards", () => {
    expect(MAX_MESSAGES_PER_CONVERSATION).toBe(20);
    expect(MAX_MESSAGE_CHARACTERS).toBe(2000);
    expect(RATE_LIMIT_MAX_REQUESTS).toBe(15);
  });

  it("contains all required elements in the system prompt", () => {
    // Background
    expect(SYSTEM_PROMPT).toContain("I build AI-powered applications people can actually use, not just API demonstrations");
    expect(SYSTEM_PROMPT).toContain("combining Python with Generative AI");
    
    // Meme Caption Generator project
    expect(SYSTEM_PROMPT).toContain("Meme Caption Generator");
    expect(SYSTEM_PROMPT).toContain("predefined tone options (Funny, Sarcastic, Wholesome)");
    expect(SYSTEM_PROMPT).toContain("generation history and side-by-side comparison");
    
    // Honesty caveat
    expect(SYSTEM_PROMPT).toContain("not formally user-tested yet");
    
    // UX lesson
    expect(SYSTEM_PROMPT).toContain("the UX layer is what turns a model into a product people actually want to use");
    
    // Contact
    expect(SYSTEM_PROMPT).toContain("imshahzad000@gmail.com");
    
    // First person & tone constraints
    expect(SYSTEM_PROMPT).toContain('first person ("I", "me", "my")');
  });

  it("provides starter suggestion prompts", () => {
    expect(SUGGESTED_QUESTIONS.length).toBeGreaterThanOrEqual(3);
    expect(SUGGESTED_QUESTIONS[0]).toContain("Meme Caption Generator");
  });
});
