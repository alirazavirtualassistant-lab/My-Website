import { BrandLayout, Muted, P, Quote } from "./components/brand-layout";

/** Internal: a message sent through the public contact form, forwarded to the admin inbox. */
export interface ContactMessageProps {
  name: string;
  email: string;
  message: string;
  receivedAt?: string | null;
}

export function subject(props: ContactMessageProps): string {
  return `Contact form: ${props.name}`;
}

export const example: ContactMessageProps = {
  name: "Jordan Lee",
  email: "jordan@example.com",
  message: "Hi Cynthia, is the Baby Steps course a good fit if we are a few months away from trying? Thank you!",
  receivedAt: new Date().toISOString(),
};

export default function ContactMessage({ name, email, message, receivedAt }: ContactMessageProps) {
  return (
    <BrandLayout preview={`${name} wrote through the contact form.`} heading="New message from the contact form" eyebrow="Admin">
      <P>
        From <strong>{name}</strong> ({email})
      </P>
      <Quote>{message}</Quote>
      <Muted>Reply directly to this email to answer {name}.</Muted>
      {receivedAt ? <Muted>Received {new Date(receivedAt).toUTCString()}</Muted> : null}
    </BrandLayout>
  );
}
