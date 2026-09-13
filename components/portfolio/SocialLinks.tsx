"use client";

import React from "react";
import { Globe, Link2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "https://github.com/im-shahzad", label: "GitHub", icon: Globe },
  { href: "https://www.linkedin.com/in/imshahzad0101/", label: "LinkedIn", icon: Link2 },
  { href: "mailto:imshahzad000@gmail.com", label: "Email", icon: Mail },
];

interface SocialLinksProps {
  className?: string;
}

export default function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={link.label}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl",
              "border border-border-subtle bg-surface hover:bg-surface-hover",
              "text-text-muted hover:text-accent hover:border-accent/40",
              "transition-all duration-200 outline-none",
              "focus-visible:ring-2 focus-visible:ring-accent"
            )}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
