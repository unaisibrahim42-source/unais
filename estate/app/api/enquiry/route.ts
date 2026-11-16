import { NextResponse } from "next/server";
import { saveEnquiry, type Enquiry } from "@/lib/enquiries";
import { getProperty } from "@/lib/properties";

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  // Honeypot: bots fill every field.
  if (str(body.company)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please add your name and a valid email." }, { status: 422 });
  }
  const slug = str(body.property, 100);
  const property = slug ? getProperty(slug) : null;
  const type = ["viewing", "enquiry", "contact"].includes(str(body.type)) ? (str(body.type) as Enquiry["type"]) : "enquiry";

  try {
    await saveEnquiry({
      type,
      name,
      email,
      phone: str(body.phone, 40) || undefined,
      message: str(body.message) || undefined,
      preferredDate: str(body.preferredDate, 40) || undefined,
      property: property ? { slug: property.slug, title: property.details.title } : null,
      receivedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Enquiry failed", err);
    return NextResponse.json({ error: "Sorry — we couldn't send that. Please call or email us." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
