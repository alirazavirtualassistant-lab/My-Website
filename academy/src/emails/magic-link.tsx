import { BrandLayout, Cta, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface MagicLinkProps {
  name?: string | null;
  /** Link to /auth/magic?token=… */
  url: string;
}

export function subject(): string {
  return `Your sign-in link for ${site.name}`;
}

export const example: MagicLinkProps = { name: null, url: `${site.url}/auth/magic?token=example-token` };

export default function MagicLink({ name, url }: MagicLinkProps) {
  return (
    <BrandLayout preview="Tap the button to sign in. No password needed." heading="Here’s your sign-in link" eyebrow="Sign in">
      <P>{greeting(name)}</P>
      <P>Use the button below to sign in. No password needed.</P>
      <Cta href={url}>Sign me in</Cta>
      <Muted>This link works once and expires in 15 minutes. If you did not ask for it, you can safely ignore this email.</Muted>
    </BrandLayout>
  );
}
