import { BrandLayout, Cta, InlineLink, Muted, P, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface CertificateEarnedProps {
  name?: string | null;
  courseTitle: string;
  /** Link to /certificates/<id> */
  certificateUrl: string;
  /** Public link to /verify/<code> */
  verifyUrl: string;
}

export function subject(props: CertificateEarnedProps): string {
  return `Your certificate for ${props.courseTitle}`;
}

export const example: CertificateEarnedProps = {
  name: "Jordan Lee",
  courseTitle: "Baby Steps: Your Health Journey Toward Conception",
  certificateUrl: `${site.url}/certificates/example-id`,
  verifyUrl: `${site.url}/verify/ABCD2345`,
};

export default function CertificateEarned({ name, courseTitle, certificateUrl, verifyUrl }: CertificateEarnedProps) {
  return (
    <BrandLayout preview="You completed the course. Your certificate is ready." heading="You did it. Your certificate is ready." eyebrow="Congratulations">
      <P>{greeting(name)}</P>
      <P>
        You have completed <strong>{courseTitle}</strong>. Every lesson, every action step, every small choice added up, and we hope
        you feel proud of the care you have given yourself.
      </P>
      <Cta href={certificateUrl} fallback={false}>
        View my certificate
      </Cta>
      <Muted>
        Anyone can confirm it is genuine at <InlineLink href={verifyUrl}>{verifyUrl}</InlineLink>.
      </Muted>
      <P>
        With warmth and admiration,
        <br />
        {site.instructor.name}
      </P>
    </BrandLayout>
  );
}
