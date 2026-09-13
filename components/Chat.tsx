"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Square,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ArrowDown,
  Info,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import SendButton from "./SendButton";
import {
  ProjectCardLoading,
  ProjectCardFetching,
  ProjectCardResult,
  ProjectCardError,
} from "./ProjectCard";
import {
  FitCardLoading,
  FitCardFetching,
  FitCardResult,
  FitCardError,
} from "./FitCard";
import {
  MAX_MESSAGES_PER_CONVERSATION,
  SUGGESTED_QUESTIONS,
} from "@/lib/chatConfig";

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

  const lastMessage = messages[messages.length - 1];
  const lastMessageText = lastMessage ? getMessageContent(lastMessage) : "";
  const isThinking =
    status === "submitted" ||
    (status === "streaming" &&
      lastMessage?.role === "assistant" &&
      lastMessageText.trim().length === 0);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(distanceFromBottom < 60);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [messages, status, isAtBottom, isGenerating, isThinking]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
    setIsAtBottom(true);
  };

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
    <div className="flex flex-col w-full max-w-3xl mx-auto h-[640px] sm:h-[700px] bg-bg border border-border rounded-2xl shadow-xl overflow-hidden font-body text-text">
      {/* Header Bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-surface border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-alt border border-accent/50 text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-text font-heading leading-none">
              Portfolio AI Assistant
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Powered by Google Gemini Flash-Lite
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            data-testid="message-counter"
            title="Conversation length cap (protects free tier quota)"
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              isCapReached
                ? "bg-rose-950/60 border-rose-700/50 text-rose-300"
                : messageCount > 14
                ? "bg-amber-950/60 border-amber-600/50 text-amber-300"
                : "bg-surface-alt border-border-subtle text-text-muted"
            }`}
          >
            {messageCount}/{MAX_MESSAGES_PER_CONVERSATION} msgs
          </span>

          {messages.length > 0 && (
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              aria-label="Reset conversation"
              className="p-1.5 rounded-lg text-text-muted outline-none hover:text-text hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent transition-colors"
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
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Chat conversation"
        className="relative flex-1 overflow-y-auto overscroll-y-contain px-3 sm:px-6 py-4 space-y-2 scroll-smooth"
      >
        {/* Empty State / Welcome Suggestions */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-surface-alt border border-accent/40 flex items-center justify-center text-accent mb-4 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-text mb-2">
              Ask Me Anything
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
              I can answer questions about my engineering background, AI projects like the Meme Caption Generator, and why I&apos;m seeking an AI Engineering internship.
            </p>

            <div className="w-full space-y-2 text-left">
              <p className="text-xs uppercase tracking-wider font-semibold text-accent pl-1">
                Suggested Questions
              </p>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmitMessage(question)}
                    disabled={isGenerating}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-surface-inset hover:bg-surface-raised border border-border-subtle hover:border-accent/40 text-xs sm:text-sm text-text outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-150 flex items-center justify-between group"
                  >
                    <span>{question}</span>
                    <Sparkles className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
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

                if (toolName !== "getProjectInfo" && toolName !== "checkJobFit") {
                  return null;
                }

                const state = (part as Record<string, unknown>).state as
                  | string
                  | undefined;
                const output = (part as Record<string, unknown>).output as
                  | Record<string, unknown>
                  | undefined;
                const errorText = (part as Record<string, unknown>).errorText as
                  | string
                  | undefined;

                if (toolName === "checkJobFit") {
                  if (state === "input-streaming") {
                    return <FitCardLoading key={`tool-${i}`} />;
                  }
                  if (state === "input-available") {
                    return <FitCardFetching key={`tool-${i}`} />;
                  }
                  if (state === "output-available" && output) {
                    if (output.error) return <FitCardError key={`tool-${i}`} />;
                    return (
                      <FitCardResult
                        key={`tool-${i}`}
                        data={{
                          matchingSkills: output.matchingSkills as string[],
                          gaps: output.gaps as string[],
                          overallAssessment: output.overallAssessment as string,
                        }}
                      />
                    );
                  }
                  if (state === "output-error" || errorText) {
                    return <FitCardError key={`tool-${i}`} />;
                  }
                  return <FitCardLoading key={`tool-${i}`} />;
                }

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

        {/* Thinking Indicator */}
        {isThinking && (
          <div
            data-testid="thinking-indicator"
            className="flex items-center gap-3 py-3"
          >
            <div className="w-8 h-8 rounded-full bg-surface-alt border border-accent/40 flex items-center justify-center text-accent flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-surface-inset border border-border-subtle rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-3">
              <span className="text-xs sm:text-sm text-accent font-medium">
                Shahzad is thinking
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Floating "Scroll to Bottom" button */}
      {showScrollToBottom && (
        <div className="relative w-full flex justify-center -mt-10 mb-2 z-10">
          <button
            onClick={scrollToBottom}
            data-testid="scroll-to-bottom-btn"
            aria-label="Scroll to bottom of conversation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-accent/50 text-xs text-text shadow-lg outline-none hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent transition-all animate-bounce"
          >
            <span>Scroll to bottom</span>
            <ArrowDown className="w-3.5 h-3.5 text-accent" />
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
            className="flex items-center gap-1.5 rounded-sm text-xs text-rose-400 outline-none hover:text-rose-200 focus-visible:ring-2 focus-visible:ring-rose-400 font-medium ml-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Retry
          </button>
        </div>
      )}

      {/* Conversation Cap Alert */}
      {isCapReached && (
        <div
          data-testid="cap-reached-banner"
          className="mx-3 sm:mx-6 mb-2 p-3 rounded-xl bg-surface-alt border border-accent/40 text-xs sm:text-sm text-text flex items-start gap-2.5"
        >
          <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>
              Conversation limit reached ({MAX_MESSAGES_PER_CONVERSATION} messages). To protect the free tier quota, click{" "}
              <button
                onClick={handleResetChat}
                className="rounded-sm text-accent font-semibold underline underline-offset-2 outline-none hover:text-accent-hover focus-visible:ring-2 focus-visible:ring-accent"
              >
                Reset
              </button>{" "}
              or email me directly at{" "}
              <a
                href="mailto:imshahzad000@gmail.com"
                className="text-accent font-semibold underline underline-offset-2 hover:text-accent-hover"
              >
                imshahzad000@gmail.com
              </a>
              .
            </span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <footer className="p-3 sm:p-4 bg-surface border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitMessage();
          }}
          className="relative flex items-end gap-2 bg-surface-inset border border-border-subtle focus-within:border-accent/70 focus-within:ring-1 focus-within:ring-accent/50 rounded-xl p-1.5 sm:p-2 transition-all"
        >
          <textarea
            ref={textareaRef}
            data-testid="chat-input"
            aria-label="Message the AI assistant"
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
            className="flex-1 bg-transparent border-0 resize-none px-2.5 py-1.5 text-[16px] sm:text-sm text-text placeholder-text-dim focus:outline-hidden disabled:opacity-50 min-h-[38px] max-h-[140px] overflow-y-auto leading-relaxed"
          />

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isGenerating ? (
              <button
                type="button"
                onClick={stop}
                data-testid="stop-button"
                title="Stop generating"
                aria-label="Stop generating response"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-raised hover:bg-surface-hover text-accent border border-accent/40 text-xs sm:text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all min-h-[40px] shadow-sm active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="hidden xs:inline">Stop</span>
              </button>
            ) : (
              <SendButton
                disabled={!inputText.trim() || isCapReached}
                onSend={async () => {
                  await handleSubmitMessage();
                }}
              />
            )}
          </div>
        </form>

        <p className="text-[11px] text-center text-text-faint mt-2 hidden sm:block">
          Press <kbd className="px-1 py-0.5 rounded bg-surface-alt border border-border-subtle text-[10px] font-mono text-accent">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-surface-alt border border-border-subtle text-[10px] font-mono text-accent">Shift + Enter</kbd> for a new line.
        </p>
      </footer>
    </div>
  );
}
