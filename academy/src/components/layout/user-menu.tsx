"use client";

import * as React from "react";
import Link from "next/link";
import { Award, BookOpen, LogOut, Shield, UserRound } from "lucide-react";
import { initials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SIGN_OUT_ACTION, isStaff, type HeaderUser } from "./nav-config";

/** Avatar button → account dropdown. `compact` hides the learner links (admin top bar). */
function UserMenu({ user, compact = false }: { user: HeaderUser; compact?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`Account menu for ${user.name}`}
      >
        <Avatar className="size-9 border border-border">
          {user.avatar_url ? <AvatarImage src={user.avatar_url} alt="" /> : null}
          <AvatarFallback>{initials(user.name) || "?"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="normal-case tracking-normal">
          <span className="block truncate text-sm font-semibold text-foreground">{user.name}</span>
          <span className="block text-xs font-normal text-muted-foreground capitalize">{user.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!compact ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/learn">
                <BookOpen /> My Learning
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/certificates">
                <Award /> Certificates
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserRound /> Account
          </Link>
        </DropdownMenuItem>
        {isStaff(user.role) && !compact ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield /> Admin
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <form action={SIGN_OUT_ACTION} method="post">
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOut /> Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserMenu };
