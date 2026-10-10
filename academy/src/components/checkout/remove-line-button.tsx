"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { removeFromCartAction } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";

function Inner({ title }: { title: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="ghost" size="sm" loading={pending} aria-label={`Remove ${title} from cart`} className="text-muted-foreground hover:text-danger">
      {pending ? null : <X aria-hidden="true" />}
      Remove
    </Button>
  );
}

/** "Remove" for one cart line; posts the shared removeFromCartAction. */
function RemoveLineButton({ productId, title }: { productId: string; title: string }) {
  return (
    <form action={removeFromCartAction}>
      <input type="hidden" name="product_id" value={productId} />
      <Inner title={title} />
    </form>
  );
}

export { RemoveLineButton };
