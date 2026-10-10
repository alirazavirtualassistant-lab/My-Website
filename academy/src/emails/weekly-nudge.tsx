import { BrandLayout, Cta, Muted, P, Quote, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface WeeklyNudgeProps {
  name?: string | null;
  courseTitle: string;
  /** Link to /learn */
  learnUrl: string;
}

export function subject(): string {
  return "A gentle hello from your course";
}

export const example: WeeklyNudgeProps = { name: "Jordan Lee", courseTitle: "Baby Steps: Your Health Journey Toward Conception", learnUrl: `${site.url}/learn` };

export default function WeeklyNudge({ name, courseTitle, learnUrl }: WeeklyNudgeProps) {
  return (
    <BrandLayout preview="Whenever you’re ready, your next small step is waiting." heading="Your next small step is waiting" eyebrow="Checking in">
      <P>{greeting(name)}</P>
      <P>
        It has been a little while since you visited <strong>{courseTitle}</strong>. That is completely okay. Life is full, and the
        course will meet you right where you left off.
      </P>
      <Quote>{site.signatureQuote}</Quote>
      <P>One lesson, one action step, or even five minutes counts.</P>
      <Cta href={learnUrl} fallback={false}>
        Pick up where I left off
      </Cta>
      <Muted>Prefer fewer check-ins? You can switch these off in your account’s email preferences.</Muted>
    </BrandLayout>
  );
}
