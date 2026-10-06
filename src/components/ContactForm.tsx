"use client";

import type { FormEvent } from "react";

const field =
  "w-full border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted focus:border-accent";

/** Opens the visitor's email client; no backend needed. */
export default function ContactForm({ email }: { email: string }) {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <label className="block">
        <span className="sr-only">Your name</span>
        <input name="name" required placeholder="Your name" className={field} />
      </label>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Your message"
          className={field}
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-black"
      >
        Send message
      </button>
    </form>
  );
}
