import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Point the store at a scratch directory before the adapter is imported.
const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-store-"));
process.env.DEMO_DATA_DIR = ROOT;

const { createMockDbInstance, resetMockDbCache } = await import("@/services/mock/db");
const { forgetMockStore, resolveStorePath } = await import("@/services/mock/store");
type Profile = import("@/lib/types").Profile;

let dir = "";
let counter = 0;

function profile(over: Partial<Profile> & { name: string }): Profile {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    email: `${over.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    avatar_url: null,
    role: "learner",
    email_preferences: { progress_nudges: true, drip_unlocks: true, newsletter: true, community: true },
    disclaimer_accepted_at: null,
    stripe_customer_id: null,
    timezone: null,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    ...over,
  };
}

beforeEach(() => {
  dir = path.join(ROOT, `case-${++counter}`);
});

afterEach(() => {
  forgetMockStore(resolveStorePath(dir));
  resetMockDbCache();
});

describe("mock store: Repo contract", () => {
  it("lists with where / IN / search / orderBy / limit / offset", async () => {
    const db = await createMockDbInstance(dir);
    const repo = db.from("profiles");
    await repo.insertMany([
      profile({ name: "Ada Lovelace", role: "admin", created_at: "2024-01-03T00:00:00.000Z" }),
      profile({ name: "Grace Hopper", role: "learner", created_at: "2024-01-01T00:00:00.000Z" }),
      profile({ name: "Mary Jackson", role: "assistant", created_at: "2024-01-02T00:00:00.000Z" }),
      profile({ name: "Katherine Johnson", role: "learner", created_at: "2024-01-04T00:00:00.000Z" }),
    ]);

    expect(await repo.count()).toBe(4);
    expect(await repo.count({ role: "learner" })).toBe(2);

    const admins = await repo.list({ where: { role: ["admin", "assistant"] } });
    expect(admins.map((p) => p.name).sort()).toEqual(["Ada Lovelace", "Mary Jackson"]);

    const searched = await repo.list({ search: { columns: ["name", "email"], query: "JOHN" } });
    expect(searched.map((p) => p.name)).toEqual(["Katherine Johnson"]);

    const ordered = await repo.list({ orderBy: ["created_at", "asc"] });
    expect(ordered.map((p) => p.name)).toEqual(["Grace Hopper", "Mary Jackson", "Ada Lovelace", "Katherine Johnson"]);

    const page = await repo.list({ orderBy: ["created_at", "desc"], limit: 2, offset: 1 });
    expect(page.map((p) => p.name)).toEqual(["Ada Lovelace", "Mary Jackson"]);

    const none = await repo.list({ where: { role: [] } });
    expect(none).toEqual([]);

    const nullMatch = await repo.list({ where: { timezone: null } });
    expect(nullMatch).toHaveLength(4);
  });

  it("get / findOne / update / updateWhere / delete / deleteWhere / upsert", async () => {
    const db = await createMockDbInstance(dir);
    const repo = db.from("profiles");
    const a = await repo.insert(profile({ name: "Ada Lovelace" }));
    const b = await repo.insert(profile({ name: "Grace Hopper" }));

    expect((await repo.get(a.id))?.name).toBe("Ada Lovelace");
    expect(await repo.get("missing")).toBeNull();
    expect((await repo.findOne({ email: b.email }))?.id).toBe(b.id);

    const updated = await repo.update(a.id, { name: "Ada King", id: "ignored" as string });
    expect(updated.id).toBe(a.id);
    expect(updated.name).toBe("Ada King");
    await expect(repo.update("missing", { name: "x" })).rejects.toThrow(/not found/);

    expect(await repo.updateWhere({ role: "learner" }, { role: "assistant" })).toBe(2);
    expect(await repo.count({ role: "assistant" })).toBe(2);

    await repo.delete(a.id);
    expect(await repo.get(a.id)).toBeNull();
    await expect(repo.delete(a.id)).resolves.toBeUndefined();

    const c = profile({ name: "Mary Jackson" });
    await repo.upsert(c);
    await repo.upsert({ ...c, name: "Mary W. Jackson" });
    expect((await repo.get(c.id))?.name).toBe("Mary W. Jackson");
    expect(await repo.count()).toBe(2);

    expect(await repo.deleteWhere({ role: "assistant" })).toBe(1);
    expect(await repo.count()).toBe(1);
  });

  it("rejects duplicate ids on insert and insertMany", async () => {
    const db = await createMockDbInstance(dir);
    const repo = db.from("profiles");
    const a = await repo.insert(profile({ name: "Ada Lovelace" }));
    await expect(repo.insert(a)).rejects.toThrow(/duplicate/);
    const dup = profile({ name: "Dup" });
    await expect(repo.insertMany([dup, { ...dup }])).rejects.toThrow(/duplicate/);
    // Failed batch inserts nothing.
    expect(await repo.count()).toBe(1);
  });

  it("returns deep copies so callers cannot mutate store state", async () => {
    const db = await createMockDbInstance(dir);
    const repo = db.from("profiles");
    const input = profile({ name: "Ada Lovelace" });
    const inserted = await repo.insert(input);
    inserted.email_preferences.newsletter = false;
    input.name = "mutated";
    const fresh = await repo.get(input.id);
    expect(fresh?.name).toBe("Ada Lovelace");
    expect(fresh?.email_preferences.newsletter).toBe(true);
    const listed = await repo.list();
    listed[0].name = "mutated again";
    expect((await repo.get(input.id))?.name).toBe("Ada Lovelace");
  });

  it("persists to <dataDir>/store.json and a fresh instance reads it back", async () => {
    const db = await createMockDbInstance(dir);
    const row = profile({ name: "Ada Lovelace" });
    await db.from("profiles").insert(row);
    await db.from("newsletter_signups").insert({ id: crypto.randomUUID(), email: "x@example.com", source: "test", created_at: new Date().toISOString() });
    await db.flush();

    const file = path.join(dir, "store.json");
    expect(fs.existsSync(file)).toBe(true);
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    expect(parsed.version).toBe(1);
    expect(parsed.tables.profiles).toHaveLength(1);

    const again = await createMockDbInstance(dir, { fresh: true });
    expect((await again.from("profiles").get(row.id))?.name).toBe("Ada Lovelace");
    expect(await again.from("newsletter_signups").count()).toBe(1);
  });

  it("debounces writes and reset() clears memory and deletes the file", async () => {
    const db = await createMockDbInstance(dir);
    await db.from("profiles").insert(profile({ name: "Ada Lovelace" }));
    const file = path.join(dir, "store.json");
    await new Promise((r) => setTimeout(r, 450));
    expect(fs.existsSync(file)).toBe(true);
    await db.reset();
    expect(fs.existsSync(file)).toBe(false);
    expect(await db.from("profiles").count()).toBe(0);
  });

  it("serialises transactions and allows nested transactions", async () => {
    const db = await createMockDbInstance(dir);
    const order: string[] = [];
    const first = db.transaction(async (tx) => {
      order.push("a:start");
      await new Promise((r) => setTimeout(r, 30));
      await tx.from("profiles").insert(profile({ name: "First" }));
      // nested: must not deadlock
      await tx.transaction(async (inner) => {
        await inner.from("profiles").insert(profile({ name: "Nested" }));
      });
      order.push("a:end");
      return "a";
    });
    const second = db.transaction(async (tx) => {
      order.push("b:start");
      expect(await tx.from("profiles").count()).toBe(2);
      order.push("b:end");
      return "b";
    });
    expect(await Promise.all([first, second])).toEqual(["a", "b"]);
    expect(order).toEqual(["a:start", "a:end", "b:start", "b:end"]);
  });

  it("keeps the mutex alive after a failing transaction", async () => {
    const db = await createMockDbInstance(dir);
    await expect(db.transaction(async () => { throw new Error("boom"); })).rejects.toThrow("boom");
    expect(await db.transaction(async () => 42)).toBe(42);
  });

  it("shares one in-memory store per path unless fresh is requested", async () => {
    const a = await createMockDbInstance(dir);
    const b = await createMockDbInstance(dir);
    await a.from("profiles").insert(profile({ name: "Shared" }));
    expect(await b.from("profiles").count()).toBe(1);
  });
});
