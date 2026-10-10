/**
 * Centralised, typed access to environment variables. Server-only values are
 * read lazily so client bundles never touch them.
 */

function bool(v: string | undefined, fallback: boolean): boolean {
  if (v === undefined || v === "") return fallback;
  return ["1", "true", "yes", "on"].includes(v.toLowerCase());
}

function pick<T extends string>(v: string | undefined, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(v ?? "") ? (v as T) : fallback;
}

export const env = {
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  },
  get backend() {
    return pick(process.env.BACKEND_PROVIDER, ["mock", "supabase"] as const, "mock");
  },
  get payments() {
    return pick(process.env.PAYMENTS_PROVIDER, ["mock", "stripe"] as const, "mock");
  },
  get video() {
    return pick(process.env.VIDEO_PROVIDER, ["mock", "mux"] as const, "mock");
  },
  get email() {
    return pick(process.env.EMAIL_PROVIDER, ["mock", "resend"] as const, "mock");
  },
  get demo() {
    return bool(process.env.DEMO_MODE, true);
  },
  get dataDir() {
    return process.env.DEMO_DATA_DIR ?? ".data";
  },
  get authSecret() {
    return process.env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me";
  },
  get adminSetupCode() {
    return process.env.ADMIN_SETUP_CODE ?? "";
  },
  get cronSecret() {
    return process.env.CRON_SECRET ?? "";
  },
  supabase: {
    get url() {
      return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    },
    get anonKey() {
      return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    },
    get serviceRoleKey() {
      return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    },
    get databaseUrl() {
      return process.env.DATABASE_URL ?? "";
    },
  },
  stripe: {
    get secretKey() {
      return process.env.STRIPE_SECRET_KEY ?? "";
    },
    get publishableKey() {
      return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
    },
    get webhookSecret() {
      return process.env.STRIPE_WEBHOOK_SECRET ?? "";
    },
    get taxEnabled() {
      return bool(process.env.STRIPE_TAX_ENABLED, false);
    },
  },
  mux: {
    get tokenId() {
      return process.env.MUX_TOKEN_ID ?? "";
    },
    get tokenSecret() {
      return process.env.MUX_TOKEN_SECRET ?? "";
    },
    get webhookSecret() {
      return process.env.MUX_WEBHOOK_SECRET ?? "";
    },
    get signingKeyId() {
      return process.env.MUX_SIGNING_KEY_ID ?? "";
    },
    get signingKeyPrivate() {
      return process.env.MUX_SIGNING_KEY_PRIVATE ?? "";
    },
  },
  resend: {
    get apiKey() {
      return process.env.RESEND_API_KEY ?? "";
    },
    get from() {
      return process.env.EMAIL_FROM ?? "Cradle Your Cravings <hello@cradleyourcravings.com>";
    },
    get adminNotificationEmail() {
      return process.env.ADMIN_NOTIFICATION_EMAIL ?? "support@cradleyourcravings.com";
    },
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
};
