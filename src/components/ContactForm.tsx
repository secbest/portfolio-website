"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_LIMITS, CONTACT_TOPICS, validateContact, type ContactTopic } from "@/lib/contact";

const field =
  "w-full border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted focus:border-accent";

type Status = "idle" | "sending" | "sent" | "error";

/** Posts to /api/contact, which emails the message to the site owner. */
export default function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState("");
  const [topic, setTopic] = useState<ContactTopic>("Internship");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const data = validateContact({ ...raw, topic });
    if (!data) {
      setProblem("Please check your name, email and message.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: raw.website }),
      });
      if (res.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      const { error } = (await res.json().catch(() => ({}))) as { error?: string };
      setProblem(
        error === "rate_limited"
          ? "Too many messages from this connection. Please try again later."
          : error === "invalid"
            ? "Please check your name, email and message."
            : "Your message couldn't be sent.",
      );
    } catch {
      setProblem("Your message couldn't be sent. Check your connection.");
    }
    setStatus("error");
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-accent/30 bg-accent/5 p-8">
        <p className="mb-2 font-mono text-sm text-accent">{"// message sent"}</p>
        <p className="text-2xl font-semibold tracking-tight">Thanks for reaching out.</p>
        <p className="mt-3 text-muted">I&apos;ll reply to the email you gave as soon as I can.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-accent underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <label className="block">
        <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-muted">Name</span>
        <input
          name="name"
          required
          maxLength={CONTACT_LIMITS.name}
          autoComplete="name"
          placeholder="Your name"
          className={field}
        />
      </label>
      <label className="block">
        <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={CONTACT_LIMITS.email}
          autoComplete="email"
          placeholder="you@example.com"
          className={field}
        />
      </label>

      <fieldset>
        <legend className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">What is it about?</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={t}
                checked={topic === t}
                onChange={() => setTopic(t)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:border-accent/60">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-muted">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          placeholder="Your message"
          className={field}
        />
      </label>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-black transition-opacity disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p role="alert" aria-live="assertive" className="text-sm text-red-400">
          {status === "error" && (
            <>
              {problem}{" "}
              <a href={`mailto:${email}`} className="underline underline-offset-4">
                Email me directly
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  );
}
