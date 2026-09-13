"use client";

import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(data: FormData): Errors {
    const errs: Errors = {};
    if (!data.name.trim()) errs.name = "Name is required";
    if (!data.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!data.message.trim()) errs.message = "Message is required";
    return errs;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-success/30 bg-success/10 p-6 text-center"
      >
        <h3 className="text-lg font-semibold text-success">
          Message sent!
        </h3>
        <p className="mt-2 text-success/80">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", message: "" });
          }}
          className="mt-4 rounded-sm text-sm font-medium text-success underline outline-none hover:text-success/70 focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" data-testid="contact-form">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-text-muted"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="mt-1 block w-full rounded-md border border-border bg-surface-inset px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-dim outline-none focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-xs text-error">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="mt-1 block w-full rounded-md border border-border bg-surface-inset px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-dim outline-none focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-error">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-text-muted"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="mt-1 block w-full resize-none rounded-md border border-border bg-surface-inset px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-dim outline-none focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="How can I help?"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-xs text-error">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg shadow-sm transition-all hover:brightness-110 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Send Message
      </button>
    </form>
  );
}
