import { BrandLayout, Cta, Muted, P } from "./components/brand-layout";
import { site } from "@/lib/config/site";

export interface PartnerInviteProps {
  inviterName: string;
  courseTitle: string;
  /** Link to /partner/<token> */
  acceptUrl: string;
}

export function subject(props: PartnerInviteProps): string {
  return `${props.inviterName} invited you to join ${props.courseTitle}`;
}

export const example: PartnerInviteProps = {
  inviterName: "Jordan Lee",
  courseTitle: "Baby Steps: Your Health Journey Toward Conception",
  acceptUrl: `${site.url}/partner/example-token`,
};

export default function PartnerInvite({ inviterName, courseTitle, acceptUrl }: PartnerInviteProps) {
  return (
    <BrandLayout preview={`${inviterName} would love to take this journey with you.`} heading="You’ve been invited to learn together" eyebrow="Partner seat">
      <P>Hello,</P>
      <P>
        {inviterName} has a seat for you in <strong>{courseTitle}</strong> at {site.name}. The course is designed to be walked
        through together, one small step at a time.
      </P>
      <Cta href={acceptUrl}>Accept the invitation</Cta>
      <Muted>If you don’t know {inviterName} or would rather not join, you can simply ignore this email.</Muted>
    </BrandLayout>
  );
}
