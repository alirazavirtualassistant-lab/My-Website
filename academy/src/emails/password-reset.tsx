import { BrandLayout, Cta, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface PasswordResetProps {
  name?: string | null;
  /** Link to /reset-password?token=… */
  url: string;
}

export function subject(): string {
  return `Reset your ${site.name} password`;
}

export const example: PasswordResetProps = { name: "Jordan Lee", url: `${site.url}/reset-password?token=example-token` };

export default function PasswordReset({ name, url }: PasswordResetProps) {
  return (
    <BrandLayout preview="Choose a new password whenever you’re ready." heading="Let’s reset your password" eyebrow="Account">
      <P>{greeting(name)}</P>
      <P>We received a request to reset the password for your account. Choose a new one with the button below.</P>
      <Cta href={url}>Choose a new password</Cta>
      <Muted>This link expires in 1 hour. If you did not request a reset, no action is needed and your password stays the same.</Muted>
    </BrandLayout>
  );
}
