import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  deleteAccountSchema,
  emailPreferencesSchema,
  errorField,
  fieldErrors,
  formToObject,
  groupTimeZones,
  isHoneypotTripped,
  maskEmail,
  parseForm,
  passwordStrength,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  timeZoneLabel,
} from "@/components/auth/logic";

function fd(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [k, v] of Object.entries(entries)) data.set(k, v);
  return data;
}

describe("signUpSchema", () => {
  const good = { name: " Cynthia ", email: "Cynthia@Example.com ", password: "babysteps1", remember: "on", consent: "on", next: "/learn", website: "" };

  it("accepts a valid form and normalises email/name", () => {
    const r = parseForm(signUpSchema, fd(good));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.email).toBe("cynthia@example.com");
    expect(r.data.name).toBe("Cynthia");
    expect(r.data.remember).toBe(true);
    expect(r.data.consent).toBe(true);
    expect(r.data.next).toBe("/learn");
  });

  it("requires consent and reports one message per field", () => {
    const r = parseForm(signUpSchema, fd({ ...good, consent: "", password: "short", email: "nope" }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.consent).toMatch(/agree/i);
    expect(r.errors.password).toMatch(/8 characters/);
    expect(r.errors.email).toMatch(/valid email/i);
    expect(r.summary).toHaveLength(3);
  });

  it("treats missing checkboxes as false", () => {
    const r = parseForm(signUpSchema, fd({ ...good, remember: "" }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.remember).toBe(false);
  });

  it("sanitises open redirects in next", () => {
    for (const next of ["https://evil.example", "//evil.example", ""]) {
      const r = parseForm(signUpSchema, fd({ ...good, next }));
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.data.next).toBe("/learn");
    }
    const r = parseForm(signUpSchema, fd({ ...good, next: "/courses/baby-steps" }));
    if (r.ok) expect(r.data.next).toBe("/courses/baby-steps");
  });
});

describe("signInSchema", () => {
  it("needs an email and a password", () => {
    const r = parseForm(signInSchema, fd({ email: "", password: "" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "password"]);
  });
});

describe("password schemas", () => {
  it("resetPasswordSchema insists the confirmation matches", () => {
    const r = parseForm(resetPasswordSchema, fd({ token: "x".repeat(32), password: "babysteps1", confirm: "babysteps2" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.confirm).toMatch(/match/i);
  });

  it("changePasswordSchema rejects re-using the current password", () => {
    const r = parseForm(changePasswordSchema, fd({ current: "babysteps1", password: "babysteps1", confirm: "babysteps1" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.password).toMatch(/different/i);
  });

  it("changePasswordSchema accepts a proper change", () => {
    const r = parseForm(changePasswordSchema, fd({ current: "old-pass-1", password: "new-pass-22", confirm: "new-pass-22" }));
    expect(r.ok).toBe(true);
  });
});

describe("passwordStrength", () => {
  it("scores from empty to strong", () => {
    expect(passwordStrength("").score).toBe(0);
    expect(passwordStrength("abc").score).toBe(1);
    expect(passwordStrength("abc").problem).toMatch(/8 characters/);
    expect(passwordStrength("abcdefgh").problem).toMatch(/number/);
    expect(passwordStrength("abcdefg1")).toMatchObject({ score: 2, label: "Okay", meetsMinimum: true });
    expect(passwordStrength("abcdefghijkl1").score).toBe(3);
    expect(passwordStrength("Abcdefghijklmnop1!")).toMatchObject({ score: 4, label: "Strong" });
  });
});

describe("misc schemas", () => {
  it("deleteAccountSchema only accepts DELETE in capitals", () => {
    expect(parseForm(deleteAccountSchema, fd({ confirm: "delete" })).ok).toBe(false);
    expect(parseForm(deleteAccountSchema, fd({ confirm: " DELETE " })).ok).toBe(true);
  });

  it("emailPreferencesSchema maps switches to booleans", () => {
    const r = parseForm(emailPreferencesSchema, fd({ newsletter: "on", community: "on" }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual({ progress_nudges: false, drip_unlocks: false, newsletter: true, community: true });
  });
});

describe("helpers", () => {
  it("formToObject keeps the first string value per key and skips files", () => {
    const data = new FormData();
    data.append("a", "1");
    data.append("a", "2");
    data.append("f", new File(["x"], "x.txt"));
    expect(formToObject(data)).toEqual({ a: "1" });
  });

  it("fieldErrors keeps the first issue per path", () => {
    const r = signUpSchema.safeParse({});
    expect(r.success).toBe(false);
    if (r.success) return;
    const { errors, summary } = fieldErrors(r.error);
    expect(errors.email).toBeDefined();
    expect(summary.length).toBe(Object.keys(errors).length);
  });

  it("honeypot detection", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped("   ")).toBe(false);
    expect(isHoneypotTripped(null)).toBe(false);
    expect(isHoneypotTripped("http://spam")).toBe(true);
  });

  it("errorField routes codes to fields", () => {
    expect(errorField("email_taken")).toBe("email");
    expect(errorField("unverified")).toBe("email");
    expect(errorField("weak_password")).toBe("password");
    expect(errorField("rate_limited")).toBe("form");
    expect(errorField(undefined)).toBe("form");
  });

  it("groups and labels time zones", () => {
    const groups = groupTimeZones(["Europe/London", "America/New_York", "UTC", "America/Argentina/Buenos_Aires", "Asia/Tokyo"]);
    expect(groups.map((g) => g.region)).toEqual(["America", "Europe", "Asia", "Other"]);
    expect(groups[0].zones).toEqual(["America/Argentina/Buenos_Aires", "America/New_York"]);
    expect(timeZoneLabel("America/Argentina/Buenos_Aires")).toBe("Buenos Aires");
    expect(timeZoneLabel("UTC")).toBe("UTC");
  });

  it("masks emails", () => {
    expect(maskEmail("cynthia@example.com")).toBe("c••••••@example.com");
    expect(maskEmail("not-an-email")).toBe("not-an-email");
  });
});
