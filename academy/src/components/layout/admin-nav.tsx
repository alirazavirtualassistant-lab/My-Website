"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { isActivePath } from "./nav-link";
import type { Role } from "@/lib/types";
import { adminNav, visibleFor } from "./nav-config";

/**
 * Client-side nav. It takes the role (serializable) and resolves the nav items
 * itself, because icon components cannot cross the server → client boundary.
 */
function AdminNavList({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = visibleFor(adminNav, role);
  return (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {items.map(({ label, href, icon: Icon, exact }) => {
        const active = isActivePath(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
              active ? "bg-rose-soft/70 text-rose-strong" : "text-foreground/80 hover:bg-rose-soft/40 hover:text-rose-strong",
            )}
          >
            {Icon ? <Icon className="size-4.5 shrink-0" aria-hidden="true" /> : null}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile drawer for the admin sidebar. */
function AdminMobileNav({ role }: { role: Role }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open admin menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[82vw] max-w-xs">
        <SheetHeader className="border-b border-border">
          <SheetTitle asChild>
            <Link href="/admin" onClick={() => setOpen(false)} className="inline-flex items-center gap-2">
              <Logo variant="mark" height={28} />
              <span className="font-serif text-lg font-medium">Admin</span>
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">Admin navigation</SheetDescription>
        </SheetHeader>
        <div className="px-3">
          <AdminNavList role={role} onNavigate={() => setOpen(false)} />
        </div>
        <div className="mt-auto border-t border-border p-4">
          <SheetClose asChild>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-strong">
              <ExternalLink className="size-4" aria-hidden="true" /> View site
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { AdminNavList, AdminMobileNav };
