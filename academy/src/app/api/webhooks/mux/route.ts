import { NextResponse, type NextRequest } from "next/server";
import { getServices } from "@/services";
import { nowIso } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Mux webhook: marks lessons ready when their asset finishes processing. */
export async function POST(req: NextRequest) {
  const { video, db } = await getServices();
  if (video.kind !== "mux") return NextResponse.json({ error: "Mux is not enabled" }, { status: 400 });
  const rawBody = await req.text();
  const signature = req.headers.get("mux-signature");
  let event;
  try {
    event = await video.parseWebhook({ rawBody, signature });
  } catch (err) {
    console.warn("[mux webhook] bad signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (event.type === "ignored") return NextResponse.json({ received: true });
  const lessons = db.from("lessons");
  // Lessons store the upload id in video_asset_id until the asset is ready.
  const byUpload = event.upload_id ? await lessons.findOne({ video_asset_id: event.upload_id }) : null;
  const byAsset = byUpload ?? (await lessons.findOne({ video_asset_id: event.asset_id }));
  if (!byAsset) return NextResponse.json({ received: true, matched: false });
  if (event.type === "asset.ready") {
    await lessons.update(byAsset.id, {
      video_provider: "mux",
      video_asset_id: event.asset_id,
      video_playback_id: event.playback_id,
      duration_sec: event.duration_sec ? Math.round(event.duration_sec) : byAsset.duration_sec,
      updated_at: nowIso(),
    });
  } else {
    await lessons.update(byAsset.id, { video_provider: "none", video_asset_id: null, video_playback_id: null, updated_at: nowIso() });
  }
  return NextResponse.json({ received: true, matched: true });
}
