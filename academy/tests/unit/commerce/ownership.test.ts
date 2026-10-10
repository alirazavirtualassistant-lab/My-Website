import { describe, expect, it } from "vitest";
import { canViewOrder, publicOrderStatus } from "@/components/checkout/ownership";

const order = { user_id: "user-1", email: "buyer@example.com" };
const nobody = { userId: null, email: null, role: null, guestEmail: null } as const;

describe("canViewOrder", () => {
  it("lets the signed-in buyer see their order", () => {
    expect(canViewOrder(order, { ...nobody, userId: "user-1", email: "buyer@example.com", role: "learner" })).toBe(true);
  });

  it("refuses another signed-in learner", () => {
    expect(canViewOrder(order, { ...nobody, userId: "user-2", email: "other@example.com", role: "learner" })).toBe(false);
  });

  it("lets a guest in only with the matching checkout cookie (case-insensitive)", () => {
    expect(canViewOrder(order, { ...nobody, guestEmail: "Buyer@Example.com" })).toBe(true);
    expect(canViewOrder(order, { ...nobody, guestEmail: "someone@example.com" })).toBe(false);
    expect(canViewOrder(order, nobody)).toBe(false);
  });

  it("matches a signed-in user by email when the order was placed as a guest", () => {
    const guestOrder = { user_id: null, email: "buyer@example.com" };
    expect(canViewOrder(guestOrder, { ...nobody, userId: "user-9", email: "buyer@example.com", role: "learner" })).toBe(true);
    expect(canViewOrder(guestOrder, { ...nobody, userId: "user-9", email: "else@example.com", role: "learner" })).toBe(false);
  });

  it("always lets staff through", () => {
    expect(canViewOrder(order, { ...nobody, userId: "admin-1", email: "cynthia@example.com", role: "admin" })).toBe(true);
    expect(canViewOrder(order, { ...nobody, userId: "asst-1", email: "a@example.com", role: "assistant" })).toBe(true);
  });

  it("never matches on empty emails", () => {
    expect(canViewOrder({ user_id: null, email: "" }, { ...nobody, guestEmail: "" })).toBe(false);
    expect(canViewOrder({ user_id: null, email: "" }, { ...nobody, userId: "u", email: "", role: "learner" })).toBe(false);
  });
});

describe("publicOrderStatus", () => {
  it("collapses statuses for the confirmation page", () => {
    expect(publicOrderStatus("pending")).toBe("pending");
    expect(publicOrderStatus("paid")).toBe("paid");
    expect(publicOrderStatus("partially_refunded")).toBe("paid");
    expect(publicOrderStatus("refunded")).toBe("refunded");
    expect(publicOrderStatus("failed")).toBe("failed");
  });
});
