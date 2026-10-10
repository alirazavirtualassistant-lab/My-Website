import { describe, expect, it } from "vitest";
import { constantTimeEqual, registerGuard, setupCodeMatches } from "@/app/admin/register/logic";

describe("registerGuard", () => {
  it("refuses when the setup code is not configured", () => {
    expect(registerGuard({ setupCodeConfigured: false, adminExists: false, demo: true })).toEqual({ allowed: false, reason: "not_configured" });
  });

  it("allows the very first admin", () => {
    expect(registerGuard({ setupCodeConfigured: true, adminExists: false, demo: false })).toEqual({ allowed: true, reason: "first_admin" });
  });

  it("closes once an admin exists on a live site", () => {
    expect(registerGuard({ setupCodeConfigured: true, adminExists: true, demo: false })).toEqual({ allowed: false, reason: "admin_exists" });
  });

  it("still allows extra admins in demo mode", () => {
    expect(registerGuard({ setupCodeConfigured: true, adminExists: true, demo: true })).toEqual({ allowed: true, reason: "demo_extra_admin" });
  });
});

describe("constantTimeEqual / setupCodeMatches", () => {
  it("compares correctly regardless of length", () => {
    expect(constantTimeEqual("abc", "abc")).toBe(true);
    expect(constantTimeEqual("abc", "abd")).toBe(false);
    expect(constantTimeEqual("abc", "abcd")).toBe(false);
    expect(constantTimeEqual("", "")).toBe(true);
    expect(constantTimeEqual("", "a")).toBe(false);
    expect(constantTimeEqual("héllo", "héllo")).toBe(true);
    expect(constantTimeEqual("héllo", "hello")).toBe(false);
  });

  it("never matches when nothing is configured", () => {
    expect(setupCodeMatches("", "")).toBe(false);
    expect(setupCodeMatches("", "anything")).toBe(false);
  });

  it("trims surrounding whitespace on both sides", () => {
    expect(setupCodeMatches("s3cret-code", "  s3cret-code\n")).toBe(true);
    expect(setupCodeMatches("s3cret-code", "s3cret-cod")).toBe(false);
  });
});
