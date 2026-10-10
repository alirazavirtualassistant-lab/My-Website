/**
 * Template registry: name → { component, subject }. Add a template by creating
 * `src/emails/<name>.tsx` (default-export component, `subject()` and
 * `example`) and listing it here; `previews.ts` and `sendTemplate` pick it up.
 */
import type { ComponentType } from "react";
import VerifyEmail, { subject as verifyEmailSubject, type VerifyEmailProps } from "./verify-email";
import Welcome, { subject as welcomeSubject, type WelcomeProps } from "./welcome";
import MagicLink, { subject as magicLinkSubject, type MagicLinkProps } from "./magic-link";
import PasswordReset, { subject as passwordResetSubject, type PasswordResetProps } from "./password-reset";
import SetPassword, { subject as setPasswordSubject, type SetPasswordProps } from "./set-password";
import PurchaseReceipt, { subject as purchaseReceiptSubject, type PurchaseReceiptProps } from "./purchase-receipt";
import PartnerInvite, { subject as partnerInviteSubject, type PartnerInviteProps } from "./partner-invite";
import GiftReceived, { subject as giftReceivedSubject, type GiftReceivedProps } from "./gift-received";
import GiftSentConfirmation, { subject as giftSentConfirmationSubject, type GiftSentConfirmationProps } from "./gift-sent-confirmation";
import DripUnlock, { subject as dripUnlockSubject, type DripUnlockProps } from "./drip-unlock";
import WeeklyNudge, { subject as weeklyNudgeSubject, type WeeklyNudgeProps } from "./weekly-nudge";
import CertificateEarned, { subject as certificateEarnedSubject, type CertificateEarnedProps } from "./certificate-earned";
import SubscriptionRenewed, { subject as subscriptionRenewedSubject, type SubscriptionRenewedProps } from "./subscription-renewed";
import PaymentFailed, { subject as paymentFailedSubject, type PaymentFailedProps } from "./payment-failed";
import SubscriptionCanceled, { subject as subscriptionCanceledSubject, type SubscriptionCanceledProps } from "./subscription-canceled";
import AbandonedCart, { subject as abandonedCartSubject, type AbandonedCartProps } from "./abandoned-cart";
import AdminNewSale, { subject as adminNewSaleSubject, type AdminNewSaleProps } from "./admin-new-sale";
import ContactMessage, { subject as contactMessageSubject, type ContactMessageProps } from "./contact-message";
import Broadcast, { subject as broadcastSubject, type BroadcastProps } from "./broadcast";
import TestimonialReceived, { subject as testimonialReceivedSubject, type TestimonialReceivedProps } from "./testimonial-received";

/** Props accepted by each template. */
export interface TemplatePropsMap {
  "verify-email": VerifyEmailProps;
  welcome: WelcomeProps;
  "magic-link": MagicLinkProps;
  "password-reset": PasswordResetProps;
  "set-password": SetPasswordProps;
  "purchase-receipt": PurchaseReceiptProps;
  "partner-invite": PartnerInviteProps;
  "gift-received": GiftReceivedProps;
  "gift-sent-confirmation": GiftSentConfirmationProps;
  "drip-unlock": DripUnlockProps;
  "weekly-nudge": WeeklyNudgeProps;
  "certificate-earned": CertificateEarnedProps;
  "subscription-renewed": SubscriptionRenewedProps;
  "payment-failed": PaymentFailedProps;
  "subscription-canceled": SubscriptionCanceledProps;
  "abandoned-cart": AbandonedCartProps;
  "admin-new-sale": AdminNewSaleProps;
  "contact-message": ContactMessageProps;
  broadcast: BroadcastProps;
  "testimonial-received": TestimonialReceivedProps;
}

export type TemplateName = keyof TemplatePropsMap;

/**
 * Extra keys callers may attach to any send. They are stored in
 * `email_events.payload` (never rendered); the daily jobs use `job_key` for
 * idempotency.
 */
export interface SendExtras {
  job_key?: string;
}

/** Props for `sendTemplate`: the template's own props plus the shared extras. */
export type TemplateProps = { [K in TemplateName]: TemplatePropsMap[K] & SendExtras };

export interface TemplateEntry<P> {
  component: ComponentType<P>;
  subject: (props: P) => string;
}

export const templates: { [K in TemplateName]: TemplateEntry<TemplatePropsMap[K]> } = {
  "verify-email": { component: VerifyEmail, subject: verifyEmailSubject },
  welcome: { component: Welcome, subject: welcomeSubject },
  "magic-link": { component: MagicLink, subject: magicLinkSubject },
  "password-reset": { component: PasswordReset, subject: passwordResetSubject },
  "set-password": { component: SetPassword, subject: setPasswordSubject },
  "purchase-receipt": { component: PurchaseReceipt, subject: purchaseReceiptSubject },
  "partner-invite": { component: PartnerInvite, subject: partnerInviteSubject },
  "gift-received": { component: GiftReceived, subject: giftReceivedSubject },
  "gift-sent-confirmation": { component: GiftSentConfirmation, subject: giftSentConfirmationSubject },
  "drip-unlock": { component: DripUnlock, subject: dripUnlockSubject },
  "weekly-nudge": { component: WeeklyNudge, subject: weeklyNudgeSubject },
  "certificate-earned": { component: CertificateEarned, subject: certificateEarnedSubject },
  "subscription-renewed": { component: SubscriptionRenewed, subject: subscriptionRenewedSubject },
  "payment-failed": { component: PaymentFailed, subject: paymentFailedSubject },
  "subscription-canceled": { component: SubscriptionCanceled, subject: subscriptionCanceledSubject },
  "abandoned-cart": { component: AbandonedCart, subject: abandonedCartSubject },
  "admin-new-sale": { component: AdminNewSale, subject: adminNewSaleSubject },
  "contact-message": { component: ContactMessage, subject: contactMessageSubject },
  broadcast: { component: Broadcast, subject: broadcastSubject },
  "testimonial-received": { component: TestimonialReceived, subject: testimonialReceivedSubject },
};

export const templateNames = Object.keys(templates) as TemplateName[];

export function isTemplateName(name: string): name is TemplateName {
  return Object.prototype.hasOwnProperty.call(templates, name);
}

/** Templates that go to the admin inbox rather than a learner. */
export const ADMIN_TEMPLATES: readonly TemplateName[] = ["admin-new-sale", "contact-message", "testimonial-received"];
