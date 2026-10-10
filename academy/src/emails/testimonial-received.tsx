import { BrandLayout, Muted, P, Quote } from "./components/brand-layout";
import { site } from "@/lib/config/site";

/** Internal: a learner submitted a testimonial that is waiting for review. */
export interface TestimonialReceivedProps {
  authorName: string;
  body: string;
  rating: number | null;
  courseTitle?: string | null;
  /** Link to the admin review page. */
  reviewUrl: string;
}

export function subject(props: TestimonialReceivedProps): string {
  return `New testimonial from ${props.authorName} awaiting review`;
}

export const example: TestimonialReceivedProps = {
  authorName: "Jordan Lee",
  body: "The small steps made this feel doable for the first time. Thank you for the kindness in every lesson.",
  rating: 5,
  courseTitle: "Baby Steps: Your Health Journey Toward Conception",
  reviewUrl: `${site.url}/admin/testimonials`,
};

export default function TestimonialReceived({ authorName, body, rating, courseTitle, reviewUrl }: TestimonialReceivedProps) {
  return (
    <BrandLayout preview={`${authorName} shared a testimonial.`} heading="A new testimonial is waiting for review" eyebrow="Admin">
      <P>
        <strong>{authorName}</strong>
        {courseTitle ? ` · ${courseTitle}` : ""}
        {rating ? ` · ${"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}` : ""}
      </P>
      <Quote>{body}</Quote>
      <Muted>Nothing is public until you approve it. Review it at {reviewUrl}.</Muted>
    </BrandLayout>
  );
}
