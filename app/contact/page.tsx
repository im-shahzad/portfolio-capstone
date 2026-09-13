import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch",
};

const contactLinks = [
  { label: "Email", value: "imshahzad000@gmail.com", href: "mailto:imshahzad000@gmail.com" },
  { label: "GitHub", value: "@im-shahzad", href: "https://github.com/im-shahzad" },
  { label: "LinkedIn", value: "/in/imshahzad0101", href: "https://www.linkedin.com/in/imshahzad0101/" },
  { label: "Resume", value: "Download PDF", href: "/Shahzad_s_Resume_.pdf" },
];

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-lg px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-alt border border-accent/40 text-accent text-xs font-semibold tracking-wide uppercase">
          Contact
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          Have a question or want to work together? Drop me a message.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-3 mb-8">
        {contactLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border hover:border-accent/30 transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-text-dim uppercase tracking-wider font-semibold">{link.label}</p>
              <p className="text-sm text-text group-hover:text-accent transition-colors mt-0.5 break-all">{link.value}</p>
            </div>
            <span className="text-xs text-text-dim group-hover:text-accent transition-colors flex-shrink-0">→</span>
          </a>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-dim uppercase tracking-wider font-semibold whitespace-nowrap">or send a message</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Contact Form */}
      <ContactForm />
    </main>
  );
}
