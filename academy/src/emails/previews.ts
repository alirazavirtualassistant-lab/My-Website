/**
 * Example props for every template, for the dev mailbox / preview page.
 * Usage: `renderPreview(name)` → { subject, html, text }.
 */
import { createElement } from "react";
import { render } from "@react-email/components";
import { templates, type TemplateName, type TemplatePropsMap } from "./index";
import { example as verifyEmail } from "./verify-email";
import { example as welcome } from "./welcome";
import { example as magicLink } from "./magic-link";
import { example as passwordReset } from "./password-reset";
import { example as setPassword } from "./set-password";
import { example as purchaseReceipt } from "./purchase-receipt";
import { example as partnerInvite } from "./partner-invite";
import { example as giftReceived } from "./gift-received";
import { example as giftSentConfirmation } from "./gift-sent-confirmation";
import { example as dripUnlock } from "./drip-unlock";
import { example as weeklyNudge } from "./weekly-nudge";
import { example as certificateEarned } from "./certificate-earned";
import { example as subscriptionRenewed } from "./subscription-renewed";
import { example as paymentFailed } from "./payment-failed";
import { example as subscriptionCanceled } from "./subscription-canceled";
import { example as abandonedCart } from "./abandoned-cart";
import { example as adminNewSale } from "./admin-new-sale";
import { example as contactMessage } from "./contact-message";
import { example as broadcast } from "./broadcast";
import { example as testimonialReceived } from "./testimonial-received";

export const previews: { [K in TemplateName]: TemplatePropsMap[K] } = {
  "verify-email": verifyEmail,
  welcome,
  "magic-link": magicLink,
  "password-reset": passwordReset,
  "set-password": setPassword,
  "purchase-receipt": purchaseReceipt,
  "partner-invite": partnerInvite,
  "gift-received": giftReceived,
  "gift-sent-confirmation": giftSentConfirmation,
  "drip-unlock": dripUnlock,
  "weekly-nudge": weeklyNudge,
  "certificate-earned": certificateEarned,
  "subscription-renewed": subscriptionRenewed,
  "payment-failed": paymentFailed,
  "subscription-canceled": subscriptionCanceled,
  "abandoned-cart": abandonedCart,
  "admin-new-sale": adminNewSale,
  "contact-message": contactMessage,
  broadcast,
  "testimonial-received": testimonialReceived,
};

export interface RenderedPreview {
  name: TemplateName;
  subject: string;
  html: string;
  text: string;
}

/** Renders a template with its example props (or the given override). */
export async function renderPreview<N extends TemplateName>(name: N, props?: TemplatePropsMap[N]): Promise<RenderedPreview> {
  const entry = templates[name] as { component: React.ComponentType<TemplatePropsMap[N]>; subject: (p: TemplatePropsMap[N]) => string };
  const p = props ?? previews[name];
  const element = createElement(entry.component, p);
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { name, subject: entry.subject(p), html, text };
}
