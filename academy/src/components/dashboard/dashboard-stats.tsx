import * as React from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import type { LevelProgress } from "@/lib/domain/xp";
import { pluralize } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { LevelBadge } from "./level-badge";
import { StreakFlame } from "./streak-flame";
import type { StreakView } from "./types";

export interface DashboardStatsProps {
  level: LevelProgress;
  streak: StreakView;
  certificateCount: number;
  badgeCount: number;
}

/** Level + XP, streak and certificates in one responsive row. */
function DashboardStats({ level, streak, certificateCount, badgeCount }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3" aria-label="Your progress at a glance">
      <LevelBadge level={level} className="md:col-span-1" />
      <StreakFlame streak={streak} />
      <StatCard
        label="Certificates"
        value={certificateCount}
        tone="rose"
        icon={<Award />}
        hint={
          <>
            {pluralize(badgeCount, "badge")} earned ·{" "}
            <Link href="/certificates" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
              View certificates
            </Link>
          </>
        }
      />
    </div>
  );
}

export { DashboardStats };
