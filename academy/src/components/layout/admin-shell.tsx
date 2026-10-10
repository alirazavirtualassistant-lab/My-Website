import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { AdminNavList, AdminMobileNav } from "./admin-nav";
import { UserMenu } from "./user-menu";
import { adminNav, visibleFor, type HeaderUser } from "./nav-config";

export interface AdminShellProps {
  user: HeaderUser;
  children: React.ReactNode;
  className?: string;
}

/**
 * Admin panel chrome: fixed sidebar (lg+), top bar with "View site" + user
 * menu, and a mobile drawer. The role gate itself lives in the admin layout.
 */
function AdminShell({ user, children, className }: AdminShellProps) {
  const items = visibleFor(adminNav, user.role);
  return (
    <div data-slot="admin-shell" className={cn("flex min-h-screen w-full bg-cream", className)}>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            <Logo variant="mark" height={30} />
            <span className="font-serif text-lg font-medium">Admin</span>
          </Link>
          {user.role === "assistant" ? (
            <Badge variant="muted" className="ml-auto">
              Assistant
            </Badge>
          ) : null}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <AdminNavList items={items} />
        </div>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          <p className="truncate font-semibold text-foreground">{user.name}</p>
          <p className="capitalize">{user.role}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-gold/50 bg-cream/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-cream/75 sm:px-6">
          <AdminMobileNav items={items} />
          <Link href="/admin" className="inline-flex items-center gap-2 lg:hidden">
            <Logo variant="mark" height={28} />
            <span className="font-serif text-lg font-medium">Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-foreground/85 hover:bg-rose-soft/50 hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:inline-flex"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              View site
            </Link>
            <ThemeToggle />
            <UserMenu user={user} compact />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export { AdminShell };
