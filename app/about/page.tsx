import Link from "next/link";

const experience = [
  {
    role: "AI Engineering Intern",
    track: "Frontend AI Engineering Track",
    company: "FlyRank AI",
  },
  {
    role: "Python Developer Intern",
    company: "Learn2Earn Tech",
  },
];

export default function AboutPage() {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-alt border border-accent/40 text-accent text-xs font-semibold tracking-wide uppercase">
          About
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-text tracking-tight leading-[1.15]">
          Shahzad Saeed
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
          AI Engineer building production-ready GenAI applications.
          <span className="block mt-1 text-sm text-text-dim">Lahore, Pakistan</span>
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-10">
        <section className="space-y-4">
          <p className="text-sm sm:text-base text-text leading-relaxed">
            I&apos;m someone who enjoys building software and exploring how AI can
            make applications genuinely useful. Lately, I&apos;ve been combining
            Python with Generative AI to build projects that solve real problems,
            not just experiment with APIs — and I&apos;m especially curious about
            what it takes to turn an idea into something production-ready.
          </p>
          <p className="text-sm sm:text-base text-text leading-relaxed">
            My approach is practical: build something that works, then make it
            reliable. The MemeMind caption generator taught me that the hard part
            isn&apos;t calling an API — it&apos;s designing the UX around it so
            people actually want to use the output.
          </p>
        </section>

        {/* What I Focus On */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
            What I Focus On
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "GenAI Integration", desc: "Turning LLM prototypes into reliable, production-ready features with proper error handling and UX." },
              { title: "Practical AI UX", desc: "Designing interfaces where AI output is useful, not just impressive — tone control, comparison, history." },
              { title: "Full-Stack Reliability", desc: "Building end-to-end features that work under real conditions — rate limits, timeouts, edge cases." },
              { title: "Learning in Public", desc: "Sharing what I build and what I learn, including the honest gaps and what I&apos;d do differently." },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl bg-surface border border-border"
              >
                <p className="text-sm sm:text-base font-semibold text-accent">{item.title}</p>
                <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div
                key={exp.company}
                className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border"
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2" />
                <div>
                  <p className="text-sm sm:text-base font-semibold text-text">{exp.role}</p>
                  <p className="text-xs sm:text-sm text-accent">{exp.company}</p>
                  {exp.track && (
                    <p className="text-xs text-text-dim mt-1">{exp.track}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="pt-8 border-t border-border">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-hover transition-colors"
          >
            Get in touch →
          </Link>
        </div>
      </div>
    </main>
  );
}
