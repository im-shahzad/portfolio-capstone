"use client";

import React from "react";
import {
  ExternalLink,
  AlertTriangle,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "@/components/ProjectModal";

export interface ProjectData {
  name: string;
  techStack: string[];
  problem: string;
  whatIDid: string;
  outcome: string;
  repoLink: string;
}

export function ProjectCardLoading() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-card border border-border p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 border border-accent/40 text-accent">
          <Search className="w-4 h-4 animate-pulse" />
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          Looking up project details...
        </span>
      </div>
    </div>
  );
}

export function ProjectCardFetching() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-card border border-border p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-accent animate-spin" />
        <span className="text-sm text-muted-foreground">Fetching...</span>
      </div>
    </div>
  );
}

export function ProjectCardResult({ data }: { data: ProjectData }) {
  return (
    <div className="my-3 max-w-md rounded-2xl bg-card border border-border shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 border border-accent/40 text-accent flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-heading text-text leading-snug">
              {data.name}
            </h3>
          </div>
          {data.repoLink && (
            <a
              href={data.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${data.name} repository (opens in a new tab)`}
              className="flex items-center gap-1 rounded-sm text-xs text-accent outline-none hover:text-accent/80 focus-visible:ring-2 focus-visible:ring-accent transition-colors font-medium mt-1 flex-shrink-0"
            >
              Repo
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {data.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </div>

      {/* Body Sections */}
      <div className="px-5 py-4 space-y-4">
        <Section label="Problem" text={data.problem} />
        <Section label="What I Did" text={data.whatIDid} />
        <Section label="Outcome" text={data.outcome} />
        <ProjectModal data={data} />
      </div>
    </div>
  );
}

export function ProjectCardError() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-card border border-border p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border border-border text-muted-foreground">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">
            Couldn&apos;t load project details right now.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Feel free to ask me anything else.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-accent mb-1">
        {label}
      </p>
      <p className="text-sm text-text leading-relaxed">{text}</p>
    </div>
  );
}
