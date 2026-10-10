import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MessageCircleQuestion } from "lucide-react";
import { site } from "@/lib/config/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { ContactForm } from "@/components/marketing/contact-form";
import { sendContactMessageAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: `Questions about a course, your account or anything else? Write to ${site.supportEmail} or use the form.`,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact · ${site.name}`, description: "Questions about a course or your account? We read every message.", url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Section spacing="md">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <div>
            <PageHeader eyebrow="Contact" title="We’d love to hear from you" description="Questions, feedback, a refund request, or just a hello. There are people on the other end of this form." />
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-rose-strong" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Email</span>
                  <a href={`mailto:${site.supportEmail}`} className="text-rose-strong underline underline-offset-4">
                    {site.supportEmail}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-rose-strong" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Reply time</span>
                  <span className="text-muted-foreground">Usually within two working days.</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-rose-strong" aria-hidden="true" />
                <span>
                  <span className="block font-semibold">Quick answers</span>
                  <span className="text-muted-foreground">
                    Many questions are already answered in the{" "}
                    <Link href="/faq" className="font-semibold text-rose-strong underline underline-offset-4">
                      FAQ
                    </Link>
                    .
                  </span>
                </span>
              </li>
            </ul>
            <p className="mt-8 text-xs text-muted-foreground">
              Please don’t share medical details here. This form is for questions about the Academy; for health decisions, talk with your doctor or a
              qualified provider.
            </p>
          </div>
          <ContactForm action={sendContactMessageAction} />
        </Container>
      </Section>
      <Section spacing="sm">
        <Container size="md">
          <MedicalDisclaimer />
        </Container>
      </Section>
    </>
  );
}
