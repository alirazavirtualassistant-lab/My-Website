import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser, signInUrl, type CurrentUser } from "@/lib/auth/session";

/** Session + live profile, or a redirect to sign-in with the right `next`. */
export async function requireProfile(path: string): Promise<CurrentUser> {
  const me = await getCurrentUser();
  if (!me) redirect(signInUrl(path));
  return me;
}
