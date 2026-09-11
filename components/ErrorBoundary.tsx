"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: (reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.reset);
      return (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center">
          <AlertCircle className="size-6 text-rose-400" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Something went wrong loading the chat.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="text-sm text-accent underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
