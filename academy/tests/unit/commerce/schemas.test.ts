import { describe, expect, it } from "vitest";
import { formDataToObject, normalizeCheckoutLines, parseCheckoutForm, giftDetailsSchema, acknowledgementSchema } from "@/components/checkout/schemas";

describe("parseCheckoutForm", () => {
  it("signed-in checkout only needs the acknowledgement", () => {
    const res = parseCheckoutForm({ acknowledged: "on" }, { signedIn: true, gift: false });
    expect(res.ok).toBe(true);
    if (!res.ok) throw new Error("unreachable");
    expect(res.data).toEqual({ email: null, name: null, acknowledged: true, gift: null });
  });

  it("rejects a missing acknowledgement with a field error", () => {
    const res = parseCheckoutForm({}, { signedIn: true, gift: false });
    expect(res.ok).toBe(false);
    if (res.ok) throw new Error("unreachable");
    expect(res.errors.acknowledged).toMatch(/medical disclaimer/i);
  });

  it("guest checkout requires a valid email and a name (email is normalised)", () => {
    const bad = parseCheckoutForm({ acknowledged: "on", email: "nope", name: "" }, { signedIn: false, gift: false });
    expect(bad.ok).toBe(false);
    if (bad.ok) throw new Error("unreachable");
    expect(bad.errors.email).toBeTruthy();
    expect(bad.errors.name).toBeTruthy();

    const good = parseCheckoutForm({ acknowledged: "on", email: "  Sam@Example.COM ", name: " Sam Rivera " }, { signedIn: false, gift: false });
    expect(good.ok).toBe(true);
    if (!good.ok) throw new Error("unreachable");
    expect(good.data.email).toBe("sam@example.com");
    expect(good.data.name).toBe("Sam Rivera");
  });

  it("gift mode requires the recipient block and keeps the message verbatim", () => {
    const missing = parseCheckoutForm({ acknowledged: "on" }, { signedIn: true, gift: true });
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("unreachable");
    expect(missing.errors.recipient_name).toBeTruthy();
    expect(missing.errors.recipient_email).toBeTruthy();

    const ok = parseCheckoutForm(
      { acknowledged: "1", recipient_name: "Jo", recipient_email: "jo@example.com", message: "  Thinking of you both.  " },
      { signedIn: true, gift: true },
    );
    expect(ok.ok).toBe(true);
    if (!ok.ok) throw new Error("unreachable");
    expect(ok.data.gift).toEqual({ recipient_name: "Jo", recipient_email: "jo@example.com", message: "Thinking of you both." });
  });

  it("collects errors from both the base form and the gift block in one pass", () => {
    const res = parseCheckoutForm({ email: "bad", name: "", recipient_email: "bad" }, { signedIn: false, gift: true });
    expect(res.ok).toBe(false);
    if (res.ok) throw new Error("unreachable");
    expect(Object.keys(res.errors).sort()).toEqual(["acknowledged", "email", "name", "recipient_email", "recipient_name"]);
  });

  it("limits the gift message to 1,000 characters", () => {
    const res = giftDetailsSchema.safeParse({ recipient_name: "Jo", recipient_email: "jo@example.com", message: "x".repeat(1001) });
    expect(res.success).toBe(false);
  });

  it("treats checkbox values the way FormData sends them", () => {
    expect(acknowledgementSchema.safeParse("on").success).toBe(true);
    expect(acknowledgementSchema.safeParse("true").success).toBe(true);
    expect(acknowledgementSchema.safeParse(undefined).success).toBe(false);
    expect(acknowledgementSchema.safeParse("off").success).toBe(false);
  });
});

describe("normalizeCheckoutLines", () => {
  it("dedupes products and forces one unit each", () => {
    const lines = normalizeCheckoutLines([
      { product_id: "a", quantity: 3 },
      { product_id: "b", quantity: 1 },
      { product_id: "a", quantity: 1 },
      { product_id: "", quantity: 1 },
      { product_id: "c", quantity: 0 },
    ]);
    expect(lines).toEqual([
      { product_id: "a", quantity: 1 },
      { product_id: "b", quantity: 1 },
    ]);
  });

  it("returns an empty list for an empty cart", () => {
    expect(normalizeCheckoutLines([])).toEqual([]);
  });
});

describe("formDataToObject", () => {
  it("takes the first value per key and skips React internals", () => {
    const fd = new FormData();
    fd.append("email", "a@example.com");
    fd.append("email", "b@example.com");
    fd.append("$ACTION_ID", "x");
    expect(formDataToObject(fd)).toEqual({ email: "a@example.com" });
  });
});
