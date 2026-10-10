/**
 * Course access — pure decision over enrolments, subscriptions and products.
 */
import type { Course, Enrollment, Product, Subscription } from "@/lib/types";
import { enrollmentIsCurrent } from "./drip";
import { grantsCourse } from "./pricing";

/** Subscription statuses that grant access. `past_due` keeps the row but not the content. */
export const ACCESS_SUBSCRIPTION_STATUSES: ReadonlyArray<Subscription["status"]> = ["active", "trialing"];

export type AccessVia = "enrollment" | "subscription" | null;

export interface CourseAccessInput {
  enrollments: ReadonlyArray<Enrollment>;
  subscriptions: ReadonlyArray<Subscription>;
  products: ReadonlyArray<Product>;
  courseId: string;
  now: Date;
}

export interface CourseAccess {
  allowed: boolean;
  via: AccessVia;
}

export function isSubscriptionCurrent(subscription: Pick<Subscription, "status">): boolean {
  return ACCESS_SUBSCRIPTION_STATUSES.includes(subscription.status);
}

/** The enrolment that grants access to the course right now (earliest start wins), or null. */
export function activeEnrollmentFor(enrollments: ReadonlyArray<Enrollment>, courseId: string, now: Date): Enrollment | null {
  const active = enrollments
    .filter((e) => e.course_id === courseId && enrollmentIsCurrent(e, now))
    .sort((a, b) => Date.parse(a.started_at) - Date.parse(b.started_at));
  return active[0] ?? null;
}

/** The subscription that grants access to the course right now, or null. */
export function grantingSubscriptionFor(
  subscriptions: ReadonlyArray<Subscription>,
  products: ReadonlyArray<Product>,
  courseId: string,
): Subscription | null {
  const byId = new Map(products.map((p) => [p.id, p]));
  for (const sub of subscriptions) {
    if (!isSubscriptionCurrent(sub)) continue;
    const product = byId.get(sub.product_id);
    if (product && grantsCourse(product, courseId)) return sub;
  }
  return null;
}

/**
 * Allowed via an active, unexpired, unrevoked enrolment for the course, or via
 * an active/trialing subscription whose product grants every course or lists
 * this one. Enrolment wins when both apply.
 */
export function hasCourseAccess({ enrollments, subscriptions, products, courseId, now }: CourseAccessInput): CourseAccess {
  if (activeEnrollmentFor(enrollments, courseId, now)) return { allowed: true, via: "enrollment" };
  if (grantingSubscriptionFor(subscriptions, products, courseId)) return { allowed: true, via: "subscription" };
  return { allowed: false, via: null };
}

/**
 * A learner may invite a partner when the course offers partner seats, their
 * enrolment is active and still has invites left, and they are not themselves
 * sitting in a partner seat.
 */
export function partnerSeatAvailable(
  enrollment: Pick<Enrollment, "status" | "partner_invites_remaining" | "source">,
  course: Pick<Course, "partner_seat_enabled">,
): boolean {
  if (!course.partner_seat_enabled) return false;
  if (enrollment.status !== "active") return false;
  if (enrollment.source === "partner") return false;
  return enrollment.partner_invites_remaining > 0;
}
