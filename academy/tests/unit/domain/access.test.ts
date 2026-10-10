import { describe, expect, it } from "vitest";
import {
  ACCESS_SUBSCRIPTION_STATUSES,
  activeEnrollmentFor,
  grantingSubscriptionFor,
  hasCourseAccess,
  isSubscriptionCurrent,
  partnerSeatAvailable,
} from "@/lib/domain/access";
import { COURSE_ID, NOW, daysAfter, makeCourse, makeEnrollment, makeProduct, makeSubscription } from "./fixtures";

const allAccess = makeProduct({ id: "prod-all-access", type: "subscription", interval: "month", grants_all_courses: true, course_ids: [] });
const listed = makeProduct({ id: "prod-listed", type: "subscription", interval: "year", course_ids: [COURSE_ID] });
const unrelated = makeProduct({ id: "prod-other", type: "subscription", interval: "month", course_ids: ["another-course"] });
const products = [allAccess, listed, unrelated];

describe("hasCourseAccess", () => {
  it("allows an active enrolment", () => {
    expect(hasCourseAccess({ enrollments: [makeEnrollment()], subscriptions: [], products, courseId: COURSE_ID, now: NOW })).toEqual({ allowed: true, via: "enrollment" });
  });

  it("denies revoked, expired and other-course enrolments", () => {
    for (const e of [
      makeEnrollment({ status: "revoked" }),
      makeEnrollment({ status: "expired" }),
      makeEnrollment({ expires_at: daysAfter(NOW, -1).toISOString() }),
      makeEnrollment({ expires_at: NOW.toISOString() }),
      makeEnrollment({ course_id: "another-course" }),
    ]) {
      expect(hasCourseAccess({ enrollments: [e], subscriptions: [], products, courseId: COURSE_ID, now: NOW })).toEqual({ allowed: false, via: null });
    }
    expect(hasCourseAccess({ enrollments: [makeEnrollment({ expires_at: daysAfter(NOW, 1).toISOString() })], subscriptions: [], products, courseId: COURSE_ID, now: NOW }).allowed).toBe(true);
  });

  it("allows an all-access or course-listing subscription", () => {
    expect(hasCourseAccess({ enrollments: [], subscriptions: [makeSubscription({ product_id: "prod-all-access" })], products, courseId: COURSE_ID, now: NOW })).toEqual({ allowed: true, via: "subscription" });
    expect(hasCourseAccess({ enrollments: [], subscriptions: [makeSubscription({ product_id: "prod-listed", status: "trialing" })], products, courseId: COURSE_ID, now: NOW })).toEqual({ allowed: true, via: "subscription" });
  });

  it("denies subscriptions that are not active or do not cover the course", () => {
    for (const status of ["past_due", "canceled", "unpaid", "incomplete"] as const) {
      expect(hasCourseAccess({ enrollments: [], subscriptions: [makeSubscription({ product_id: "prod-all-access", status })], products, courseId: COURSE_ID, now: NOW }).allowed).toBe(false);
    }
    expect(hasCourseAccess({ enrollments: [], subscriptions: [makeSubscription({ product_id: "prod-other" })], products, courseId: COURSE_ID, now: NOW }).allowed).toBe(false);
    expect(hasCourseAccess({ enrollments: [], subscriptions: [makeSubscription({ product_id: "missing" })], products, courseId: COURSE_ID, now: NOW }).allowed).toBe(false);
    expect(hasCourseAccess({ enrollments: [], subscriptions: [], products: [], courseId: COURSE_ID, now: NOW })).toEqual({ allowed: false, via: null });
  });

  it("prefers the enrolment when both apply", () => {
    const r = hasCourseAccess({ enrollments: [makeEnrollment()], subscriptions: [makeSubscription({ product_id: "prod-all-access" })], products, courseId: COURSE_ID, now: NOW });
    expect(r.via).toBe("enrollment");
    const r2 = hasCourseAccess({ enrollments: [makeEnrollment({ status: "revoked" })], subscriptions: [makeSubscription({ product_id: "prod-all-access" })], products, courseId: COURSE_ID, now: NOW });
    expect(r2.via).toBe("subscription");
  });
});

describe("helpers", () => {
  it("activeEnrollmentFor picks the earliest current enrolment", () => {
    const older = makeEnrollment({ id: "older", started_at: "2026-09-01T00:00:00Z" });
    const newer = makeEnrollment({ id: "newer", started_at: "2026-10-01T00:00:00Z" });
    const revoked = makeEnrollment({ id: "revoked", started_at: "2026-08-01T00:00:00Z", status: "revoked" });
    expect(activeEnrollmentFor([newer, revoked, older], COURSE_ID, NOW)?.id).toBe("older");
    expect(activeEnrollmentFor([revoked], COURSE_ID, NOW)).toBeNull();
    expect(activeEnrollmentFor([], COURSE_ID, NOW)).toBeNull();
  });

  it("grantingSubscriptionFor returns the covering subscription", () => {
    const sub = makeSubscription({ id: "s", product_id: "prod-listed" });
    expect(grantingSubscriptionFor([makeSubscription({ product_id: "prod-other" }), sub], products, COURSE_ID)?.id).toBe("s");
    expect(grantingSubscriptionFor([makeSubscription({ product_id: "prod-listed", status: "canceled" })], products, COURSE_ID)).toBeNull();
  });

  it("isSubscriptionCurrent follows the status list", () => {
    expect([...ACCESS_SUBSCRIPTION_STATUSES]).toEqual(["active", "trialing"]);
    expect(isSubscriptionCurrent({ status: "active" })).toBe(true);
    expect(isSubscriptionCurrent({ status: "trialing" })).toBe(true);
    expect(isSubscriptionCurrent({ status: "past_due" })).toBe(false);
  });
});

describe("partnerSeatAvailable", () => {
  const course = makeCourse({ partner_seat_enabled: true });

  it("is available for an active enrolment with invites left on a partner-enabled course", () => {
    expect(partnerSeatAvailable(makeEnrollment({ partner_invites_remaining: 1 }), course)).toBe(true);
  });

  it("is unavailable when the course has no partner seats, invites are used up, the enrolment is not active, or the learner is a partner", () => {
    expect(partnerSeatAvailable(makeEnrollment(), makeCourse({ partner_seat_enabled: false }))).toBe(false);
    expect(partnerSeatAvailable(makeEnrollment({ partner_invites_remaining: 0 }), course)).toBe(false);
    expect(partnerSeatAvailable(makeEnrollment({ status: "revoked" }), course)).toBe(false);
    expect(partnerSeatAvailable(makeEnrollment({ status: "expired" }), course)).toBe(false);
    expect(partnerSeatAvailable(makeEnrollment({ source: "partner", partner_invites_remaining: 1 }), course)).toBe(false);
  });
});
