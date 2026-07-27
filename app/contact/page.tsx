import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-6 py-24">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Contact
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Have a question or want to work together? Drop me a message.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
