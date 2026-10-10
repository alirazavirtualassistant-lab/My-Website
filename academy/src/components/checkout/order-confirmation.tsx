"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, RefreshCw, MailQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderStatusResponse } from "./types";

export interface OrderConfirmationProps {
  orderId: string;
  status: "pending" | "paid";
  finalize: (input: { orderId: string }) => Promise<{ ok: boolean }>;
  supportEmail: string;
  /** Poll interval / attempts (defaults: every 2s, 10 attempts = 20s). */
  intervalMs?: number;
  maxAttempts?: number;
}

/**
 * Handles the two things the confirmation page cannot do during render:
 *   - pending: poll /api/orders/[id]/status until the webhook lands, then refresh
 *   - paid: run `finalize` once (clears the cart cookie, fixes the guest name)
 */
function OrderConfirmation({ orderId, status, finalize, supportEmail, intervalMs = 2000, maxAttempts = 10 }: OrderConfirmationProps) {
  const router = useRouter();
  const finalized = React.useRef(false);
  const [round, setRound] = React.useState(0);
  const [timedOut, setTimedOut] = React.useState(false);

  React.useEffect(() => {
    if (status !== "paid" || finalized.current) return;
    finalized.current = true;
    finalize({ orderId })
      .then((r) => {
        if (r.ok) router.refresh();
      })
      .catch(() => {});
  }, [status, orderId, finalize, router]);

  React.useEffect(() => {
    if (status !== "pending") return;
    let attempts = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      if (cancelled) return;
      attempts += 1;
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, { cache: "no-store" });
        if (res.ok) {
          const body = (await res.json()) as OrderStatusResponse;
          if (body.status !== "pending") {
            router.refresh();
            return;
          }
        }
      } catch {
        /* keep polling */
      }
      if (attempts >= maxAttempts) {
        setTimedOut(true);
        return;
      }
      timer = setTimeout(tick, intervalMs);
    };
    timer = setTimeout(tick, intervalMs);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [status, orderId, router, intervalMs, maxAttempts, round]);

  if (status === "paid") return null;

  return (
    <div role="status" aria-live="polite" className="card-soft flex flex-col items-center gap-4 p-6 text-center sm:p-8">
      {timedOut ? (
        <>
          <div aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-gold-soft text-warning">
            <MailQuestion className="size-6" />
          </div>
          <div>
            <p className="font-serif text-2xl">Still confirming your payment</p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Payment confirmations occasionally take a minute to arrive. Your receipt email is the sure sign it went through; your course will appear in My Learning the moment it does.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => {
                setTimedOut(false);
                setRound((r) => r + 1);
                router.refresh();
              }}
            >
              <RefreshCw aria-hidden="true" />
              Check again
            </Button>
            <Button asChild variant="outline">
              <a href={`mailto:${supportEmail}?subject=${encodeURIComponent(`Order ${orderId.slice(0, 8).toUpperCase()}`)}`}>Email support</a>
            </Button>
          </div>
        </>
      ) : (
        <>
          <LoaderCircle className="size-8 animate-spin text-rose-strong motion-reduce:animate-none" aria-hidden="true" />
          <div>
            <p className="font-serif text-2xl">Confirming your payment…</p>
            <p className="mt-2 text-sm text-muted-foreground">This usually takes a few seconds. You can keep this page open.</p>
          </div>
        </>
      )}
    </div>
  );
}

export { OrderConfirmation };
