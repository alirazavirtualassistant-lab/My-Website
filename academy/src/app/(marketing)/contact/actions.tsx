"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { getServices } from "@/services";
import { site } from "@/lib/config/site";
import { formatDate, newId, normalizeEmail, nowIso } from "@/lib/utils";
import type { ContactState } from "@/components/marketing/contact-form";
import { ContactMessageEmail, contactMessageText } from "@/components/marketing/contact-email";

const RATE_COOKIE = "cyc_contact_at";
const RATE_WINDOW_MS = 60_000;

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80, "That name is a little long."),
  email: z.string().trim().min(3, "Please enter your email address.").max(254).email("That email address doesn’t look right."),
  message: z.string().trim().min(10, "Please write a few more words so we can help.").max(4000, "Please keep it under 4,000 characters."),
  website: z.string().max(200).optional(),
});

/** Contact form: zod validation, honeypot, cookie rate limit, store + notify the team. */
export async function sendContactMessageAction(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };
  const values = { name: raw.name, email: raw.email, message: raw.message };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "name" || key === "email" || key === "message") && !errors[key]) errors[key] = issue.message;
    }
    return { ok: false, message: null, errors, values };
  }

  // Honeypot filled in: quietly pretend it worked.
  if (parsed.data.website) {
    return { ok: true, message: "We will reply by email as soon as we can.", errors: {}, values };
  }

  const jar = await cookies();
  const last = Number(jar.get(RATE_COOKIE)?.value ?? 0);
  if (last && Date.now() - last < RATE_WINDOW_MS) {
    return { ok: false, message: null, errors: { form: "Thank you, we got your last message. Please wait a minute before sending another." }, values };
  }

  const receivedAt = nowIso();
  const record = { id: newId(), name: parsed.data.name, email: normalizeEmail(parsed.data.email), message: parsed.data.message, created_at: receivedAt };
  try {
    const { db, email } = await getServices();
    await db.from("contact_messages").insert(record);
    try {
      const props = { name: record.name, email: record.email, message: record.message, receivedAt: formatDate(receivedAt, { dateStyle: "medium", timeStyle: "short" }) };
      // TODO(shared): switch to sendTemplate("contact-message", site.adminNotificationEmail, props) once src/lib/email/send.ts exists.
      await email.send({
        to: site.adminNotificationEmail,
        subject: `New message from ${record.name}`,
        template: "contact-message",
        react: <ContactMessageEmail {...props} />,
        text: contactMessageText(props),
        payload: { ...props, contact_message_id: record.id },
        replyTo: record.email,
      });
    } catch (err) {
      console.error("[contact] notification email failed", err);
    }
  } catch (err) {
    console.error("[contact] could not save message", err);
    return { ok: false, message: null, errors: { form: "We couldn’t send that just now. Please try again in a moment, or email us directly." }, values };
  }

  jar.set(RATE_COOKIE, String(Date.now()), { path: "/contact", httpOnly: true, sameSite: "lax", maxAge: 60 * 60 });
  return { ok: true, message: `We will reply to ${record.email} as soon as we can, usually within two working days.`, errors: {}, values: { name: "", email: "", message: "" } };
}
