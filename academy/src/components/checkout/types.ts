/** Serialisable state shapes shared by the checkout Server Actions and Client Components. */
import type { CheckoutFieldErrors } from "./schemas";

export type CheckoutErrorCode = "empty_cart" | "coupon" | "email" | "unknown";

export interface CheckoutFormState {
  status: "idle" | "error";
  errors?: CheckoutFieldErrors;
  code?: CheckoutErrorCode;
  /** Changes on every failed submit so the error summary can re-announce. */
  stamp?: number;
}

export const idleCheckoutState: CheckoutFormState = { status: "idle" };

export interface SimpleActionState {
  status: "idle" | "error" | "success";
  message?: string;
  stamp?: number;
}

export const idleActionState: SimpleActionState = { status: "idle" };

export interface OrderStatusResponse {
  id: string;
  status: "pending" | "paid" | "refunded" | "failed";
  paid: boolean;
}
