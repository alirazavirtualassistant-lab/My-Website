import "server-only";
import { getServices } from "@/services";
import type { DataStore } from "@/services/types";
import type { Certificate, CourseTree, LessonProgress } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";
import { isEligibleForCertificate, makeVerifyCode } from "@/lib/domain/certificates";
import { site } from "@/lib/config/site";

/** Issues a certificate when the learner has completed every required lesson. Idempotent. */
export async function issueCertificateIfEligible(
  db: DataStore,
  userId: string,
  courseId: string,
  tree: CourseTree,
  progress: LessonProgress[],
): Promise<Certificate | null> {
  const repo = db.from("certificates");
  const existing = await repo.findOne({ user_id: userId, course_id: courseId });
  if (existing) return existing;
  if (!isEligibleForCertificate(tree, progress)) return null;
  const profile = await db.from("profiles").get(userId);
  if (!profile) return null;
  let code = makeVerifyCode();
  while (await repo.findOne({ verify_code: code })) code = makeVerifyCode();
  const cert = await repo.insert({
    id: newId(),
    user_id: userId,
    course_id: courseId,
    issued_at: nowIso(),
    verify_code: code,
    learner_name: profile.name,
    course_title: tree.course.title,
    revoked_at: null,
  });
  try {
    const { sendTemplate } = await import("@/lib/email/send");
    await sendTemplate("certificate-earned", profile.email, {
      name: profile.name,
      courseTitle: tree.course.title,
      certificateUrl: `${site.url}/certificates/${cert.id}`,
      verifyUrl: `${site.url}/verify/${cert.verify_code}`,
    });
  } catch (err) {
    console.warn("[certificates] email failed", err);
  }
  return cert;
}

export async function listCertificatesForUser(userId: string): Promise<Certificate[]> {
  const { db } = await getServices();
  return db.from("certificates").list({ where: { user_id: userId }, orderBy: ["issued_at", "desc"] });
}

export async function getCertificateByVerifyCode(code: string): Promise<Certificate | null> {
  const { db } = await getServices();
  return db.from("certificates").findOne({ verify_code: code.toUpperCase() });
}

export async function getCertificateForUser(id: string, userId: string): Promise<Certificate | null> {
  const { db } = await getServices();
  const cert = await db.from("certificates").get(id);
  if (!cert || cert.user_id !== userId) return null;
  return cert;
}
