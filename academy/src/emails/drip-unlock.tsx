import { BrandLayout, Cta, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface DripUnlockProps {
  name?: string | null;
  /** e.g. "Module 2: Nutrition for Optimal Fertility" */
  moduleTitle: string;
  courseTitle: string;
  /** Link to /learn/<course-slug> */
  learnUrl: string;
}

export function subject(props: DripUnlockProps): string {
  return `${props.moduleTitle} is now open`;
}

export const example: DripUnlockProps = {
  name: "Jordan Lee",
  moduleTitle: "Module 2: Nutrition for Optimal Fertility",
  courseTitle: "Baby Steps: Your Health Journey Toward Conception",
  learnUrl: `${site.url}/learn/baby-steps`,
};

export default function DripUnlock({ name, moduleTitle, courseTitle, learnUrl }: DripUnlockProps) {
  return (
    <BrandLayout preview={`${moduleTitle} just opened in ${courseTitle}.`} heading={`${moduleTitle} is now open`} eyebrow="New this week">
      <P>{greeting(name)}</P>
      <P>
        A new module in <strong>{courseTitle}</strong> is ready for you. Take it at your own pace; the earlier modules stay open, and
        there is nothing to catch up on.
      </P>
      <Cta href={learnUrl} fallback={false}>
        Open the module
      </Cta>
      <Muted>You can turn these unlock notes off any time in your account’s email preferences.</Muted>
    </BrandLayout>
  );
}
