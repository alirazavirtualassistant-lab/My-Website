/**
 * Supabase clients (server only).
 *
 * - createServerSupabase(): per-request client bound to the Next.js cookie
 *   jar via @supabase/ssr (getAll/setAll). Use it for anything acting *as the
 *   signed-in user* (auth flows). setAll is wrapped in try/catch because
 *   Server Components cannot write cookies; token refreshes are then handled
 *   by the request proxy (src/proxy.ts).
 * - createAdminSupabase(): process-wide client using the service-role key.
 *   Bypasses RLS; never import from client code. Used by the DataStore,
 *   storage and admin auth operations.
 *
 * Both are lazy: nothing reads env at import time, so the module compiles and
 * loads in mock mode without Supabase env values present.
 */
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export type ServerSupabase = SupabaseClient;
export type AdminSupabase = SupabaseClient;

function requireEnv(name: string, value: string): string {
  if (!value) {
    throw new Error(`[supabase] ${name} is not set. Add it to .env.local or switch BACKEND_PROVIDER=mock.`);
  }
  return value;
}

/** Per-request client that reads/writes the Supabase auth cookies. */
export async function createServerSupabase(): Promise<ServerSupabase> {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", env.supabase.url);
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", env.supabase.anonKey);
  const jar = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return jar.getAll().map(({ name, value }) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            jar.set(name, value, options);
          }
        } catch {
          // Called from a Server Component: cookies are read-only here. The
          // proxy refreshes sessions, so this is safe to ignore.
        }
      },
    },
  });
}

declare global {
  var __cycSupabaseAdmin: SupabaseClient | undefined;
}

/** Service-role client (bypasses RLS). Cached per process. */
export function createAdminSupabase(): AdminSupabase {
  if (!globalThis.__cycSupabaseAdmin) {
    const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", env.supabase.url);
    const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY", env.supabase.serviceRoleKey);
    globalThis.__cycSupabaseAdmin = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { "X-Client-Info": "cyc-academy-server" } },
    });
  }
  return globalThis.__cycSupabaseAdmin;
}

/** True when the env has everything the Supabase adapters need. */
export function supabaseConfigured(): boolean {
  return Boolean(env.supabase.url && env.supabase.anonKey && env.supabase.serviceRoleKey);
}
