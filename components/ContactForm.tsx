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
        className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950"
      >
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
          Message sent!
        </h3>
        <p className="mt-2 text-green-700 dark:text-green-300">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", message: "" });
          }}
          className="mt-4 rounded-sm text-sm font-medium text-green-800 underline outline-none hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 dark:text-green-200"
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
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
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
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
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
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
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
          className="mt-1 block w-full resize-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="How can I help?"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Send Message
      </button>
    </form>
  );
}
