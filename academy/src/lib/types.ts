/**
 * Domain types. Column names are snake_case and match the Postgres schema in
 * supabase/migrations so the same row shapes flow through the mock store and
 * the Supabase adapter without mapping.
 */

export type ISODate = string;
export type UUID = string;

export type Role = "learner" | "admin" | "assistant";

export interface Profile {
  id: UUID;
  email: string;
  name: string;
  avatar_url: string | null;
  role: Role;
  /** Marketing + progress nudges; billing emails always send. */
  email_preferences: {
    progress_nudges: boolean;
    drip_unlocks: boolean;
    newsletter: boolean;
    community: boolean;
  };
  disclaimer_accepted_at: ISODate | null;
  stripe_customer_id: string | null;
  timezone: string | null;
  created_at: ISODate;
  updated_at: ISODate;
  deleted_at: ISODate | null;
}

/** Mock-mode credential record (Supabase Auth owns this in real mode). */
export interface AuthUser {
  id: UUID; // same id as Profile.id
  email: string;
  password_hash: string | null;
  email_verified_at: ISODate | null;
  providers: Array<"password" | "magic_link" | "google">;
  created_at: ISODate;
}

export interface AuthToken {
  id: UUID;
  user_id: UUID | null;
  email: string;
  kind: "magic_link" | "verify_email" | "password_reset" | "set_password";
  token_hash: string;
  expires_at: ISODate;
  used_at: ISODate | null;
  created_at: ISODate;
}

export type CourseStatus = "draft" | "published" | "scheduled" | "archived";

export interface Course {
  id: UUID;
  slug: string;
  title: string;
  subtitle: string;
  description: string; // long description (markdown allowed)
  short_description: string; // catalog card
  thumbnail_path: string | null; // storage path in public-assets or null (illustration fallback)
  illustration: string | null; // key of a built-in line-art illustration
  status: CourseStatus;
  publish_at: ISODate | null;
  level: string;
  language: string;
  topics: string[]; // TopicKey[]
  badge: "bestseller" | "new" | null;
  partner_seat_enabled: boolean;
  certificate_enabled: boolean;
  lifetime_access: boolean;
  access_days: number | null; // when lifetime_access is false
  what_you_learn: string[]; // generated from module descriptions at import; editable
  requirements: string[];
  who_for: string[];
  faq: Array<{ q: string; a: string }>;
  duration_weeks: number | null;
  last_updated_at: ISODate;
  created_at: ISODate;
  updated_at: ISODate;
}

export type ModuleKind = "home" | "core" | "bonus" | "replay";

export interface Module {
  id: UUID;
  course_id: UUID;
  code: string; // M0, M1..M7, BONUS, REPLAY
  kind: ModuleKind;
  title: string;
  description: string;
  notes: string;
  position: number;
  drip_days: number; // 0 = immediately
  completion_xp: number; // module row XP (10) or home (5)
  header_image_path: string | null;
  illustration: string | null;
  required_for_certificate: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}

export type LessonStatus = "draft" | "published" | "scheduled";

export interface Lesson {
  id: UUID;
  module_id: UUID;
  course_id: UUID;
  code: string; // M1T1, M1T0, BONUS_T2a, REPLAY_T1 ...
  title: string;
  series: string | null; // e.g. "THE FIX for Cravings", "Group Coaching Replay"
  description: string;
  notes: string;
  planned_video_filename: string | null;
  video_provider: "none" | "mux" | "url";
  video_asset_id: string | null; // mux asset id
  video_playback_id: string | null; // mux playback id (signed)
  video_url: string | null; // direct/self-hosted url (storage path or https url)
  captions_path: string | null; // WebVTT storage path
  thumbnail_path: string | null;
  duration_sec: number;
  transcript: string; // teleprompter text, verbatim
  transcript_source_file: string | null;
  audio_slots: Array<{ key: string; label: string; file_path: string | null }>;
  is_preview: boolean;
  is_intro: boolean; // MxT0 module introduction
  position: number;
  drip_days_override: number | null;
  status: LessonStatus;
  publish_at: ISODate | null;
  /** Lessons that say "check with your doctor" show a soft callout. */
  doctor_callout: boolean;
  /** Native in-app form attached to this lesson. */
  quiz_key: string | null;
  created_at: ISODate;
  updated_at: ISODate;
}

export type ResourceType = "pdf" | "xlsx" | "mp3" | "docx" | "image" | "other";

export interface LessonResource {
  id: UUID;
  course_id: UUID;
  lesson_id: UUID | null;
  module_id: UUID | null; // module-level resource when lesson_id is null
  file_path: string; // storage path in course-resources bucket
  label: string; // e.g. "Connection Workbook (Visioning)"
  file_name: string;
  type: ResourceType;
  size_bytes: number;
  position: number;
  created_at: ISODate;
}

export type ActionStepKind = "consumption" | "implementation" | "optional" | "rare";
export type UploadType = "photo" | "pdf" | "journal" | "any";
export type ActionLink =
  | { type: "forum" }
  | { type: "quiz"; quiz_key: string }
  | { type: "survey"; quiz_key: string }
  | { type: "upload"; upload_type: UploadType }
  | { type: "testimonial" }
  | { type: "none" };

export interface ActionStep {
  id: UUID;
  lesson_id: UUID;
  course_id: UUID;
  label: string; // display label (placeholder links stripped)
  source_label: string; // verbatim sheet text
  kind: ActionStepKind;
  xp: number;
  requires_upload: boolean;
  upload_type: UploadType | null;
  link: ActionLink;
  position: number;
  /** Optional sub-checklist (e.g. the three pre-actions). */
  sub_items: Array<{ key: string; label: string; xp: number }> | null;
  created_at: ISODate;
}

export type ProductType = "course" | "bundle" | "subscription" | "payment_plan";

export interface Product {
  id: UUID;
  type: ProductType;
  slug: string;
  title: string;
  description: string;
  course_ids: UUID[]; // courses granted (all current+future for subscription)
  grants_all_courses: boolean;
  price_cents: number;
  sale_price_cents: number | null;
  sale_ends_at: ISODate | null;
  currency: string;
  interval: "month" | "year" | null; // subscriptions
  installments: number | null; // payment plans
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  stripe_sale_price_id: string | null;
  active: boolean;
  is_free: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface Coupon {
  id: UUID;
  code: string; // uppercase
  kind: "percent" | "fixed";
  amount: number; // percent (1-100) or cents
  expires_at: ISODate | null;
  max_uses: number | null;
  uses: number;
  product_ids: UUID[]; // empty = all
  stripe_coupon_id: string | null;
  stripe_promotion_code_id: string | null;
  active: boolean;
  created_at: ISODate;
}

export type OrderStatus = "pending" | "paid" | "refunded" | "partially_refunded" | "failed";

export interface Order {
  id: UUID;
  user_id: UUID | null;
  email: string;
  items: Array<{ product_id: UUID; title: string; unit_cents: number; quantity: number }>;
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  currency: string;
  coupon_code: string | null;
  status: OrderStatus;
  provider: "stripe" | "mock";
  provider_session_id: string | null; // checkout session id
  provider_payment_intent_id: string | null;
  provider_subscription_id: string | null;
  provider_event_ids: string[]; // processed webhook event ids (idempotency)
  gift: { recipient_email: string; recipient_name: string; message: string } | null;
  refunded_cents: number;
  created_at: ISODate;
  paid_at: ISODate | null;
  updated_at: ISODate;
}

export interface CheckoutSession {
  id: UUID;
  provider: "mock" | "stripe";
  user_id: UUID | null;
  email: string | null;
  items: Array<{ product_id: UUID; quantity: number }>;
  coupon_code: string | null;
  gift: Order["gift"];
  success_url: string;
  cancel_url: string;
  status: "open" | "complete" | "expired";
  order_id: UUID | null;
  created_at: ISODate;
}

export interface Subscription {
  id: UUID;
  user_id: UUID;
  product_id: UUID;
  provider_subscription_id: string | null;
  status: "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete";
  current_period_end: ISODate | null;
  cancel_at_period_end: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}

export type EnrollmentSource = "purchase" | "subscription" | "gift" | "comp" | "partner" | "free";
export type EnrollmentStatus = "active" | "revoked" | "expired";

export interface Enrollment {
  id: UUID;
  user_id: UUID;
  course_id: UUID;
  source: EnrollmentSource;
  order_id: UUID | null;
  subscription_id: UUID | null;
  started_at: ISODate; // drip clock starts here
  expires_at: ISODate | null;
  status: EnrollmentStatus;
  unlock_all: boolean; // admin override of drip
  partner_invites_remaining: number;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface PartnerLink {
  id: UUID;
  owner_user_id: UUID;
  partner_user_id: UUID | null;
  course_id: UUID;
  invite_email: string;
  token_hash: string;
  status: "pending" | "accepted" | "revoked";
  created_at: ISODate;
  accepted_at: ISODate | null;
}

export interface Gift {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  buyer_user_id: UUID | null;
  buyer_email: string;
  recipient_email: string;
  recipient_name: string;
  message: string;
  token_hash: string;
  status: "pending" | "redeemed" | "canceled";
  redeemed_by_user_id: UUID | null;
  redeemed_at: ISODate | null;
  created_at: ISODate;
}

export interface LessonProgress {
  id: UUID;
  user_id: UUID;
  lesson_id: UUID;
  course_id: UUID;
  completed_at: ISODate | null;
  last_position_sec: number;
  watched_sec: number;
  updated_at: ISODate;
}

export interface ActionStepCompletion {
  id: UUID;
  user_id: UUID;
  step_id: UUID;
  lesson_id: UUID;
  course_id: UUID;
  upload_path: string | null;
  sub_items_done: string[];
  completed_at: ISODate | null;
  created_at: ISODate;
}

export type XpReason =
  | "action_step"
  | "sub_item"
  | "lesson_complete"
  | "module_complete"
  | "course_goal"
  | "admin_adjustment";

export interface XpEntry {
  id: UUID;
  user_id: UUID;
  course_id: UUID | null;
  amount: number;
  reason: XpReason;
  ref_id: string | null; // step id / module id / goal key
  note: string | null;
  created_at: ISODate;
}

export interface Badge {
  id: UUID;
  key: string; // module:M1, goal:minimum, streak:7 ...
  title: string;
  description: string;
  icon: string;
  xp_bonus: number;
}

export interface UserBadge {
  id: UUID;
  user_id: UUID;
  badge_id: UUID;
  course_id: UUID | null;
  awarded_at: ISODate;
}

export interface Streak {
  id: UUID;
  user_id: UUID;
  current: number;
  longest: number;
  last_active_date: string; // YYYY-MM-DD
  updated_at: ISODate;
}

export type QuizQuestion =
  | { key: string; type: "scale"; text: string; min: number; max: number; labels: string[]; section?: string }
  | { key: string; type: "paragraph"; text: string; required: boolean; section?: string }
  | { key: string; type: "short"; text: string; required: boolean; section?: string }
  | { key: string; type: "choice"; text: string; options: string[]; required: boolean; section?: string }
  | { key: string; type: "yesno"; text: string; yes_value: number; section?: string };

export interface QuizDefinition {
  id: UUID;
  key: string; // wellness-quiz, gut-health-quiz, sensitivity-quiz, pre-course-survey
  course_id: UUID | null;
  title: string;
  intro: string;
  questions: QuizQuestion[];
  scoring: {
    kind: "sum" | "none";
    bands?: Array<{ min: number; max: number; label: string; text: string }>;
    sections?: Array<{ key: string; label: string; bands: Array<{ min: number; max: number; label: string; text: string }> }>;
  };
  confirmation: string;
  source_file: string | null;
}

export interface QuizResponse {
  id: UUID;
  user_id: UUID;
  quiz_key: string;
  course_id: UUID | null;
  answers: Record<string, string | number | null>;
  score: number | null;
  section_scores: Record<string, number> | null;
  submitted_at: ISODate;
}

export interface Note {
  id: UUID;
  user_id: UUID;
  lesson_id: UUID;
  course_id: UUID;
  body: string;
  position_sec: number | null;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface ForumCategory {
  id: UUID;
  course_id: UUID;
  module_id: UUID | null;
  slug: string;
  title: string;
  description: string;
  position: number;
}

export interface ForumPost {
  id: UUID;
  category_id: UUID;
  course_id: UUID;
  lesson_id: UUID | null;
  user_id: UUID;
  title: string;
  body: string;
  image_path: string | null;
  anonymous: boolean;
  pinned: boolean;
  locked: boolean;
  like_count: number;
  reply_count: number;
  status: "visible" | "hidden" | "removed";
  created_at: ISODate;
  updated_at: ISODate;
}

export interface ForumReply {
  id: UUID;
  post_id: UUID;
  user_id: UUID;
  body: string;
  anonymous: boolean;
  like_count: number;
  status: "visible" | "hidden" | "removed";
  created_at: ISODate;
}

export interface ForumLike {
  id: UUID;
  user_id: UUID;
  post_id: UUID | null;
  reply_id: UUID | null;
  created_at: ISODate;
}

export interface ForumReport {
  id: UUID;
  reporter_user_id: UUID;
  post_id: UUID | null;
  reply_id: UUID | null;
  reason: string;
  status: "open" | "resolved" | "dismissed";
  created_at: ISODate;
  resolved_at: ISODate | null;
}

export interface Certificate {
  id: UUID;
  user_id: UUID;
  course_id: UUID;
  issued_at: ISODate;
  verify_code: string; // short public code
  learner_name: string;
  course_title: string;
  revoked_at: ISODate | null;
}

export interface Testimonial {
  id: UUID;
  user_id: UUID | null;
  course_id: UUID | null;
  author_name: string;
  author_role: string | null;
  body: string;
  rating: number | null;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  created_at: ISODate;
  reviewed_at: ISODate | null;
}

export interface EmailEvent {
  id: UUID;
  to: string;
  template: string;
  subject: string;
  payload: Record<string, unknown>;
  html: string | null;
  provider: "mock" | "resend";
  provider_message_id: string | null;
  status: "sent" | "failed" | "queued";
  error: string | null;
  created_at: ISODate;
}

export interface Broadcast {
  id: UUID;
  subject: string;
  body: string; // markdown
  audience: "all" | "course" | "incomplete";
  course_id: UUID | null;
  sent_count: number;
  status: "draft" | "sent";
  created_by: UUID;
  created_at: ISODate;
  sent_at: ISODate | null;
}

export interface AuditLog {
  id: UUID;
  actor_user_id: UUID | null;
  action: string;
  target_type: string;
  target_id: string | null;
  meta: Record<string, unknown>;
  created_at: ISODate;
}

export interface SiteSettings {
  id: "default";
  site_name: string;
  logo_path: string | null;
  support_email: string;
  disclaimer_text: string;
  colors: Record<string, string> | null;
  legal: Record<string, string>; // slug -> markdown
  abandoned_cart_emails: boolean;
  weekly_nudges: boolean;
  testimonials_enabled: boolean;
  updated_at: ISODate;
}

export interface NewsletterSignup {
  id: UUID;
  email: string;
  source: string;
  created_at: ISODate;
}

export interface ContactMessage {
  id: UUID;
  name: string;
  email: string;
  message: string;
  created_at: ISODate;
}

export interface CartItem {
  product_id: UUID;
  quantity: number;
}

export interface WebhookEvent {
  id: UUID; // provider event id
  provider: "stripe" | "mock";
  type: string;
  processed_at: ISODate;
}

/** Map of table name -> row type. Both adapters implement every table. */
export interface Tables {
  profiles: Profile;
  auth_users: AuthUser;
  auth_tokens: AuthToken;
  courses: Course;
  modules: Module;
  lessons: Lesson;
  lesson_resources: LessonResource;
  action_steps: ActionStep;
  products: Product;
  coupons: Coupon;
  orders: Order;
  checkout_sessions: CheckoutSession;
  subscriptions: Subscription;
  enrollments: Enrollment;
  partner_links: PartnerLink;
  gifts: Gift;
  lesson_progress: LessonProgress;
  action_step_completions: ActionStepCompletion;
  xp_ledger: XpEntry;
  badges: Badge;
  user_badges: UserBadge;
  streaks: Streak;
  quiz_definitions: QuizDefinition;
  quiz_responses: QuizResponse;
  notes: Note;
  forum_categories: ForumCategory;
  forum_posts: ForumPost;
  forum_replies: ForumReply;
  forum_likes: ForumLike;
  forum_reports: ForumReport;
  certificates: Certificate;
  testimonials: Testimonial;
  email_events: EmailEvent;
  broadcasts: Broadcast;
  audit_log: AuditLog;
  site_settings: SiteSettings;
  newsletter_signups: NewsletterSignup;
  contact_messages: ContactMessage;
  webhook_events: WebhookEvent;
}

export type TableName = keyof Tables;

/** A course with its full tree, as used by the player, landing page and CMS. */
export interface CourseTree {
  course: Course;
  modules: Array<
    Module & {
      lessons: Array<Lesson & { resources: LessonResource[]; action_steps: ActionStep[] }>;
      resources: LessonResource[];
    }
  >;
}

/** Serializable course package produced by the importer (content/courses/<slug>/course.json). */
export interface CoursePackage {
  version: 1;
  generated_at: ISODate;
  source: { zip: string | null; sheet: string };
  course: Omit<Course, "id" | "created_at" | "updated_at" | "last_updated_at">;
  modules: Array<
    Omit<Module, "id" | "course_id" | "created_at" | "updated_at"> & {
      resources: Array<Omit<LessonResource, "id" | "course_id" | "lesson_id" | "module_id" | "created_at">>;
      lessons: Array<
        Omit<Lesson, "id" | "module_id" | "course_id" | "created_at" | "updated_at"> & {
          resources: Array<Omit<LessonResource, "id" | "course_id" | "lesson_id" | "module_id" | "created_at">>;
          action_steps: Array<Omit<ActionStep, "id" | "lesson_id" | "course_id" | "created_at">>;
        }
      >;
    }
  >;
  quizzes: Array<Omit<QuizDefinition, "id" | "course_id">>;
  forum_categories: Array<Omit<ForumCategory, "id" | "course_id" | "module_id"> & { module_code: string | null }>;
  stats: {
    lesson_count: number;
    resource_count: number;
    transcript_count: number;
    total_video_sec: number;
    total_xp: number;
    xp_by_module: Record<string, number>;
  };
}
