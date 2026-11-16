import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Where enquiries go. Pick with the ENQUIRY_STORE env var:
 *   json     – append to data/enquiries.json (default; local/self-hosted only —
 *              Vercel's filesystem is read-only, so use one of the others there)
 *   resend   – email via Resend (RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM)
 *   webhook  – POST JSON to ENQUIRY_WEBHOOK_URL (Zapier, Make, Slack, a CRM…)
 *   console  – just log it (useful for previews)
 * To add another destination, write a function with the same signature and
 * register it in `stores`.
 */
export interface Enquiry {
  type: "viewing" | "enquiry" | "contact";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
  property?: { slug: string; title: string } | null;
  receivedAt: string;
}

type Store = (e: Enquiry) => Promise<void>;

const json: Store = async (e) => {
  const file = path.join(process.cwd(), "data", "enquiries.json");
  await fs.mkdir(path.dirname(file), { recursive: true });
  let list: Enquiry[] = [];
  try {
    list = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {}
  list.push(e);
  await fs.writeFile(file, JSON.stringify(list, null, 2));
};

const summary = (e: Enquiry) =>
  [
    `Type: ${e.type}`,
    e.property ? `Property: ${e.property.title} (${e.property.slug})` : null,
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    e.phone ? `Phone: ${e.phone}` : null,
    e.preferredDate ? `Preferred date: ${e.preferredDate}` : null,
    e.message ? `\n${e.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

const resend: Store = async (e) => {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO;
  if (!key || !to) throw new Error("RESEND_API_KEY and ENQUIRY_TO must be set");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM ?? "Website <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: e.email,
      subject: `${e.type === "viewing" ? "Viewing request" : "Enquiry"}${e.property ? ` — ${e.property.title}` : ""}`,
      text: summary(e),
    }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}`);
};

const webhook: Store = async (e) => {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) throw new Error("ENQUIRY_WEBHOOK_URL must be set");
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...e, text: summary(e) }) });
  if (!res.ok) throw new Error(`Webhook error ${res.status}`);
};

const consoleStore: Store = async (e) => {
  console.log("[enquiry]\n" + summary(e));
};

const stores: Record<string, Store> = { json, resend, webhook, console: consoleStore };

export async function saveEnquiry(e: Enquiry) {
  const name = process.env.ENQUIRY_STORE ?? "json";
  const store = stores[name];
  if (!store) throw new Error(`Unknown ENQUIRY_STORE "${name}"`);
  await store(e);
}
