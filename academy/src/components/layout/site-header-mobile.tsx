"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag } from "lucide-react";
import { initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { isActivePath } from "./nav-link";
import { SignOutButton } from "./sign-out-button";
import { isStaff, type HeaderUser, type NavItem } from "./nav-config";

interface Props {
  user: HeaderUser | null;
  cartCount: number;
  items: NavItem[];
  ctaHref: string;
  ctaLabel: string;
}

/** Hamburger → right-side Sheet with the same links as the desktop header. Closes on navigation. */
function SiteHeaderMobile({ user, cartCount, items, ctaHref, ctaLabel }: Props) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const linkClass =
    "flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-semibold text-foreground hover:bg-rose-soft/50 hover:text-rose-strong data-[active]:bg-rose-soft/70 data-[active]:text-rose-strong";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[86vw] max-w-xs">
        <SheetHeader className="border-b border-border">
          <SheetTitle asChild>
            <Link href="/" onClick={() => setOpen(false)} className="inline-flex">
              <Logo height={28} academy={false} />
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-3">
          {items.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                data-active={isActivePath(pathname, item.href, item.exact) || undefined}
                aria-current={isActivePath(pathname, item.href, item.exact) ? "page" : undefined}
                className={linkClass}
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link href="/cart" className={linkClass} data-active={isActivePath(pathname, "/cart") || undefined}>
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="size-4" aria-hidden="true" /> Cart
              </span>
              {cartCount > 0 ? (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">{cartCount}</span>
              ) : null}
            </Link>
          </SheetClose>
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-border p-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-border">
                  {user.avatar_url ? <AvatarImage src={user.avatar_url} alt="" /> : null}
                  <AvatarFallback>{initials(user.name) || "?"}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
              <div className="grid gap-1 text-sm">
                <SheetClose asChild>
                  <Link href="/certificates" className="rounded-md px-2.5 py-2 hover:bg-rose-soft/50">
                    Certificates
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/account" className="rounded-md px-2.5 py-2 hover:bg-rose-soft/50">
                    Account
                  </Link>
                </SheetClose>
                {isStaff(user.role) ? (
                  <SheetClose asChild>
                    <Link href="/admin" className="rounded-md px-2.5 py-2 hover:bg-rose-soft/50">
                      Admin
                    </Link>
                  </SheetClose>
                ) : null}
                <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button asChild size="lg" className="w-full">
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </SheetClose>
            </>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-muted-foreground">Appearance</span>
            <ThemeToggle showLabel />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { SiteHeaderMobile };
