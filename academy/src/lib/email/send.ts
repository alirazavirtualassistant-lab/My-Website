/**
 * Typed convenience wrapper around the email service for use cases:
 *
 *   await sendTemplate("drip-unlock", profile.email, { name, moduleTitle, courseTitle, learnUrl });
 *   await sendTemplate(services, "welcome", email, { name, learnUrl });   // when services are in hand
 *
 * Builds the React element + subject from the registry in src/emails, records
 * the props as the event payload (so the dev mailbox and the daily jobs can
 * read e.g. `job_key`) and never throws: failures come back as { ok: false }.
 */
import { createElement, type ComponentType } from "react";
import { getServices } from "@/services";
import type { EmailMessage, EmailProvider, Services } from "@/services/types";
import { templates, type TemplateName, type TemplateProps } from "@/emails";

export type SendResult = { ok: boolean; id?: string; error?: string };

export interface SendTemplateOptions {
  replyTo?: string;
}

type ServicesLike = Pick<Services, "email">;

function isServicesLike(value: unknown): value is ServicesLike {
  return typeof value === "object" && value !== null && "email" in value && typeof (value as { email?: unknown }).email === "object";
}

/** Builds the EmailMessage for a template without sending it. */
export function buildTemplateMessage<N extends TemplateName>(name: N, to: string, props: TemplateProps[N], options: SendTemplateOptions = {}): EmailMessage {
  // The registry is keyed per template; erase the generic here so React sees a plain component + props pair.
  const entry = templates[name] as unknown as { component: ComponentType<object>; subject: (p: object) => string };
  const plainProps = props as unknown as Record<string, unknown>;
  const react = createElement(entry.component, plainProps);
  return {
    to,
    subject: entry.subject(plainProps),
    template: name,
    react,
    payload: { ...plainProps },
    ...(options.replyTo ? { replyTo: options.replyTo } : {}),
  };
}

export async function sendTemplateWith<N extends TemplateName>(
  email: EmailProvider,
  name: N,
  to: string,
  props: TemplateProps[N],
  options: SendTemplateOptions = {},
): Promise<SendResult> {
  try {
    return await email.send(buildTemplateMessage(name, to, props, options));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[email] ${name} to ${to} failed: ${message}`);
    return { ok: false, error: message };
  }
}

export function sendTemplate<N extends TemplateName>(name: N, to: string, props: TemplateProps[N], options?: SendTemplateOptions): Promise<SendResult>;
export function sendTemplate<N extends TemplateName>(services: ServicesLike, name: N, to: string, props: TemplateProps[N], options?: SendTemplateOptions): Promise<SendResult>;
export async function sendTemplate(...args: unknown[]): Promise<SendResult> {
  if (isServicesLike(args[0])) {
    const [services, name, to, props, options] = args as [ServicesLike, TemplateName, string, TemplateProps[TemplateName], SendTemplateOptions | undefined];
    return sendTemplateWith(services.email, name, to, props, options);
  }
  const [name, to, props, options] = args as [TemplateName, string, TemplateProps[TemplateName], SendTemplateOptions | undefined];
  const { email } = await getServices();
  return sendTemplateWith(email, name, to, props, options);
}
