/**
 * Service contracts. Every feature talks to these interfaces only; the concrete
 * adapter (mock / Supabase / Stripe / Mux / Resend) is chosen by env vars in
 * src/services/index.ts.
 */
import type { Tables, TableName, Profile, Role } from "@/lib/types";

// ---------------------------------------------------------------------------
// Data store
// ---------------------------------------------------------------------------

export type Where<T> = Partial<{ [K in keyof T]: T[K] | T[K][] }>;

export interface ListOptions<T> {
  where?: Where<T>;
  orderBy?: [keyof T & string, "asc" | "desc"];
  limit?: number;
  offset?: number;
  /** Case-insensitive substring match on these string columns. */
  search?: { columns: Array<keyof T & string>; query: string };
}

export interface Repo<T extends { id: string }> {
  list(opts?: ListOptions<T>): Promise<T[]>;
  count(where?: Where<T>): Promise<number>;
  get(id: string): Promise<T | null>;
  findOne(where: Where<T>): Promise<T | null>;
  insert(row: T): Promise<T>;
  insertMany(rows: T[]): Promise<T[]>;
  update(id: string, patch: Partial<T>): Promise<T>;
  updateWhere(where: Where<T>, patch: Partial<T>): Promise<number>;
  delete(id: string): Promise<void>;
  deleteWhere(where: Where<T>): Promise<number>;
  /** Insert or replace by id. */
  upsert(row: T): Promise<T>;
}

export interface DataStore {
  readonly kind: "mock" | "supabase";
  from<K extends TableName>(table: K): Repo<Tables[K]>;
  /** Runs fn with a best-effort serialised scope (mock: in-process mutex; supabase: plain). */
  transaction<R>(fn: (db: DataStore) => Promise<R>): Promise<R>;
  /** Administrative reset used by tests and the demo "reset" button. */
  reset?(): Promise<void>;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface Session {
  user_id: string;
  email: string;
  role: Role;
  /** Mock sessions are signed JWT cookies; Supabase sessions come from @supabase/ssr. */
  provider: "mock" | "supabase";
  remember: boolean;
}

export type AuthResult =
  | { ok: true; session: Session; profile: Profile; needs_verification?: boolean }
  | { ok: false; error: string; code?: "invalid_credentials" | "email_taken" | "unverified" | "rate_limited" | "weak_password" | "unknown" };

export interface AuthProvider {
  readonly kind: "mock" | "supabase";
  /** Reads the current session from request cookies (server only). */
  getSession(): Promise<Session | null>;
  signUpWithPassword(input: {
    email: string;
    password: string;
    name: string;
    role?: Role;
    remember?: boolean;
    /** Skip verification email (admin-created accounts, guest checkout). */
    autoVerify?: boolean;
  }): Promise<AuthResult>;
  signInWithPassword(input: { email: string; password: string; remember?: boolean }): Promise<AuthResult>;
  signOut(): Promise<void>;
  sendMagicLink(input: { email: string; redirectTo?: string }): Promise<{ ok: boolean; error?: string }>;
  /** Mock: consume a token from /auth/magic?token=…  Supabase: exchange code in /auth/callback. */
  completeMagicLink(input: { token: string }): Promise<AuthResult>;
  sendVerificationEmail(input: { email: string }): Promise<{ ok: boolean; error?: string }>;
  verifyEmail(input: { token: string }): Promise<AuthResult>;
  requestPasswordReset(input: { email: string }): Promise<{ ok: boolean }>;
  resetPassword(input: { token: string; password: string }): Promise<AuthResult>;
  changePassword(input: { userId: string; currentPassword: string; newPassword: string }): Promise<{ ok: boolean; error?: string }>;
  /** URL to start an OAuth flow (Google). Mock returns an in-app demo URL. */
  oauthStartUrl(input: { provider: "google"; redirectTo?: string }): Promise<string>;
  completeOAuth(input: { code: string; state?: string }): Promise<AuthResult>;
  /** Creates an account without a password and emails a set-password link (guest checkout, gifts, partner invites). */
  ensureAccount(input: { email: string; name?: string; sendSetPassword?: boolean }): Promise<{ profile: Profile; created: boolean }>;
  /** Hard-deletes auth credentials; profile soft-delete handled by use cases. */
  deleteUser(userId: string): Promise<void>;
  /** Admin: set a user's password directly (team accounts). */
  adminSetPassword(input: { userId: string; password: string }): Promise<void>;
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export interface CheckoutLine {
  product_id: string;
  quantity: number;
}

export interface CreateCheckoutInput {
  lines: CheckoutLine[];
  user_id: string | null;
  email: string | null;
  coupon_code: string | null;
  gift: { recipient_email: string; recipient_name: string; message: string } | null;
  success_url: string;
  cancel_url: string;
  /** Subscription checkout when the single line is a subscription product. */
  mode: "payment" | "subscription";
  /** Pre-computed server-side amounts (cents) for mock mode & audit. */
  amounts: { subtotal_cents: number; discount_cents: number; total_cents: number };
}

export interface PaymentsProvider {
  readonly kind: "mock" | "stripe";
  createCheckoutSession(input: CreateCheckoutInput): Promise<{ url: string; session_id: string }>;
  createCustomerPortalSession(input: { customer_id: string; return_url: string }): Promise<{ url: string }>;
  /** Verifies signature and returns a normalised event. Throws on bad signature. */
  parseWebhook(input: { rawBody: string; signature: string | null }): Promise<NormalizedPaymentEvent>;
  refund(input: { payment_intent_id: string; amount_cents?: number }): Promise<{ ok: boolean; refund_id?: string; error?: string }>;
  cancelSubscription(input: { subscription_id: string; at_period_end: boolean }): Promise<{ ok: boolean; error?: string }>;
  /** Ensure a Stripe customer exists for a profile; mock returns a fake id. */
  ensureCustomer(input: { user_id: string; email: string; name: string }): Promise<string>;
  /** Admin: create/update products & prices in the provider. */
  syncProduct(input: {
    product_id: string;
    title: string;
    description: string;
    price_cents: number;
    sale_price_cents: number | null;
    currency: string;
    interval: "month" | "year" | null;
    installments: number | null;
  }): Promise<{ stripe_product_id: string; stripe_price_id: string; stripe_sale_price_id: string | null }>;
  syncCoupon(input: { code: string; kind: "percent" | "fixed"; amount: number; expires_at: string | null; max_uses: number | null }): Promise<{ stripe_coupon_id: string; stripe_promotion_code_id: string }>;
}

export type NormalizedPaymentEvent =
  | {
      id: string;
      type: "checkout.completed";
      session_id: string;
      payment_intent_id: string | null;
      subscription_id: string | null;
      customer_id: string | null;
      email: string | null;
      amount_total_cents: number;
      tax_cents: number;
      discount_cents: number;
      currency: string;
      metadata: Record<string, string>;
    }
  | { id: string; type: "invoice.paid"; subscription_id: string | null; customer_id: string | null; period_end: string | null; amount_cents: number }
  | { id: string; type: "subscription.updated"; subscription_id: string; status: string; current_period_end: string | null; cancel_at_period_end: boolean; customer_id: string | null }
  | { id: string; type: "subscription.deleted"; subscription_id: string; customer_id: string | null }
  | { id: string; type: "charge.refunded"; payment_intent_id: string | null; amount_refunded_cents: number; fully_refunded: boolean }
  | { id: string; type: "invoice.payment_failed"; subscription_id: string | null; customer_id: string | null }
  | { id: string; type: "ignored"; raw_type: string };

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------

export type Bucket = "course-resources" | "learner-uploads" | "public-assets" | "video-uploads";

export interface StorageProvider {
  readonly kind: "mock" | "supabase";
  /** Time-limited URL (default 10 minutes). */
  getSignedUrl(input: { bucket: Bucket; path: string; expiresInSec?: number; download?: string }): Promise<string>;
  /** Public URL for public-assets only. */
  getPublicUrl(input: { bucket: "public-assets"; path: string }): string;
  upload(input: { bucket: Bucket; path: string; data: Buffer | Uint8Array; contentType: string }): Promise<{ path: string; size: number }>;
  read(input: { bucket: Bucket; path: string }): Promise<{ data: Buffer; contentType: string } | null>;
  delete(input: { bucket: Bucket; path: string }): Promise<void>;
  list(input: { bucket: Bucket; prefix: string }): Promise<Array<{ path: string; size: number }>>;
  exists(input: { bucket: Bucket; path: string }): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

export type Playback =
  | { kind: "mux"; playback_id: string; token: string; thumbnail_token: string | null; storyboard_token: string | null }
  | { kind: "url"; src: string; captions: string | null; poster: string | null }
  | { kind: "none" };

export interface VideoProvider {
  readonly kind: "mock" | "mux";
  /** Returns a playback descriptor for an enrolled learner (signed when Mux). */
  getPlayback(input: {
    provider: "none" | "mux" | "url";
    playback_id: string | null;
    video_url: string | null;
    captions_path: string | null;
    thumbnail_path: string | null;
    user_id: string | null;
  }): Promise<Playback>;
  /** Admin: direct-upload URL for a lesson video. */
  createDirectUpload(input: { lesson_id: string; filename: string; cors_origin: string }): Promise<{ upload_url: string; upload_id: string }>;
  /** Mux webhook -> lesson update payload. */
  parseWebhook(input: { rawBody: string; signature: string | null }): Promise<
    | { type: "asset.ready"; upload_id: string | null; asset_id: string; playback_id: string; duration_sec: number | null }
    | { type: "asset.errored"; upload_id: string | null; asset_id: string }
    | { type: "ignored" }
  >;
  deleteAsset(asset_id: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export interface EmailMessage {
  to: string;
  subject: string;
  template: string;
  react: React.ReactElement;
  text?: string;
  payload?: Record<string, unknown>;
  replyTo?: string;
}

export interface EmailProvider {
  readonly kind: "mock" | "resend";
  send(message: EmailMessage): Promise<{ ok: boolean; id?: string; error?: string }>;
}

// ---------------------------------------------------------------------------
// Aggregate
// ---------------------------------------------------------------------------

export interface Services {
  db: DataStore;
  auth: AuthProvider;
  payments: PaymentsProvider;
  storage: StorageProvider;
  video: VideoProvider;
  email: EmailProvider;
  mode: {
    backend: "mock" | "supabase";
    payments: "mock" | "stripe";
    video: "mock" | "mux";
    email: "mock" | "resend";
    demo: boolean;
  };
}
