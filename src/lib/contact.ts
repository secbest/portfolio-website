export const CONTACT_TOPICS = ["Internship", "Collaboration", "Project", "Other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const CONTACT_LIMITS = { name: 80, email: 120, message: 2000 } as const;

export type ContactPayload = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared by the form and the API route so both enforce the same rules. */
export function validateContact(input: Partial<Record<keyof ContactPayload, unknown>>): ContactPayload | null {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const topic = String(input.topic ?? "Other") as ContactTopic;
  const message = String(input.message ?? "").trim();

  if (!name || name.length > CONTACT_LIMITS.name) return null;
  if (!EMAIL.test(email) || email.length > CONTACT_LIMITS.email) return null;
  if (!CONTACT_TOPICS.includes(topic)) return null;
  if (!message || message.length > CONTACT_LIMITS.message) return null;
  return { name, email, topic, message };
}
