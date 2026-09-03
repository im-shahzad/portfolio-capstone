import { test, expect } from "@playwright/test";

test.describe("Chat page e2e", () => {
  test("loads chat page, sends a message, and receives a response", async ({
    page,
  }) => {
    // Mock the AI API route — never call the real Gemini API
    await page.route("**/api/chat", async (route) => {
      // Simulate a streaming AI response using the Vercel AI SDK data-stream format
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send a text part
          controller.enqueue(
            encoder.encode('0:"I am the portfolio AI assistant. ')
          );
          controller.enqueue(encoder.encode('0:"I can tell you about my projects and background."'));
          controller.enqueue(encoder.encode("e: {}\n"));
          controller.enqueue(encoder.encode("d: {\"finishReason\":\"stop\",\"usage\":{\"promptTokens\":0,\"completionTokens\":0}}\n"));
          controller.close();
        },
      });

      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Vercel-AI-Data-Stream": "v1",
        },
        body: stream,
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
    await expect(page.getByText("You")).toBeVisible();
    await expect(page.getByText("What projects have you built?")).toBeVisible();

    // Verify the assistant response appears
    await expect(
      page.getByText("I am the portfolio AI assistant")
    ).toBeVisible({ timeout: 10_000 });

    // Verify message counter updated
    await expect(page.getByText("2/20 msgs")).toBeVisible();
  });
});
