"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Send,
  Square,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ArrowDown,
  Info,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import {
  ProjectCardLoading,
  ProjectCardFetching,
  ProjectCardResult,
  ProjectCardError,
} from "./ProjectCard";
import {
  MAX_MESSAGES_PER_CONVERSATION,
  SUGGESTED_QUESTIONS,
} from "@/lib/chatConfig";

/**
 * Extract plain text content from a message (whether simple string content or structured parts).
 */
function getMessageContent(msg: {
  content?: string;
  parts?: Array<{ type?: string; text?: string }>;
}): string {
  if (typeof msg.content === "string" && msg.content.length > 0) {
    return msg.content;
  }
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }
  return "";
}

export default function Chat() {
  const [inputText, setInputText] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
    error,
    clearError,
    regenerate,
  } = useChat();

  const isGenerating = status === "submitted" || status === "streaming";
  const messageCount = messages.length;
  const isCapReached = messageCount >= MAX_MESSAGES_PER_CONVERSATION;
  const showScrollToBottom = !isAtBottom && messages.length > 0;

  // Determine if assistant is currently in thinking phase (submitted or streaming with no text tokens yet)
  const lastMessage = messages[messages.length - 1];
  const lastMessageText = lastMessage ? getMessageContent(lastMessage) : "";
  const isThinking =
    status === "submitted" ||
    (status === "streaming" &&
      lastMessage?.role === "assistant" &&
      lastMessageText.trim().length === 0);

  /**
   * Track manual scroll vs auto-scroll.
   * If the user scrolls up by more than 60px from the bottom, disable auto-scroll.
   */
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    setIsAtBottom(distanceFromBottom < 60);
  }, []);

  /**
   * Auto-scroll to the bottom only if user is at bottom.
   */
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [messages, status, isAtBottom, isGenerating, isThinking]);

  /**
   * Timeout guard: if status stays "submitted" for 20s without any data arriving,
   * abort the request and surface the error banner so the user can retry.
   */
  const TIMEOUT_MS = 30_000;

  useEffect(() => {
    if (status === "submitted") {
      const timer = setTimeout(() => {
        stop();
        setTimedOut(true);
      }, TIMEOUT_MS);
      return () => clearTimeout(timer);
    }
  }, [status, stop]);

  /**
   * Scroll down manually when clicking the floating pill.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
    setIsAtBottom(true);
  };

  /**
   * Auto-resize textarea to fit multi-line questions up to a max height.
   */
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    adjustTextareaHeight();
  };

  /**
   * Handle message submission.
   */
  const handleSubmitMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text || isGenerating || isCapReached) return;

    setInputText("");
    setTimedOut(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await sendMessage({ text });
      setIsAtBottom(true);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage();
    }
  };

  const handleResetChat = () => {
    stop();
    setMessages([]);
    clearError?.();
    setTimedOut(false);
    setInputText("");
  };

  const isRetryingRef = useRef(false);

  const handleRetry = async () => {
    if (isRetryingRef.current || isGenerating) return;
    isRetryingRef.current = true;
    try {
      setTimedOut(false);
      clearError?.();
      await regenerate();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      isRetryingRef.current = false;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-[640px] sm:h-[700px] bg-[#1C1917] border border-[#2F2923] rounded-2xl shadow-2xl overflow-hidden font-body text-[#F2EDE4]">
      {/* Header Bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#231F1B] border-b border-[#2F2923]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2E271F] border border-[#D9A441]/50 text-[#D9A441]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[#F2EDE4] font-heading leading-none">
              Portfolio AI Assistant
            </h2>
            <p className="text-xs text-[#A89F93] mt-0.5">
              Powered by Google Gemini Flash-Lite
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Conversation Cap Indicator */}
          <span
            data-testid="message-counter"
            title="Conversation length cap (protects free tier quota)"
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              isCapReached
                ? "bg-rose-950/60 border-rose-700/50 text-rose-300"
                : messageCount > 14
                ? "bg-amber-950/60 border-amber-600/50 text-amber-300"
                : "bg-[#2A241E] border-[#3C342A] text-[#B8AF9F]"
            }`}
          >
            {messageCount}/{MAX_MESSAGES_PER_CONVERSATION} msgs
          </span>

          {/* Reset Conversation Button */}
          {messages.length > 0 && (
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              aria-label="Reset conversation"
              className="p-1.5 rounded-lg text-[#A89F93] hover:text-[#F2EDE4] hover:bg-[#2F2923] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Messages Scrollable Viewport */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        data-testid="chat-messages-container"
        className="relative flex-1 overflow-y-auto overscroll-y-contain px-3 sm:px-6 py-4 space-y-2 scroll-smooth"
      >
        {/* Empty State / Welcome Suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#2A241D] border border-[#D9A441]/40 flex items-center justify-center text-[#D9A441] mb-4 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-[#F2EDE4] mb-2">
              Ask Me Anything
            </h3>
            <p className="text-xs sm:text-sm text-[#A89F93] mb-6 leading-relaxed">
              I can answer questions about my engineering background, AI projects like the Meme Caption Generator, and why I&apos;m seeking an AI Engineering internship.
            </p>

            <div className="w-full space-y-2 text-left">
              <p className="text-xs uppercase tracking-wider font-semibold text-[#D9A441] pl-1">
                Suggested Questions
              </p>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmitMessage(question)}
                    disabled={isGenerating}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#241F1A] hover:bg-[#2E2822] border border-[#352E26] hover:border-[#D9A441]/40 text-xs sm:text-sm text-[#E6E0D6] transition-all duration-150 flex items-center justify-between group"
                  >
                    <span>{question}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg, index) => {
          const content = getMessageContent(msg);
          const isLastMessage = index === messages.length - 1;
          const isStreamingMessage =
            isLastMessage && status === "streaming" && msg.role === "assistant";

          // If it's an empty assistant message during initial generation, let the thinking indicator render instead
          if (msg.role === "assistant" && !content && isThinking) {
            return null;
          }

          const toolParts = Array.isArray(msg.parts)
            ? msg.parts.filter(
                (p) =>
                  (typeof p.type === "string" && p.type.startsWith("tool-")) ||
                  p.type === "dynamic-tool"
              )
            : [];

          return (
            <React.Fragment key={msg.id || index}>
              {content && (
                <ChatMessage
                  role={msg.role as "user" | "assistant" | "system"}
                  content={content}
                  isStreaming={isStreamingMessage}
                />
              )}
              {toolParts.map((part, i) => {
                const toolName =
                  part.type === "dynamic-tool"
                    ? (part as { toolName?: string }).toolName
                    : typeof part.type === "string" && part.type.startsWith("tool-")
                      ? part.type.slice(5)
                      : undefined;

                if (toolName !== "getProjectInfo") return null;

                const state = (part as Record<string, unknown>).state as
                  | string
                  | undefined;
                const output = (part as Record<string, unknown>).output as
                  | Record<string, unknown>
                  | undefined;
                const errorText = (part as Record<string, unknown>).errorText as
                  | string
                  | undefined;

                if (state === "input-streaming") {
                  return <ProjectCardLoading key={`tool-${i}`} />;
                }

                if (state === "input-available") {
                  return <ProjectCardFetching key={`tool-${i}`} />;
                }

                if (state === "output-available" && output) {
                  if (output.error) return <ProjectCardError key={`tool-${i}`} />;
                  return (
                    <ProjectCardResult
                      key={`tool-${i}`}
                      data={{
                        name: output.name as string,
                        techStack: output.techStack as string[],
                        problem: output.problem as string,
                        whatIDid: output.whatIDid as string,
                        outcome: output.outcome as string,
                        repoLink: output.repoLink as string,
                      }}
                    />
                  );
                }

                if (state === "output-error" || errorText) {
                  return <ProjectCardError key={`tool-${i}`} />;
                }

                return <ProjectCardLoading key={`tool-${i}`} />;
              })}
            </React.Fragment>
          );
        })}

        {/* Thinking Indicator (shown before first token arrives) */}
        {isThinking && (
          <div
            data-testid="thinking-indicator"
            className="flex items-center gap-3 py-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#2A241D] border border-[#D9A441]/40 flex items-center justify-center text-[#D9A441] flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[#201C18] border border-[#332C24] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-3">
              <span className="text-xs sm:text-sm text-[#D9A441] font-medium">
                Shahzad is thinking
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Floating "Scroll to Bottom" button */}
      {showScrollToBottom && (
        <div className="relative w-full flex justify-center -mt-10 mb-2 z-10">
          <button
            onClick={scrollToBottom}
            data-testid="scroll-to-bottom-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2B251E] border border-[#D9A441]/50 text-xs text-[#F2EDE4] shadow-lg hover:bg-[#383027] transition-all animate-bounce"
          >
            <span>Scroll to bottom</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#D9A441]" />
          </button>
        </div>
      )}

      {/* Error Alert Bar */}
      {(error || timedOut) && (
        <div
          data-testid="chat-error-banner"
          className="mx-3 sm:mx-6 mb-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs sm:text-sm text-rose-200 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">
            <span className="font-semibold">Error:</span>{" "}
            {timedOut && !error
              ? "Response timed out. The server took too long to respond."
              : error?.message || "Failed to generate AI response. Please try again."}
          </div>
          <button
            onClick={handleRetry}
            disabled={isGenerating}
            data-testid="retry-button"
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-200 font-medium ml-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Retry
          </button>
        </div>
      )}

      {/* Conversation Cap Alert */}
      {isCapReached && (
        <div
          data-testid="cap-reached-banner"
          className="mx-3 sm:mx-6 mb-2 p-3 rounded-xl bg-[#2A2219] border border-[#D9A441]/40 text-xs sm:text-sm text-[#E8DFC9] flex items-start gap-2.5"
        >
          <Info className="w-4 h-4 text-[#D9A441] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>
              Conversation limit reached ({MAX_MESSAGES_PER_CONVERSATION} messages). To protect the free tier quota, click{" "}
              <button
                onClick={handleResetChat}
                className="text-[#D9A441] font-semibold underline underline-offset-2 hover:text-[#F3C46C]"
              >
                Reset
              </button>{" "}
              or email me directly at{" "}
              <a
                href="mailto:imshahzad000@gmail.com"
                className="text-[#D9A441] font-semibold underline underline-offset-2 hover:text-[#F3C46C]"
              >
                imshahzad000@gmail.com
              </a>
              .
            </span>
          </div>
        </div>
      )}

      {/* Input Area (Mobile-friendly, responsive) */}
      <footer className="p-3 sm:p-4 bg-[#231F1B] border-t border-[#2F2923]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitMessage();
          }}
          className="relative flex items-end gap-2 bg-[#191614] border border-[#383129] focus-within:border-[#D9A441]/70 focus-within:ring-1 focus-within:ring-[#D9A441]/50 rounded-xl p-1.5 sm:p-2 transition-all"
        >
          {/* Multi-line auto-growing textarea */}
          <textarea
            ref={textareaRef}
            data-testid="chat-input"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isCapReached}
            placeholder={
              isCapReached
                ? "Session limit reached. Reset to ask another question."
                : "Ask about my projects, GenAI engineering, or background... (Enter to send)"
            }
            rows={1}
            className="flex-1 bg-transparent border-0 resize-none px-2.5 py-1.5 text-[16px] sm:text-sm text-[#F2EDE4] placeholder-[#8A8175] focus:outline-hidden disabled:opacity-50 min-h-[38px] max-h-[140px] overflow-y-auto leading-relaxed"
          />

          {/* Action Buttons: Stop button during generation, Send button otherwise */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isGenerating ? (
              <button
                type="button"
                onClick={stop}
                data-testid="stop-button"
                title="Stop generating"
                aria-label="Stop generating response"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#3A2C21] hover:bg-[#4A382B] text-[#D9A441] border border-[#D9A441]/40 text-xs sm:text-sm font-semibold transition-all min-h-[40px] shadow-sm active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="hidden xs:inline">Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim() || isCapReached}
                data-testid="send-button"
                title="Send message"
                aria-label="Send message"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#D9A441] text-[#1C1917] hover:bg-[#E5B255] disabled:opacity-30 disabled:hover:bg-[#D9A441] disabled:cursor-not-allowed transition-all font-bold min-h-[40px] min-w-[40px] shadow-sm active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <p className="text-[11px] text-center text-[#7E7569] mt-2 hidden sm:block">
          Press <kbd className="px-1 py-0.5 rounded bg-[#2A241E] border border-[#3C342A] text-[10px] font-mono text-[#D9A441]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-[#2A241E] border border-[#3C342A] text-[10px] font-mono text-[#D9A441]">Shift + Enter</kbd> for a new line.
        </p>
      </footer>
    </div>
  );
}
