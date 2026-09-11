"use client";

import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProjectData } from "@/components/ProjectCard";

export function ProjectModal({ data }: { data: ProjectData }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline" size="sm" />}
      >
        View full case study
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{data.name}</DialogTitle>
          <DialogDescription>{data.problem}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5">
          {data.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-accent mb-1">
              What I Did
            </p>
            <p className="text-text leading-relaxed">{data.whatIDid}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-accent mb-1">
              Outcome
            </p>
            <p className="text-text leading-relaxed">{data.outcome}</p>
          </div>
        </div>

        {data.repoLink && (
          <a
            href={data.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-accent font-medium hover:text-accent/80"
          >
            View repository
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}
