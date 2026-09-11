"use client";

import React from "react";
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";

interface FitData {
  matchingSkills: string[];
  gaps: string[];
  overallAssessment: string;
}

export function FitCardLoading() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-[#201C18] border border-[#332C24] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A241D] border border-[#D9A441]/40 text-[#D9A441]">
          <Search className="w-4 h-4 animate-pulse" />
        </div>
        <span className="text-sm text-[#A89F93] font-medium">
          Reading the job posting...
        </span>
      </div>
    </div>
  );
}

export function FitCardFetching() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-[#201C18] border border-[#332C24] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-[#D9A441] animate-spin" />
        <span className="text-sm text-[#A89F93]">Comparing against my skill set...</span>
      </div>
    </div>
  );
}

export function FitCardResult({ data }: { data: FitData }) {
  return (
    <div className="my-3 max-w-md rounded-2xl bg-[#201C18] border border-[#332C24] shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-[#352E27]/50">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A241D] border border-[#D9A441]/40 text-[#D9A441] flex-shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold font-heading text-[#F2EDE4] leading-snug">
            Job Fit Check
          </h3>
        </div>
      </div>

      {/* Body Sections */}
      <div className="px-5 py-4 space-y-4">
        {/* Matching Skills */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#7FB88F] mb-2">
            Matching Skills
          </p>
          {data.matchingSkills.length > 0 ? (
            <ul className="space-y-1.5">
              {data.matchingSkills.map((skill) => (
                <li
                  key={skill}
                  className="flex items-start gap-2 text-sm text-[#E6E0D6] leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#7FB88F] flex-shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#A89F93] italic">
              No clear overlap found with my current skill set.
            </p>
          )}
        </div>

        {/* Gaps */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#D9A441] mb-2">
            Gaps
          </p>
          {data.gaps.length > 0 ? (
            <ul className="space-y-1.5">
              {data.gaps.map((gap) => (
                <li
                  key={gap}
                  className="flex items-start gap-2 text-sm text-[#E6E0D6] leading-relaxed"
                >
                  <Circle className="w-3.5 h-3.5 text-[#D9A441] flex-shrink-0 mt-1" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#A89F93] italic">
              Nothing obvious this posting asks for that I&apos;m missing.
            </p>
          )}
        </div>

        {/* Overall Assessment */}
        <div className="pt-1 border-t border-[#352E27]/50">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#D9A441] mb-1">
            Overall Assessment
          </p>
          <p className="text-sm text-[#E6E0D6] leading-relaxed">
            {data.overallAssessment}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FitCardError() {
  return (
    <div className="my-2 max-w-sm rounded-2xl bg-[#201C18] border border-[#332C24] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A241D] border border-[#8A8175]/40 text-[#A89F93]">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm text-[#A89F93] font-medium">
            Couldn&apos;t check the job fit right now.
          </p>
          <p className="text-xs text-[#968C7F] mt-0.5">
            Feel free to paste the description again or ask me anything else.
          </p>
        </div>
      </div>
    </div>
  );
}
