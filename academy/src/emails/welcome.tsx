import { BrandLayout, Cta, P, Quote, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface WelcomeProps {
  name?: string | null;
  /** Where to start: usually /learn. */
  learnUrl: string;
}

export function subject(): string {
  return `Welcome to ${site.name}`;
}

export const example: WelcomeProps = { name: "Jordan Lee", learnUrl: `${site.url}/learn` };

export default function Welcome({ name, learnUrl }: WelcomeProps) {
  return (
    <BrandLayout preview="You’re in. Here’s where to begin." heading="You’re in. Welcome." eyebrow="Welcome">
      <P>{greeting(name)}</P>
      <P>
        I’m so glad you’re here. Everything in the academy is built around small, repeatable steps, and you set the pace. There is no
        catching up and no falling behind.
      </P>
      <Quote>{site.signatureQuote}</Quote>
      <P>When you’re ready, your dashboard has your first lesson waiting.</P>
      <Cta href={learnUrl} fallback={false}>
        Go to my dashboard
      </Cta>
      <P>
        Warmly,
        <br />
        {site.instructor.name}
      </P>
    </BrandLayout>
  );
}
