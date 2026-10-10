import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { runDailyJobs } from "@/lib/usecases/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily background jobs (Vercel Cron or any scheduler):
 * - drip-unlock emails for modules that opened in the last 24h
 * - weekly nudge for learners inactive for 7 days (opt-out respected)
 * - abandoned-cart reminders 24h after an open checkout
 * - expire enrollments past expires_at
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!env.cronSecret || token !== env.cronSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const summary = await runDailyJobs(new Date());
  return NextResponse.json(summary);
}

export const POST = GET;
