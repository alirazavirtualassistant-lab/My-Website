"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  /** Match only the exact path (default: the path or any child). */
  exact?: boolean;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function isActivePath(pathname: string | null, href: string, exact = false): boolean {
  if (!pathname) return false;
  if (exact || href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** <Link> that knows when it is current (aria-current="page" + data-active). */
function NavLink({ href, exact, className, activeClassName, inactiveClassName, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href, exact);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-active={active || undefined}
      className={cn(className, active ? activeClassName : inactiveClassName)}
      {...props}
    />
  );
}

export { NavLink };
