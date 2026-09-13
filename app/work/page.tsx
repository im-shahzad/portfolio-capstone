import Link from "next/link";

const projects = [
  {
    id: "privyland",
    title: "Privyland",
    year: "2026",
    featured: true,
    description: "A modern tool and utility platform built with the latest web stack.",
    techStack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://privyland.vercel.app",
  },
  {
    id: "mememind",
    title: "MemeMind – AI Meme Caption Generator",
    year: "2026",
    featured: true,
    description: "AI-powered meme caption generator with tone control, generation history, and side-by-side comparison.",
    techStack: ["Python", "Streamlit", "Google Gemini API", "Generative AI"],
    repo: "https://github.com/im-shahzad/MemeMind",
  },
  {
    id: "typing-master-lite",
    title: "Typing Master Lite",
    year: "2025",
    featured: true,
    description: "A lightweight desktop typing tutor built with Python for learning and practicing touch typing.",
    techStack: ["Python", "Tkinter"],
    repo: "https://github.com/im-shahzad/Typing-Master-Lite",
  },
];

export default function WorkPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-alt border border-accent/40 text-accent text-xs font-semibold tracking-wide uppercase">
          Work
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-text tracking-tight leading-[1.15]">
          Projects
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
          A selection of projects I&apos;ve built — from AI-powered tools to desktop utilities.
        </p>
      </div>

      {/* Project List */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-5 sm:p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold font-heading text-text">
                    {project.title}
                  </h2>
                  <span className="text-xs text-text-dim font-mono">{project.year}</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-alt border border-accent/20 text-accent"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
              {"liveUrl" in project && project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent font-medium hover:text-accent-hover transition-colors"
                >
                  Visit live site →
                </a>
              )}
              {"repo" in project && project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-text-muted font-medium hover:text-accent transition-colors"
                >
                  View on GitHub →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 pt-8 border-t border-border">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-hover transition-colors"
        >
          More about me →
        </Link>
      </div>
    </main>
  );
}
