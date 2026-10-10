import type { Role } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  FolderInput,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  Quote,
  Settings,
  Shield,
  Ticket,
  UserRound,
  Users,
 Receipt } from "lucide-react";

export interface HeaderUser {
  name: string;
  avatar_url: string | null;
  role: Role;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  exact?: boolean;
  /** Only shown to these roles (default: everyone who sees the nav). */
  roles?: Role[];
}

export const isStaff = (role: Role | null | undefined) => role === "admin" || role === "assistant";

/** Public primary navigation; items with `roles` need a signed-in user. */
export const primaryNav: NavItem[] = [
  { label: "Courses", href: "/courses" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Community", href: "/community", roles: ["learner", "admin", "assistant"] },
  { label: "My Learning", href: "/learn", roles: ["learner", "admin", "assistant"] },
];

export const learnerNav: NavItem[] = [
  { label: "My Learning", href: "/learn", icon: BookOpen },
  { label: "Community", href: "/community", icon: Users },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "Account", href: "/account", icon: UserRound },
];

/** Assistant = admin minus billing/settings/team. */
export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Importer", href: "/admin/importer", icon: FolderInput },
  { label: "Products", href: "/admin/products", icon: Package, roles: ["admin"] },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket, roles: ["admin"] },
  { label: "Orders", href: "/admin/orders", icon: Receipt },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Community", href: "/admin/community", icon: MessageSquare },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["admin"] },
  { label: "Team", href: "/admin/team", icon: Shield, roles: ["admin"] },
];

export const SIGN_OUT_ACTION = "/api/auth/sign-out";

export function visibleFor(items: NavItem[], role: Role | null | undefined): NavItem[] {
  return items.filter((item) => !item.roles || (role ? item.roles.includes(role) : false));
}
