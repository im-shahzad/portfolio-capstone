import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import ChatMessage from "@/components/ChatMessage";
import Chat from "@/components/Chat";

// ── Mock @ai-sdk/react useChat hook ─────────────────────────────────────────
const mockSendMessage = vi.fn();
const mockStop = vi.fn();
const mockSetMessages = vi.fn();
const mockClearError = vi.fn();
const mockRegenerate = vi.fn();

let mockUseChatState = {
  messages: [] as Array<{
    id: string;
    role: string;
    content?: string;
    parts?: Array<{ type: string; text: string }>;
  }>,
  status: "ready" as "ready" | "submitted" | "streaming" | "error",
  error: undefined as Error | undefined,
};

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockUseChatState.messages,
    status: mockUseChatState.status,
    error: mockUseChatState.error,
    sendMessage: mockSendMessage,
    stop: mockStop,
    setMessages: mockSetMessages,
    clearError: mockClearError,
    regenerate: mockRegenerate,
  }),
}));

// ═══════════════════════════════════════════════════════════════════════════════
// ChatMessage tests — query by visible text, role, and label
// ═══════════════════════════════════════════════════════════════════════════════

describe("ChatMessage component", () => {
  it("renders a user message with the 'You' label and message content", () => {
    render(<ChatMessage role="user" content="Hello there!" />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("renders an assistant message with the 'Shahzad (AI Assistant)' label", () => {
    render(
      <ChatMessage
        role="assistant"
        content="I build practical AI applications."
      />
    );

    expect(
      screen.getByText("Shahzad (AI Assistant)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("I build practical AI applications.")
    ).toBeInTheDocument();
  });

  it("renders a copy button for assistant messages with an accessible label", () => {
    render(<ChatMessage role="assistant" content="Some answer" />);

    expect(
      screen.getByRole("button", { name: /copy answer/i })
    ).toBeInTheDocument();
  });

  it("does NOT render a copy button for user messages", () => {
    render(<ChatMessage role="user" content="My question" />);

    expect(
      screen.queryByRole("button", { name: /copy answer/i })
    ).not.toBeInTheDocument();
  });

  it("renders formatted markdown links with correct href", () => {
    render(
      <ChatMessage
        role="assistant"
        content="Contact me at [Email](mailto:imshahzad000@gmail.com)"
      />
    );

    const link = screen.getByRole("link", { name: "Email" });
    expect(link).toHaveAttribute("href", "mailto:imshahzad000@gmail.com");
  });

  it("renders bold text as strong element", () => {
    render(
      <ChatMessage role="assistant" content="I specialize in **GenAI**." />
    );

    expect(screen.getByText("GenAI")).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Chat component tests — query by role, label, and visible text
// ═══════════════════════════════════════════════════════════════════════════════

describe("Chat component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChatState = {
      messages: [],
      status: "ready",
      error: undefined,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty state with welcome heading and suggested questions", () => {
    render(<Chat />);

    expect(screen.getByRole("heading", { name: /ask me anything/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /tell me about your meme caption generator project/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText("0/20 msgs")).toBeInTheDocument();
  });

  it("submits message when clicking a suggested question", async () => {
    render(<Chat />);

    const suggestionBtn = screen.getByRole("button", {
      name: /tell me about your meme caption generator project/i,
    });
    fireEvent.click(suggestionBtn);

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "Tell me about your Meme Caption Generator project.",
    });
  });

  it("allows typing in the textarea and submitting via send button", async () => {
    const user = userEvent.setup();
    render(<Chat />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "What are your core technical skills?");

    const sendBtn = screen.getByRole("button", { name: /send message/i });
    expect(sendBtn).not.toBeDisabled();

    await user.click(sendBtn);
    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "What are your core technical skills?",
    });
  });

  it("shows thinking indicator when status is 'submitted'", () => {
    mockUseChatState = {
      messages: [
        { id: "1", role: "user", content: "Tell me about your background." },
      ],
      status: "submitted",
      error: undefined,
    };

    render(<Chat />);
    expect(screen.getByText(/shahzad is thinking/i)).toBeInTheDocument();
  });

  it("shows stop button when generation is in progress", () => {
    mockUseChatState = {
      messages: [
        { id: "1", role: "user", content: "Tell me about your background." },
        { id: "2", role: "assistant", content: "I am a developer..." },
      ],
      status: "streaming",
      error: undefined,
    };

    render(<Chat />);

    const stopBtn = screen.getByRole("button", {
      name: /stop generating/i,
    });
    expect(stopBtn).toBeInTheDocument();

    fireEvent.click(stopBtn);
    expect(mockStop).toHaveBeenCalled();
  });

  it("disables input and shows banner when message limit is reached", () => {
    mockUseChatState = {
      messages: Array.from({ length: 20 }, (_, i) => ({
        id: String(i),
        role: i % 2 === 0 ? "user" : "assistant",
        content: `Msg ${i + 1}`,
      })),
      status: "ready",
      error: undefined,
    };

    render(<Chat />);

    expect(screen.getByText(/conversation limit reached/i)).toBeInTheDocument();
    expect(screen.getByText("20/20 msgs")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows error banner with retry button on error state", () => {
    mockUseChatState = {
      messages: [
        { id: "1", role: "user", content: "Tell me about your background." },
      ],
      status: "ready",
      error: new Error("Rate limit exceeded"),
    };

    render(<Chat />);

    expect(screen.getByText(/error:/i)).toBeInTheDocument();
    expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(mockClearError).toHaveBeenCalled();
    expect(mockRegenerate).toHaveBeenCalledTimes(1);
  });

  it("disables retry button while generating", () => {
    mockUseChatState = {
      messages: [{ id: "1", role: "user", content: "Hello" }],
      status: "streaming",
      error: new Error("Something failed"),
    };

    render(<Chat />);

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    expect(retryBtn).toBeDisabled();
  });
});
