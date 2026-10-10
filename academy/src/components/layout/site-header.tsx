import * as React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NavLink } from "./nav-link";
import { UserMenu } from "./user-menu";
import { SiteHeaderMobile } from "./site-header-mobile";
import { primaryNav, visibleFor, type HeaderUser } from "./nav-config";

export interface SiteHeaderProps {
  user: HeaderUser | null;
  cartCount: number;
  /** Where "Start your Baby Steps" goes (default /courses). */
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
}

/**
 * Sticky public header: logo, primary nav, theme toggle, cart, sign-in / CTA or
 * the user menu. Server Component; the interactive bits are small client islands.
 */
function SiteHeader({ user, cartCount, ctaHref = "/courses", ctaLabel = "Start your Baby Steps", className }: SiteHeaderProps) {
  const items = visibleFor(primaryNav, user?.role);
  return (
    <header
      data-slot="site-header"
      className={cn(
        "sticky top-0 z-40 w-full border-b border-gold/50 bg-cream/85 backdrop-blur supports-[backdrop-filter]:bg-cream/75 print:static",
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex shrink-0 items-center rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-cream focus-visible:outline-none" aria-label="Cradle Your Cravings Academy home">
          <Logo height={32} academy={false} className="sm:hidden" />
          <Logo height={40} className="hidden sm:inline-flex" />
        </Link>

        <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              exact={item.exact}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground/85 transition-colors hover:bg-rose-soft/50 hover:text-rose-strong"
              activeClassName="text-rose-strong underline decoration-gold decoration-2 underline-offset-8"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/cart" aria-label={cartCount > 0 ? `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}` : "Cart, empty"}>
              <ShoppingBag className="size-5" aria-hidden="true" />
              {cartCount > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground ring-2 ring-cream"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>
          </Button>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          )}

          <SiteHeaderMobile user={user} cartCount={cartCount} items={items} ctaHref={ctaHref} ctaLabel={ctaLabel} />
        </div>
      </div>
    </header>
  );
}

export { SiteHeader };
