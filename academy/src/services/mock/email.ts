/**
 * Mock EmailProvider: renders the React Email template to HTML + plain text,
 * records an `email_events` row and logs one line. The demo mailbox at
 * /dev/mailbox reads the rows back. Never throws: a render failure is stored
 * as status 'failed' with the error message so the caller can continue.
 */
import { render } from "@react-email/components";
import type { EmailEvent } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";
import type { DataStore, EmailMessage, EmailProvider } from "@/services/types";

export interface RenderedEmail {
  html: string;
  text: string;
}

/** Renders a message's React element to HTML and plain text. */
export async function renderEmail(message: Pick<EmailMessage, "react" | "text">): Promise<RenderedEmail> {
  const html = await render(message.react);
  const text = message.text ?? (await render(message.react, { plainText: true }));
  return { html, text };
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return typeof err === "string" ? err : JSON.stringify(err);
}

export async function createMockEmail(db: DataStore): Promise<EmailProvider> {
  const events = () => db.from("email_events");

  const email: EmailProvider = {
    kind: "mock",

    async send(message) {
      const id = newId();
      const row: EmailEvent = {
        id,
        to: message.to,
        template: message.template,
        subject: message.subject,
        payload: { ...(message.payload ?? {}), ...(message.replyTo ? { reply_to: message.replyTo } : {}) },
        html: null,
        provider: "mock",
        provider_message_id: `mock_msg_${id}`,
        status: "sent",
        error: null,
        created_at: nowIso(),
      };
      try {
        const rendered = await renderEmail(message);
        row.html = rendered.html;
        row.payload = { ...row.payload, text: rendered.text };
      } catch (err) {
        row.status = "failed";
        row.error = `render failed: ${errorMessage(err)}`;
        row.provider_message_id = null;
      }
      try {
        await events().insert(row);
      } catch (err) {
        console.warn(`[email] could not record ${message.template} to ${message.to}:`, errorMessage(err));
        return { ok: false, id, error: errorMessage(err) };
      }
      if (row.status === "sent") {
        console.log(`[email] to ${message.to} · ${message.subject}`);
        return { ok: true, id };
      }
      console.warn(`[email] FAILED to ${message.to} · ${message.subject} · ${row.error}`);
      return { ok: false, id, error: row.error ?? "render failed" };
    },
  };

  return email;
}
