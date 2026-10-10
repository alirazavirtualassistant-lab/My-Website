import { describe, expect, it } from "vitest";
import {
  VERIFY_CODE_ALPHABET,
  VERIFY_CODE_LENGTH,
  certificateRequirements,
  isEligibleForCertificate,
  isValidVerifyCode,
  linkedInAddToProfileUrl,
  makeVerifyCode,
  normalizeVerifyCode,
} from "@/lib/domain/certificates";
import { NOW, completeLessons, completeModules, makeProgressRow, makeSheetTree, makeTree, makeTreeLesson, makeTreeModule } from "./fixtures";

describe("certificateRequirements / isEligibleForCertificate", () => {
  const tree = makeSheetTree();

  it("requires every lesson in Course Home and M1–M7, not Bonus or Replay", () => {
    const none = certificateRequirements(tree, []);
    expect(none.enabled).toBe(true);
    expect(none.requiredTotal).toBe(53);
    expect(none.requiredCompleted).toBe(0);
    expect(none.missingLessonIds).toHaveLength(53);
    expect(none.missingLessonIds[0]).toBe("M0T0");
    expect(none.eligible).toBe(false);

    const required = completeModules(tree, (m) => m.required_for_certificate);
    expect(isEligibleForCertificate(tree, required)).toBe(true);
    expect(certificateRequirements(tree, required).missingLessonIds).toEqual([]);
  });

  it("is not satisfied by bonus/replay completions", () => {
    const extras = completeModules(tree, (m) => !m.required_for_certificate);
    expect(isEligibleForCertificate(tree, extras)).toBe(false);
  });

  it("fails with a single missing required lesson", () => {
    const rows = completeModules(tree, (m) => m.required_for_certificate).filter((r) => r.lesson_id !== "M7T6");
    const req = certificateRequirements(tree, rows);
    expect(req.requiredCompleted).toBe(52);
    expect(req.missingLessonIds).toEqual(["M7T6"]);
    expect(req.eligible).toBe(false);
    expect(isEligibleForCertificate(tree, [...rows, makeProgressRow("M7T6", false)])).toBe(false);
  });

  it("respects course.certificate_enabled", () => {
    const disabled = makeSheetTree({ certificate_enabled: false });
    const rows = completeModules(disabled);
    expect(certificateRequirements(disabled, rows).enabled).toBe(false);
    expect(isEligibleForCertificate(disabled, rows)).toBe(false);
  });

  it("never issues for a course with no required lessons", () => {
    const t = makeTree({ modules: [makeTreeModule({ required_for_certificate: false, lessons: [makeTreeLesson({ id: "a" })] })] });
    expect(isEligibleForCertificate(t, [makeProgressRow("a")])).toBe(false);
    expect(isEligibleForCertificate(makeTree(), [])).toBe(false);
  });

  it("ignores draft lessons and counts scheduled ones once released", () => {
    const t = makeTree({
      modules: [
        makeTreeModule({
          lessons: [makeTreeLesson({ id: "a" }), makeTreeLesson({ id: "d", status: "draft" }), makeTreeLesson({ id: "s", status: "scheduled", publish_at: "2026-10-01T00:00:00Z" })],
        }),
      ],
    });
    expect(isEligibleForCertificate(t, [makeProgressRow("a")])).toBe(true);
    expect(isEligibleForCertificate(t, [makeProgressRow("a")], NOW)).toBe(false);
    expect(isEligibleForCertificate(t, completeLessons(t, ["a", "s"]), NOW)).toBe(true);
  });
});

describe("makeVerifyCode", () => {
  it("produces 10 characters from the unambiguous alphabet by default", () => {
    const code = makeVerifyCode();
    expect(code).toHaveLength(VERIFY_CODE_LENGTH);
    expect(isValidVerifyCode(code)).toBe(true);
    expect(makeVerifyCode()).not.toBe(code);
  });

  it("is deterministic with an injected rng", () => {
    const zeros = makeVerifyCode({ random: (n) => new Uint8Array(n) });
    expect(zeros).toBe("AAAAAAAAAA");
    const seq = makeVerifyCode({ random: (n) => Array.from({ length: n }, (_, i) => i) });
    expect(seq).toBe(VERIFY_CODE_ALPHABET.slice(0, 10));
    expect(makeVerifyCode({ random: (n) => Array.from({ length: n }, () => 33) })).toBe("BBBBBBBBBB");
    expect(makeVerifyCode({ random: (n) => Array.from({ length: n }, () => 255), length: 4 })).toBe("9999");
  });

  it("honours the length option (minimum 4)", () => {
    expect(makeVerifyCode({ length: 6 })).toHaveLength(6);
    expect(makeVerifyCode({ length: 1, random: (n) => new Uint8Array(n) })).toBe("AAAA");
  });
});

describe("verify code helpers", () => {
  it("normalises user input", () => {
    expect(normalizeVerifyCode(" k7pq-2mxd 4r ")).toBe("K7PQ2MXD4R");
    expect(normalizeVerifyCode("")).toBe("");
  });

  it("validates length and alphabet", () => {
    expect(isValidVerifyCode("K7PQ2MXD4R")).toBe(true);
    expect(isValidVerifyCode("K7PQ2MXD4")).toBe(false);
    expect(isValidVerifyCode("K7PQ2MXD40")).toBe(false); // 0 is not in the alphabet
    expect(isValidVerifyCode("K7PQ2MXD4O")).toBe(false);
    expect(isValidVerifyCode("k7pq2mxd4r")).toBe(false);
    expect(isValidVerifyCode("ABCDEF", 6)).toBe(true);
  });
});

describe("linkedInAddToProfileUrl", () => {
  it("builds the Add to profile deep link in LinkedIn's parameter order", () => {
    const url = linkedInAddToProfileUrl({
      name: "Baby Steps to Conception",
      organizationName: "Cradle Your Cravings Academy",
      issueYear: 2026,
      issueMonth: 10,
      certUrl: "https://academy.example.com/verify/K7PQ2MXD4R",
      certId: "K7PQ2MXD4R",
    });
    expect(url).toBe(
      "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Baby+Steps+to+Conception&organizationName=Cradle+Your+Cravings+Academy&issueYear=2026&issueMonth=10&certUrl=https%3A%2F%2Facademy.example.com%2Fverify%2FK7PQ2MXD4R&certId=K7PQ2MXD4R",
    );
    const parsed = new URL(url);
    expect(parsed.searchParams.get("certUrl")).toBe("https://academy.example.com/verify/K7PQ2MXD4R");
    expect(parsed.searchParams.get("name")).toBe("Baby Steps to Conception");
  });

  it("prefers organizationId when given and clamps months", () => {
    const url = new URL(
      linkedInAddToProfileUrl({
        name: "Course",
        organizationName: "Org",
        organizationId: 12345,
        issueYear: 2026.9,
        issueMonth: 13,
        expirationYear: 2027,
        expirationMonth: 0,
        certUrl: "https://x.test/c",
        certId: "abc",
      }),
    );
    expect(url.searchParams.get("organizationId")).toBe("12345");
    expect(url.searchParams.has("organizationName")).toBe(false);
    expect(url.searchParams.get("issueYear")).toBe("2026");
    expect(url.searchParams.get("issueMonth")).toBe("12");
    expect(url.searchParams.get("expirationYear")).toBe("2027");
    expect(url.searchParams.get("expirationMonth")).toBe("1");
  });
});
