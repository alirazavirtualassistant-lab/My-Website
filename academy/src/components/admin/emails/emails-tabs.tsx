import Link from "next/link";
import { cn } from "@/lib/utils";

/** Log / Broadcasts switcher (server-safe links). */
function EmailsTabs({ active }: { active: "log" | "broadcasts" }) {
  const tabs = [
    { key: "log", label: "Log", href: "/admin/emails" },
    { key: "broadcasts", label: "Broadcasts", href: "/admin/emails/broadcasts" },
  ] as const;
  return (
    <nav aria-label="Email sections" className="inline-flex h-11 w-fit items-center gap-1 rounded-lg bg-muted-bg p-1">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={cn(
            "inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            active === t.key ? "bg-card text-rose-strong shadow-soft" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export { EmailsTabs };
