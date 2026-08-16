import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import ChatMessage from "@/components/ChatMessage";
import Chat from "@/components/Chat";

// Mock @ai-sdk/react useChat hook
const mockSendMessage = vi.fn();
const mockStop = vi.fn();
const mockSetMessages = vi.fn();
const mockClearError = vi.fn();

let mockUseChatState = {
  messages: [] as Array<{ id: string; role: string; content?: string; parts?: Array<{ type: string; text: string }> }>,
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
  }),
}));

describe("ChatMessage component", () => {
  it("renders a user message with distinct styling and label", () => {
    render(<ChatMessage role="user" content="Hello there!" />);
    expect(screen.getByTestId("chat-message-user")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("renders an assistant message with distinct styling and label", () => {
    render(
      <ChatMessage
        role="assistant"
        content="I build practical AI applications."
      />
    );
    expect(screen.getByTestId("chat-message-assistant")).toBeInTheDocument();
    expect(screen.getByText("Shahzad (AI Assistant)")).toBeInTheDocument();
    expect(screen.getByText("I build practical AI applications.")).toBeInTheDocument();
  });

  it("renders formatted markdown links and bold text", () => {
    render(
      <ChatMessage
        role="assistant"
        content="Check my [Email](mailto:imshahzad000@gmail.com) and **GenAI** skills."
      />
    );
    const link = screen.getByRole("link", { name: "Email" });
    expect(link).toHaveAttribute("href", "mailto:imshahzad000@gmail.com");
    expect(screen.getByText("GenAI")).toBeInTheDocument();
  });
});

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
    cleanup();
  });

  it("renders empty state with welcome heading and suggested questions", () => {
    render(<Chat />);
    expect(screen.getByText("Ask Me Anything")).toBeInTheDocument();
    expect(screen.getByText("Tell me about your Meme Caption Generator project.")).toBeInTheDocument();
    expect(screen.getByTestId("message-counter")).toHaveTextContent("0/20 msgs");
  });

  it("submits message when clicking a suggested question", async () => {
    render(<Chat />);
    const suggestionBtn = screen.getByText(
      "Tell me about your Meme Caption Generator project."
    );
    fireEvent.click(suggestionBtn);

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "Tell me about your Meme Caption Generator project.",
    });
  });

  it("allows typing in the input and submitting via button or Enter", async () => {
    const user = userEvent.setup();
    render(<Chat />);

    const input = screen.getByTestId("chat-input");
    await user.type(input, "What are your core technical skills?");

    const sendBtn = screen.getByTestId("send-button");
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
    expect(screen.getByTestId("thinking-indicator")).toBeInTheDocument();
    expect(screen.getByText(/Shahzad is thinking/i)).toBeInTheDocument();
  });

  it("shows stop button when generation is in progress", async () => {
    mockUseChatState = {
      messages: [
        { id: "1", role: "user", content: "Tell me about your background." },
        { id: "2", role: "assistant", content: "I am a developer..." },
      ],
      status: "streaming",
      error: undefined,
    };

    render(<Chat />);
    const stopBtn = screen.getByTestId("stop-button");
    expect(stopBtn).toBeInTheDocument();

    fireEvent.click(stopBtn);
    expect(mockStop).toHaveBeenCalled();
  });

  it("displays cap reached alert when message limit (20) is reached", () => {
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
    expect(screen.getByTestId("cap-reached-banner")).toBeInTheDocument();
    expect(screen.getByTestId("message-counter")).toHaveTextContent("20/20 msgs");
    expect(screen.getByTestId("chat-input")).toBeDisabled();
  });
});
