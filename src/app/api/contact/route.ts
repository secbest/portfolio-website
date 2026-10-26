import { validateContact } from "@/lib/contact";
import { profile } from "@/data/profile";

export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort limiter: each serverless instance keeps its own counts.
const hits = new Map<string, number[]>();

const recentHits = (ip: string) => (hits.get(ip) ?? []).filter((t) => Date.now() - t < WINDOW_MS);
const limited = (ip: string) => recentHits(ip).length >= MAX_PER_WINDOW;
const record = (ip: string) => hits.set(ip, [...recentHits(ip), Date.now()]);

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "invalid" }, { status: 400 });

  // Bots fill the hidden field; pretend it worked so they don't retry.
  if (body.website) return Response.json({ ok: true });

  const data = validateContact(body);
  if (!data) return Response.json({ error: "invalid" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "not_configured" }, { status: 503 });

  // Only emails that actually went out count towards the limit.
  if (limited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [profile.email],
      reply_to: data.email,
      subject: oneLine(`[Portfolio] ${data.topic}: ${data.name}`),
      text: `From: ${oneLine(data.name)} <${data.email}>\nTopic: ${data.topic}\n\n${data.message}`,
    }),
  }).catch(() => null);

  if (!res?.ok) return Response.json({ error: "send_failed" }, { status: 502 });
  record(ip);
  return Response.json({ ok: true });
}
