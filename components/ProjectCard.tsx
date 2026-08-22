"use client";

import React from "react";
import {
  ExternalLink,
  AlertTriangle,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

interface ProjectData {
  name: string;
  techStack: string[];
  problem: string;
  whatIDid: string;
  outcome: string;
  repoLink: string;
}

export function ProjectCardLoading() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-[#201C18] border border-[#332C24] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A241D] border border-[#D9A441]/40 text-[#D9A441]">
          <Search className="w-4 h-4 animate-pulse" />
        </div>
        <span className="text-sm text-[#A89F93] font-medium">
          Looking up project details...
        </span>
      </div>
    </div>
  );
}

export function ProjectCardFetching() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-[#201C18] border border-[#332C24] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-[#D9A441] animate-spin" />
        <span className="text-sm text-[#A89F93]">Fetching...</span>
      </div>
    </div>
  );
}

export function ProjectCardResult({ data }: { data: ProjectData }) {
  return (
    <div className="my-3 max-w-md rounded-2xl bg-[#201C18] border border-[#332C24] shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-[#352E27]/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A241D] border border-[#D9A441]/40 text-[#D9A441] flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-heading text-[#F2EDE4] leading-snug">
              {data.name}
            </h3>
          </div>
          {data.repoLink && (
            <a
              href={data.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#D9A441] hover:text-[#F3C46C] transition-colors font-medium mt-1 flex-shrink-0"
            >
              Repo
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {data.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#2A241D] border border-[#D9A441]/30 text-[#D9A441]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Body Sections */}
      <div className="px-5 py-4 space-y-4">
        <Section label="Problem" text={data.problem} />
        <Section label="What I Did" text={data.whatIDid} />
        <Section label="Outcome" text={data.outcome} />
      </div>
    </div>
  );
}

export function ProjectCardError() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-[#201C18] border border-[#332C24] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A241D] border border-[#8A8175]/40 text-[#A89F93]">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm text-[#A89F93] font-medium">
            Couldn&apos;t load project details right now.
          </p>
          <p className="text-xs text-[#7E7569] mt-0.5">
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
      <p className="text-[11px] uppercase tracking-wider font-semibold text-[#D9A441] mb-1">
        {label}
      </p>
      <p className="text-sm text-[#E6E0D6] leading-relaxed">{text}</p>
    </div>
  );
}
