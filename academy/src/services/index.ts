import "server-only";
import { env } from "@/lib/env";
import type { Services, DataStore, AuthProvider, PaymentsProvider, StorageProvider, VideoProvider, EmailProvider } from "./types";

/**
 * Service factory. Adapters are chosen by env vars and cached per process.
 * Each adapter module exports a `create*` function with the signature below so
 * they can be developed independently.
 */

type Factories = {
  db: () => Promise<DataStore>;
  auth: (db: DataStore, email: EmailProvider) => Promise<AuthProvider>;
  payments: (db: DataStore) => Promise<PaymentsProvider>;
  storage: (db: DataStore) => Promise<StorageProvider>;
  video: (db: DataStore, storage: StorageProvider) => Promise<VideoProvider>;
  email: (db: DataStore) => Promise<EmailProvider>;
};

const factories: Record<"mock" | "supabase", Pick<Factories, "db" | "auth" | "storage">> & {
  payments: Record<"mock" | "stripe", Factories["payments"]>;
  video: Record<"mock" | "mux", Factories["video"]>;
  email: Record<"mock" | "resend", Factories["email"]>;
} = {
  mock: {
    db: async () => (await import("./mock/db")).createMockDb(),
    auth: async (db, email) => (await import("./mock/auth")).createMockAuth(db, email),
    storage: async (db) => (await import("./mock/storage")).createMockStorage(db),
  },
  supabase: {
    db: async () => (await import("./supabase/db")).createSupabaseDb(),
    auth: async (db, email) => (await import("./supabase/auth")).createSupabaseAuth(db, email),
    storage: async (db) => (await import("./supabase/storage")).createSupabaseStorage(db),
  },
  payments: {
    mock: async (db) => (await import("./mock/payments")).createMockPayments(db),
    stripe: async (db) => (await import("./stripe/payments")).createStripePayments(db),
  },
  video: {
    mock: async (db, storage) => (await import("./mock/video")).createMockVideo(db, storage),
    mux: async (db, storage) => (await import("./mux/video")).createMuxVideo(db, storage),
  },
  email: {
    mock: async (db) => (await import("./mock/email")).createMockEmail(db),
    resend: async (db) => (await import("./resend/email")).createResendEmail(db),
  },
};

declare global {
  // eslint-disable-next-line no-var
  var __cycServices: Promise<Services> | undefined;
}

async function build(): Promise<Services> {
  const backend = env.backend;
  const db = await factories[backend].db();
  const email = await factories.email[env.email](db);
  const auth = await factories[backend].auth(db, email);
  const storage = await factories[backend].storage(db);
  const payments = await factories.payments[env.payments](db);
  const video = await factories.video[env.video](db, storage);
  return {
    db,
    auth,
    payments,
    storage,
    video,
    email,
    mode: {
      backend,
      payments: env.payments,
      video: env.video,
      email: env.email,
      demo: env.demo,
    },
  };
}

export function getServices(): Promise<Services> {
  if (!globalThis.__cycServices) {
    globalThis.__cycServices = build().catch((err) => {
      globalThis.__cycServices = undefined;
      throw err;
    });
  }
  return globalThis.__cycServices;
}

/** Test helper: drop the cached services so a new store is built. */
export function resetServicesCache() {
  globalThis.__cycServices = undefined;
}
