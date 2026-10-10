/**
 * Resend EmailProvider (resend@6). Renders the React Email template to HTML
 * and plain text, sends from EMAIL_FROM with reply-to = support email, and
 * records an `email_events` row whether or not the send succeeded (the admin
 * "sent emails" view and the daily jobs' idempotency keys read it).
 */
import { Resend } from "resend";
import { env } from "@/lib/env";
import { site } from "@/lib/config/site";
import type { EmailEvent } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";
import { renderEmail } from "@/services/mock/email";
import type { DataStore, EmailProvider } from "@/services/types";

declare global {
  var __cycResendClient: Resend | undefined;
}

export function getResend(): Resend {
  if (!globalThis.__cycResendClient) {
    if (!env.resend.apiKey) throw new Error("[resend] RESEND_API_KEY is not set (EMAIL_PROVIDER=resend)");
    globalThis.__cycResendClient = new Resend(env.resend.apiKey);
  }
  return globalThis.__cycResendClient;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function createResendEmail(db: DataStore): Promise<EmailProvider> {
  const events = () => db.from("email_events");

  const email: EmailProvider = {
    kind: "resend",

    async send(message) {
      const id = newId();
      const row: EmailEvent = {
        id,
        to: message.to,
        template: message.template,
        subject: message.subject,
        payload: { ...(message.payload ?? {}) },
        html: null,
        provider: "resend",
        provider_message_id: null,
        status: "queued",
        error: null,
        created_at: nowIso(),
      };

      try {
        const rendered = await renderEmail(message);
        row.html = rendered.html;
        const { data, error } = await getResend().emails.send({
          from: env.resend.from,
          to: message.to,
          subject: message.subject,
          html: rendered.html,
          text: rendered.text,
          replyTo: message.replyTo ?? site.supportEmail,
          tags: [{ name: "template", value: message.template.replace(/[^a-zA-Z0-9_-]/g, "_") }],
        });
        if (error) {
          row.status = "failed";
          row.error = `${error.name}: ${error.message}`;
        } else {
          row.status = "sent";
          row.provider_message_id = data?.id ?? null;
        }
      } catch (err) {
        row.status = "failed";
        row.error = errorMessage(err);
      }

      try {
        await events().insert(row);
      } catch (err) {
        console.warn(`[resend] could not record ${message.template} to ${message.to}:`, errorMessage(err));
      }

      if (row.status === "sent") return { ok: true, id: row.provider_message_id ?? id };
      console.warn(`[resend] FAILED to ${message.to} · ${message.subject} · ${row.error}`);
      return { ok: false, id, error: row.error ?? "send failed" };
    },
  };

  return email;
}
