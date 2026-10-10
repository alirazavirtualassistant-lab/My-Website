import { BrandLayout, Muted, SimpleMarkdown, greeting } from "./components/brand-layout";
import { site } from "@/lib/config/site";

/** Admin broadcast: subject + markdown body written in the admin panel. */
export interface BroadcastProps {
  name?: string | null;
  subject: string;
  /** Markdown (headings, bullets, paragraphs, **bold**, [links](url)). */
  body: string;
  /** Link to the email preferences page. */
  preferencesUrl?: string;
}

export function subject(props: BroadcastProps): string {
  return props.subject;
}

export const example: BroadcastProps = {
  name: "Jordan Lee",
  subject: "A note from Cynthia: new replays are up",
  body: "The group coaching replays from this month are now in the Replays module.\n\n## What to watch first\n\n- The Q&A on cravings and sleep\n- The visioning walkthrough\n\nTake what helps and leave the rest. **You set the pace.**\n\n[Open the replays](https://example.com/learn/baby-steps)",
  preferencesUrl: `${site.url}/account/notifications`,
};

export default function Broadcast({ name, subject: heading, body, preferencesUrl = `${site.url}/account/notifications` }: BroadcastProps) {
  const firstLine = body.split("\n").find((l) => l.trim() && !l.trim().startsWith("#")) ?? heading;
  return (
    <BrandLayout preview={firstLine.slice(0, 120)} heading={heading} eyebrow={`From ${site.instructor.shortName}`} footerNote={`You are receiving this because you have an account at ${site.name}. Manage your email preferences at ${preferencesUrl}.`}>
      <SimpleMarkdown body={`${greeting(name)}\n\n${body}`} />
      <Muted>
        Warmly, {site.instructor.name}
      </Muted>
    </BrandLayout>
  );
}
