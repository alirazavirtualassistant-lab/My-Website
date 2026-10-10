import { describe, expect, it } from "vitest";
import * as domain from "@/lib/domain";

describe("domain barrel", () => {
  it("re-exports every public function", () => {
    const expected = [
      // drip
      "lessonDripDays",
      "enrollmentIsCurrent",
      "unlockDate",
      "isUnlocked",
      "moduleUnlockDate",
      "isModuleUnlocked",
      "isLessonUnlocked",
      "calendarDaysUntil",
      "upcomingUnlocks",
      "humanizeUnlock",
      "nextUnlockSummary",
      // xp
      "computeLessonXp",
      "computeModuleXp",
      "computeCourseXp",
      "levelForXp",
      "levelByKey",
      "subItemRefId",
      "xpAwardsForStepCompletion",
      "shouldAwardModuleCompletion",
      "courseGoalByKey",
      "courseGoalsReached",
      "courseGoalAwards",
      "ledgerTotal",
      "hasAward",
      "ledgerTotalForCourse",
      // streaks
      "parseDayKey",
      "isDayKey",
      "dayKeyDiff",
      "shiftDayKey",
      "updateStreak",
      "streakBadgeKeys",
      "nextStreakMilestone",
      "isStreakAlive",
      "effectiveStreak",
      // progress
      "isLessonPublished",
      "completedLessonIds",
      "isLessonComplete",
      "courseProgress",
      "moduleIsComplete",
      "completedModuleCodes",
      "lessonOrder",
      "adjacentLessons",
      "prevLesson",
      "nextLessonAfter",
      "findLesson",
      "nextLesson",
      // certificates
      "certificateRequirements",
      "isEligibleForCertificate",
      "makeVerifyCode",
      "normalizeVerifyCode",
      "isValidVerifyCode",
      "linkedInAddToProfileUrl",
      // pricing
      "isSaleActive",
      "effectiveUnitPrice",
      "couponAppliesToProduct",
      "couponValidityError",
      "applyCoupon",
      "cartTotals",
      "displayCurrency",
      "convertCents",
      "formatPriceInCurrency",
      "isSubscriptionProduct",
      "isPaymentPlanProduct",
      "installmentsSummary",
      "grantsCourse",
      // access
      "isSubscriptionCurrent",
      "activeEnrollmentFor",
      "grantingSubscriptionFor",
      "hasCourseAccess",
      "partnerSeatAvailable",
      // quizzes
      "isYes",
      "isAnswered",
      "isQuestionRequired",
      "questionPoints",
      "questionMaxPoints",
      "maxQuizScore",
      "bandFor",
      "scoreQuiz",
    ];
    for (const name of expected) expect(typeof (domain as Record<string, unknown>)[name], name).toBe("function");
  });

  it("re-exports the constants", () => {
    expect(domain.COURSE_GOALS).toHaveLength(3);
    expect(domain.LEVELS.length).toBeGreaterThan(0);
    expect(domain.STREAK_MILESTONES).toEqual([7, 30]);
    expect(domain.DRIP_SCHEDULE_DAYS).toEqual([0, 7, 14, 21, 28, 35, 42]);
    expect(domain.COUPON_ERRORS.expired).toMatch(/expired/);
    expect(domain.VERIFY_CODE_ALPHABET).not.toMatch(/[0OI1]/);
  });
});
