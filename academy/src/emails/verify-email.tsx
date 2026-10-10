import { BrandLayout, Cta, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface VerifyEmailProps {
  name?: string | null;
  /** Link to /verify-email?token=… */
  url: string;
}

export function subject(): string {
  return `Please confirm your email for ${site.name}`;
}

export const example: VerifyEmailProps = { name: "Jordan Lee", url: `${site.url}/verify-email?token=example-token` };

export default function VerifyEmail({ name, url }: VerifyEmailProps) {
  return (
    <BrandLayout preview="One quick click to confirm your email." heading="Welcome. Let’s confirm your email." eyebrow="Account">
      <P>{greeting(name)}</P>
      <P>Thank you for joining {site.name}. Please confirm this is your email address so we can keep your account safe.</P>
      <Cta href={url}>Confirm my email</Cta>
      <Muted>This link is good for 24 hours. If you did not create an account, you can simply ignore this message.</Muted>
    </BrandLayout>
  );
}
