/**
 * presentAuthor is pure: it decides what name/avatar/badges a viewer sees for
 * a post or reply author. Anonymous posts hide the member from everyone
 * except themselves and moderators; deleted members always read "Deleted member".
 */
import { describe, expect, it } from "vitest";
import type { Profile } from "@/lib/types";
import { presentAuthor } from "@/lib/usecases/community";

function profile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "user-1",
    email: "ada@example.com",
    name: "Ada Lovelace",
    avatar_url: "https://example.com/ada.png",
    role: "learner",
    email_preferences: { progress_nudges: true, drip_unlocks: true, newsletter: false, community: true },
    disclaimer_accepted_at: null,
    stripe_customer_id: null,
    timezone: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    deleted_at: null,
    ...overrides,
  };
}

describe("presentAuthor", () => {
  it("shows the real name and avatar for a public post", () => {
    const out = presentAuthor(profile(), false, "viewer-2", false);
    expect(out).toEqual({ id: "user-1", name: "Ada Lovelace", avatar_url: "https://example.com/ada.png", is_instructor: false, is_me: false });
  });

  it("hides an anonymous author from other members", () => {
    const out = presentAuthor(profile(), true, "viewer-2", false);
    expect(out).toEqual({ id: null, name: "Anonymous member", avatar_url: null, is_instructor: false, is_me: false });
  });

  it("lets the author see their own anonymous post, labelled as such, without an avatar", () => {
    const out = presentAuthor(profile(), true, "user-1", false);
    expect(out.id).toBe("user-1");
    expect(out.name).toBe("Ada Lovelace (posted anonymously)");
    expect(out.avatar_url).toBeNull();
    expect(out.is_me).toBe(true);
  });

  it("lets an admin viewer see who posted anonymously", () => {
    const out = presentAuthor(profile(), true, "admin-9", true);
    expect(out.id).toBe("user-1");
    expect(out.name).toBe("Ada Lovelace (posted anonymously)");
    expect(out.is_me).toBe(false);
  });

  it("marks the admin (course owner) as the instructor, but not assistants", () => {
    expect(presentAuthor(profile({ role: "admin", name: "Cynthia" }), false, "viewer-2", false).is_instructor).toBe(true);
    expect(presentAuthor(profile({ role: "assistant" }), false, "viewer-2", false).is_instructor).toBe(false);
    expect(presentAuthor(profile({ role: "learner" }), false, "viewer-2", false).is_instructor).toBe(false);
  });

  it("renders deleted or missing members as 'Deleted member' for everyone, even admins", () => {
    const deleted = presentAuthor(profile({ deleted_at: "2026-02-01T00:00:00.000Z", name: "Deleted member" }), false, "admin-9", true);
    expect(deleted).toEqual({ id: null, name: "Deleted member", avatar_url: null, is_instructor: false, is_me: false });
    expect(presentAuthor(null, false, "user-1", false).name).toBe("Deleted member");
    expect(presentAuthor(undefined, true, "user-1", true).name).toBe("Deleted member");
  });

  it("never marks a deleted member as 'me', even for the matching id", () => {
    const out = presentAuthor(profile({ deleted_at: "2026-02-01T00:00:00.000Z" }), false, "user-1", false);
    expect(out.is_me).toBe(false);
    expect(out.id).toBeNull();
  });
});
