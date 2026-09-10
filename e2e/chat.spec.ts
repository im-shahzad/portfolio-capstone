import { test, expect } from "@playwright/test";

test.describe("Chat page e2e", () => {
  test("loads chat page, sends a message, and receives a response", async ({
    page,
  }) => {
    // Mock the AI API route — never call the real Gemini API
    await page.route("**/api/chat", async (route) => {
      // AI SDK v7 uses the "UI Message Stream" protocol (SSE with JSON chunks),
      // NOT the old v3 data-stream format (0:"text", e:{}, d:{} prefixed lines).
      // Each chunk is an SSE "data:" line containing a JSON object with a "type" field.
      const body = [
        `data: {"type":"text","text":"I am the portfolio AI assistant. I can tell you about my projects and background."}`,
        `data: {"type":"finish","finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}`,
        `data: [DONE]`,
      ].join("\n\n") + "\n\n";

      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "x-vercel-ai-ui-message-stream": "v1",
          "x-accel-buffering": "no",
        },
        body,
      });
    });

    // Navigate to the chat page
    await page.goto("/chat");

    // Verify the page loaded with the welcome state
    await expect(page.getByRole("heading", { name: /ask me anything/i })).toBeVisible();
    await expect(page.getByText("0/20 msgs")).toBeVisible();

    // Type a message into the textarea
    const textarea = page.getByRole("textbox");
    await textarea.fill("What projects have you built?");

    // Click the send button
    const sendBtn = page.getByRole("button", { name: /send message/i });
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Verify the user message appears
    await expect(page.getByText("You", { exact: true })).toBeVisible();
    await expect(page.getByText("What projects have you built?")).toBeVisible();

    // Verify the assistant response appears
    await expect(
      page.getByText("I am the portfolio AI assistant")
    ).toBeVisible({ timeout: 10_000 });

    // Verify message counter updated
    await expect(page.getByText("2/20 msgs")).toBeVisible();
  });
});
