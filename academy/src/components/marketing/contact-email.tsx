import * as React from "react";

export interface ContactMessageEmailProps {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}

/**
 * Minimal admin notification for a contact-form message. Plain React so the
 * email provider can render it; swap for the shared `contact-message`
 * template once src/emails exists.
 */
function ContactMessageEmail({ name, email, message, receivedAt }: ContactMessageEmailProps) {
  return (
    <div style={{ fontFamily: "Georgia, serif", color: "#2e2a27", background: "#fbf6ef", padding: 24 }}>
      <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#9a4f56", margin: 0 }}>New contact message</p>
      <h1 style={{ fontSize: 24, fontWeight: 500, margin: "8px 0 16px" }}>{name} wrote in</h1>
      <p style={{ margin: "0 0 4px" }}>
        <strong>From:</strong> {name} &lt;{email}&gt;
      </p>
      <p style={{ margin: "0 0 16px", color: "#6f6660" }}>Received {receivedAt}</p>
      <div style={{ whiteSpace: "pre-wrap", background: "#ffffff", border: "1px solid #e8dfd0", borderRadius: 12, padding: 16, lineHeight: 1.6 }}>{message}</div>
      <p style={{ marginTop: 16, fontSize: 12, color: "#6f6660" }}>Reply directly to this email to answer {name}.</p>
    </div>
  );
}

export function contactMessageText({ name, email, message, receivedAt }: ContactMessageEmailProps): string {
  return `New contact message\n\nFrom: ${name} <${email}>\nReceived: ${receivedAt}\n\n${message}\n`;
}

export { ContactMessageEmail };
