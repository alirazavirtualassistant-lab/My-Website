/**
 * POST /api/auth/sign-out — clears the session and redirects home (303).
 * Works as a plain <form method="post" action="/api/auth/sign-out"> target,
 * so sign-out needs no JavaScript.
 */
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { SESSION_COOKIE_NAME, clearedSessionCookieOptions } from "@/lib/auth/cookies";
import { getServices } from "@/services";

export async function POST() {
  const { auth } = await getServices();
  try {
    await auth.signOut();
  } catch (err) {
    console.warn(`[sign-out] ${(err as Error).message}`);
  }
  const res = NextResponse.redirect(new URL("/", env.siteUrl), 303);
  if (auth.kind === "mock") {
    // Belt and braces: also clear on the response we return.
    res.cookies.set(SESSION_COOKIE_NAME, "", clearedSessionCookieOptions(env.isProduction));
  }
  return res;
}
