"use client";

import React from "react";
import { User, Sparkles, Copy, Check } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
}

/**
 * Format markdown-like text elements (bold, links, code, bullet lists, paragraphs).
 */
function FormattedText({ content }: { content: string }) {
  // Split into lines or paragraphs
  const paragraphs = content.split("\n\n");

  return (
    <div className="space-y-3 leading-relaxed text-[15px] sm:text-base break-words">
      {paragraphs.map((para, pIdx) => {
        // Handle code block
        if (para.startsWith("```") && para.endsWith("```")) {
          const lines = para.split("\n");
          const code = lines.slice(1, -1).join("\n");
          return (
            <pre
              key={pIdx}
              className="p-3 my-2 rounded-lg bg-background border border-border text-xs sm:text-sm font-mono overflow-x-auto text-text"
            >
              <code>{code}</code>
            </pre>
          );
        }

        // Handle unordered lists
        const lines = para.split("\n");
        const isList = lines.every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* ") || /^\d+\.\s/.test(line.trim()));

        if (isList) {
          return (
            <ul key={pIdx} className="list-disc list-inside space-y-1.5 pl-1 my-2">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[-*]\s+|\d+\.\s+/, "");
                return (
                  <li key={lIdx} className="text-text">
                    <InlineFormatted text={cleanLine} />
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p key={pIdx} className="text-text/95">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                <InlineFormatted text={line} />
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses inline formatting: **bold**, `code`, [links](url)
 */
function InlineFormatted({ text }: { text: string }) {
  // Match links [text](url), bold **text**, and inline code `code`
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;

        // Link: [label](href)
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          return (
            <a
              key={index}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-accent underline underline-offset-4 font-medium hover:text-accent/80 transition-colors"
            >
              {label}
            </a>
          );
        }

        // Bold: **text**
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }

        // Inline code: `text`
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={index}
              className="px-1.5 py-0.5 rounded bg-background border border-border text-xs font-mono text-accent"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export default function ChatMessage({
  role,
  content,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-testid={`chat-message-${role}`}
      className={`group relative flex w-full gap-3 sm:gap-4 py-3 transition-colors ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent/10 border border-accent/40 text-accent shadow-sm mt-0.5"
        >
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`relative max-w-[85%] sm:max-w-[78%] md:max-w-[72%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm transition-all duration-200 ${
          isUser
            ? "bg-muted border border-border text-text rounded-br-sm"
            : "bg-card border border-border text-text rounded-bl-sm"
        }`}
      >
        {/* Header/Label */}
        <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-border/50 text-xs">
          <span
            className={`font-semibold tracking-wide flex items-center gap-1.5 ${
              isUser ? "text-accent" : "text-accent"
            }`}
          >
            {isUser ? "You" : "Shahzad (AI Assistant)"}
          </span>

          {!isUser && content && !isStreaming && (
            <button
              onClick={handleCopy}
              title="Copy answer"
              aria-label={copied ? "Answer copied to clipboard" : "Copy answer to clipboard"}
              className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-1 -mr-1 rounded outline-none hover:bg-muted text-muted-foreground hover:text-text focus-visible:ring-2 focus-visible:ring-accent"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Message Content */}
        <FormattedText content={content} />

        {/* Streaming subtle cursor */}
        {isStreaming && (
          <span
            aria-hidden="true"
            className="inline-block w-2 h-4 ml-1 align-middle bg-accent animate-pulse rounded-xs"
          />
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          aria-hidden="true"
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted border border-border text-text shadow-sm mt-0.5"
        >
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
