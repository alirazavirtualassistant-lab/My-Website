import * as React from "react";
import { Flame } from "lucide-react";
import { initials, cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { PersonProgressView } from "./types";

function PersonCard({ person, tone }: { person: PersonProgressView; tone: "rose" | "sage" }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-5 text-center", person.isMe && "border-rose/40")}>
      <Avatar className="size-14">
        {person.avatarUrl ? <AvatarImage src={person.avatarUrl} alt="" /> : null}
        <AvatarFallback className="text-base">{initials(person.name) || "?"}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-serif text-xl leading-tight">
          {person.name}
          {person.isMe ? <span className="sr-only"> (you)</span> : null}
        </p>
        <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
          <Badge variant={person.roleLabel === "Course owner" ? "rose" : "success"}>{person.roleLabel}</Badge>
          {person.isMe ? <Badge variant="outline">You</Badge> : null}
        </div>
      </div>
      <ProgressRing value={person.percent} size="lg" tone={tone} label={`${person.name}: ${person.percent}% of lessons complete`} />
      <dl className="grid w-full gap-1 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Lessons</dt>
          <dd className="tabular-nums">
            {person.completedLessons} / {person.totalLessons}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">XP</dt>
          <dd className="tabular-nums">
            {person.xp.toLocaleString("en-US")} · {person.levelLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Streak</dt>
          <dd className="inline-flex items-center gap-1 tabular-nums">
            <Flame className="size-3.5 text-warning" aria-hidden="true" />
            {person.streak} {person.streak === 1 ? "day" : "days"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/** Both partners side by side (stacked on small screens). */
function CoupleProgress({ people }: { people: PersonProgressView[] }) {
  return (
    <div className={cn("grid gap-4", people.length > 1 && "sm:grid-cols-2")}>
      {people.map((p, i) => (
        <PersonCard key={p.id} person={p} tone={i === 0 ? "rose" : "sage"} />
      ))}
    </div>
  );
}

export { CoupleProgress };
