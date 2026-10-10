import { BrandLayout, Cta, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

/**
 * Welcome variant of the password email: sent when an account was created
 * for someone (guest checkout, gift, partner seat) and they need to choose
 * their first password.
 */
export interface SetPasswordProps {
  name?: string | null;
  /** Link to /reset-password?token=…&welcome=1 */
  url: string;
  /** Why the account exists, e.g. "your purchase" or "a gift from Sam". */
  reason?: string | null;
}

export function subject(): string {
  return `Welcome to ${site.name} — set your password`;
}

export const example: SetPasswordProps = { name: "Jordan Lee", url: `${site.url}/reset-password?token=example-token&welcome=1`, reason: "your purchase" };

export default function SetPassword({ name, url, reason }: SetPasswordProps) {
  return (
    <BrandLayout preview="Set a password to open your learning space." heading="Welcome. Let’s set your password." eyebrow="Welcome">
      <P>{greeting(name)}</P>
      <P>
        An account was created for you{reason ? ` with ${reason}` : ""}. Choose a password and your lessons will be waiting on the other
        side.
      </P>
      <Cta href={url}>Set my password</Cta>
      <Muted>This link is good for 7 days. If it expires, use “Forgot password” on the sign-in page and we will send a fresh one.</Muted>
    </BrandLayout>
  );
}
