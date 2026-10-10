/**
 * Stripe catalogue setup (test mode or live, depending on the key).
 *
 *   npx tsx scripts/stripe-setup.ts [--out stripe-ids.json] [--dry-run]
 *
 * Creates (idempotently, by `metadata.cyc_key`) the products and prices from
 * src/lib/config/site.ts:
 *
 *   baby-steps          one-time  $197      (+ sale price when pricing.babySteps.saleCents is set)
 *   baby-steps-plan     monthly   3 × $69   recurring price, metadata installments=3
 *   all-access-monthly  monthly   $29
 *   all-access-annual   yearly    $249
 *
 * It prints the ids and a JSON block keyed by product slug. This script never
 * writes to the database: paste the ids into Admin → Products, or run
 * `npx tsx scripts/seed.ts --stripe-ids stripe-ids.json` (seed.ts owner: see
 * the report) to mirror them into the products table.
 *
 * Env (from .env.local / .env or the shell): STRIPE_SECRET_KEY.
 */
import fs from "node:fs";
import path from "node:path";
import Stripe from "stripe";
import { pricing, site } from "../src/lib/config/site";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface Args {
  out: string | null;
  dryRun: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { out: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out") {
      const v = argv[++i];
      if (!v) throw new Error("--out needs a file path");
      args.out = v;
    } else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log("Usage: tsx scripts/stripe-setup.ts [--out stripe-ids.json] [--dry-run]");
      process.exit(0);
    } else throw new Error(`Unknown argument ${a}`);
  }
  return args;
}

function loadEnvFiles(): void {
  for (const name of [".env.local", ".env"]) {
    const file = path.resolve(process.cwd(), name);
    if (!fs.existsSync(file)) continue;
    try {
      process.loadEnvFile(file);
    } catch {
      // Older Node without loadEnvFile: rely on the shell environment.
    }
  }
}

// ---------------------------------------------------------------------------
// Catalogue (keep slugs in sync with scripts/seed.ts and src/lib/usecases/demo.ts)
// ---------------------------------------------------------------------------

export interface CatalogueEntry {
  /** Product slug in the products table; also `metadata.cyc_key` in Stripe. */
  slug: string;
  name: string;
  description: string;
  list_cents: number;
  sale_cents: number | null;
  interval: "month" | "year" | null;
  installments: number | null;
}

export const CATALOGUE: CatalogueEntry[] = [
  {
    slug: "baby-steps",
    name: "Baby Steps: Your Health Journey Toward Conception",
    description: "Lifetime access to the full Baby Steps course, workbooks and replays.",
    list_cents: pricing.babySteps.oneTimeCents,
    sale_cents: pricing.babySteps.saleCents,
    interval: null,
    installments: null,
  },
  {
    slug: "baby-steps-plan",
    name: `Baby Steps · ${pricing.babySteps.paymentPlan.installments} monthly payments`,
    description: `Same lifetime access, paid in ${pricing.babySteps.paymentPlan.installments} monthly instalments.`,
    list_cents: pricing.babySteps.paymentPlan.amountCents,
    sale_cents: null,
    interval: "month",
    installments: pricing.babySteps.paymentPlan.installments,
  },
  {
    slug: "all-access-monthly",
    name: "All-Access · monthly",
    description: "Every current and future course, billed monthly. Cancel any time.",
    list_cents: pricing.allAccess.monthlyCents,
    sale_cents: null,
    interval: "month",
    installments: null,
  },
  {
    slug: "all-access-annual",
    name: "All-Access · annual",
    description: "Every current and future course, billed yearly.",
    list_cents: pricing.allAccess.annualCents,
    sale_cents: null,
    interval: "year",
    installments: null,
  },
];

const META_KEY = "cyc_key";
const META_KIND = "cyc_price_kind";
const currency = site.currency.toLowerCase();

export interface StripeIds {
  stripe_product_id: string;
  stripe_price_id: string;
  stripe_sale_price_id: string | null;
}

export type StripeIdsFile = {
  generated_at: string;
  mode: "test" | "live";
  products: Record<string, StripeIds>;
};

// ---------------------------------------------------------------------------
// Stripe helpers
// ---------------------------------------------------------------------------

async function findProduct(stripe: Stripe, key: string): Promise<Stripe.Product | null> {
  for await (const p of stripe.products.list({ limit: 100 })) if (p.metadata?.[META_KEY] === key) return p;
  return null;
}

async function listActivePrices(stripe: Stripe, productId: string): Promise<Stripe.Price[]> {
  const out: Stripe.Price[] = [];
  for await (const p of stripe.prices.list({ product: productId, active: true, limit: 100 })) out.push(p);
  return out;
}

function matches(price: Stripe.Price, want: { cents: number; interval: "month" | "year" | null }): boolean {
  return (
    price.currency === currency &&
    price.unit_amount === want.cents &&
    (price.recurring?.interval ?? null) === want.interval &&
    (price.recurring?.interval_count ?? 1) === 1
  );
}

async function ensurePrice(stripe: Stripe, product: Stripe.Product, entry: CatalogueEntry, kind: "list" | "sale", cents: number): Promise<{ id: string; created: boolean }> {
  const prices = await listActivePrices(stripe, product.id);
  const ofKind = prices.filter((p) => p.metadata?.[META_KIND] === kind);
  const found = ofKind.find((p) => matches(p, { cents, interval: entry.interval }));
  if (found) return { id: found.id, created: false };
  const created = await stripe.prices.create({
    product: product.id,
    currency,
    unit_amount: cents,
    nickname: `${entry.slug} ${kind}`,
    ...(entry.interval ? { recurring: { interval: entry.interval } } : {}),
    metadata: {
      [META_KEY]: entry.slug,
      [META_KIND]: kind,
      ...(entry.installments ? { installments: String(entry.installments) } : {}),
    },
  });
  for (const stale of ofKind) await stripe.prices.update(stale.id, { active: false });
  return { id: created.id, created: true };
}

async function ensureProduct(stripe: Stripe, entry: CatalogueEntry): Promise<{ product: Stripe.Product; created: boolean }> {
  const existing = await findProduct(stripe, entry.slug);
  if (existing) {
    if (existing.name !== entry.name || (existing.description ?? "") !== entry.description) {
      const updated = await stripe.products.update(existing.id, { name: entry.name, description: entry.description });
      return { product: updated, created: false };
    }
    return { product: existing, created: false };
  }
  const product = await stripe.products.create({
    name: entry.name,
    description: entry.description,
    metadata: { [META_KEY]: entry.slug, ...(entry.installments ? { installments: String(entry.installments) } : {}) },
  });
  return { product, created: true };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  loadEnvFiles();

  const key = process.env.STRIPE_SECRET_KEY ?? "";
  const mode: "test" | "live" = key.startsWith("sk_live_") || key.startsWith("rk_live_") ? "live" : "test";

  console.log(`Stripe setup for ${site.name} (${mode} mode${args.dryRun ? ", dry run" : ""})`);
  console.log("Catalogue (CONFIRM WITH CYNTHIA — edit src/lib/config/site.ts to change):");
  for (const e of CATALOGUE) {
    const price = `$${(e.list_cents / 100).toFixed(2)}${e.interval ? `/${e.interval}` : ""}${e.installments ? ` × ${e.installments}` : ""}`;
    const sale = e.sale_cents !== null ? ` (sale $${(e.sale_cents / 100).toFixed(2)})` : "";
    console.log(`  ${e.slug.padEnd(20)} ${price}${sale}`);
  }

  if (args.dryRun) {
    console.log("\nDry run: nothing was sent to Stripe.");
    printHints();
    return;
  }
  if (!key) {
    console.error("\nSTRIPE_SECRET_KEY is not set. Add it to .env.local (use a test key, sk_test_…) and run again.");
    process.exit(1);
  }
  if (mode === "live") console.warn("\nWARNING: this is a LIVE key. Products and prices will be created in your live Stripe account.");

  const stripe = new Stripe(key, { appInfo: { name: `${site.name} setup script` } });
  const result: StripeIdsFile = { generated_at: new Date().toISOString(), mode, products: {} };

  for (const entry of CATALOGUE) {
    const { product, created } = await ensureProduct(stripe, entry);
    const list = await ensurePrice(stripe, product, entry, "list", entry.list_cents);
    let sale: { id: string; created: boolean } | null = null;
    if (entry.sale_cents !== null) sale = await ensurePrice(stripe, product, entry, "sale", entry.sale_cents);
    else {
      for (const p of await listActivePrices(stripe, product.id)) {
        if (p.metadata?.[META_KIND] === "sale") await stripe.prices.update(p.id, { active: false });
      }
    }
    if (product.default_price !== list.id) await stripe.products.update(product.id, { default_price: list.id });
    result.products[entry.slug] = { stripe_product_id: product.id, stripe_price_id: list.id, stripe_sale_price_id: sale?.id ?? null };
    console.log(
      `\n${entry.slug}\n  product ${product.id} ${created ? "(created)" : "(existing)"}\n  price   ${list.id} ${list.created ? "(created)" : "(existing)"}` +
        (sale ? `\n  sale    ${sale.id} ${sale.created ? "(created)" : "(existing)"}` : ""),
    );
  }

  const json = JSON.stringify(result, null, 2);
  console.log("\nStripe ids (paste into Admin → Products, or save with --out and feed to scripts/seed.ts --stripe-ids):\n");
  console.log(json);
  if (args.out) {
    fs.writeFileSync(path.resolve(process.cwd(), args.out), json + "\n");
    console.log(`\nWrote ${args.out}`);
  }
  printHints();
}

function printHints(): void {
  console.log("\nNext steps:");
  console.log("  1. Set PAYMENTS_PROVIDER=stripe, STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local");
  console.log("  2. Local webhooks:   stripe listen --forward-to localhost:3000/api/webhooks/stripe");
  console.log("     then copy the printed whsec_… into STRIPE_WEBHOOK_SECRET");
  console.log("  3. Production: add an endpoint for https://<your-domain>/api/webhooks/stripe with events");
  console.log("     checkout.session.completed, invoice.paid, invoice.payment_failed,");
  console.log("     customer.subscription.updated, customer.subscription.deleted, charge.refunded");
  console.log("  4. Enable the Customer Portal (Settings → Billing → Customer portal) so /account/billing can open it");
  console.log(`  5. Optional: STRIPE_TAX_ENABLED=true once Stripe Tax is configured (${site.currency} prices).`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
