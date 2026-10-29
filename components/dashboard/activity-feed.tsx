import { ArrowRightLeft, CheckCircle2, Plug, ShoppingBag, UserPlus, Workflow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activityFeed } from "@/lib/mock-data/analytics";
import { formatRelative } from "@/lib/format";
import type { ActivityEvent } from "@/lib/types";

const ICONS: Record<ActivityEvent["kind"], typeof Plug> = {
  order: ShoppingBag,
  resolved: CheckCircle2,
  assigned: UserPlus,
  automation: Workflow,
  integration: Plug,
  handoff: ArrowRightLeft,
};

export function ActivityFeed() {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[13px] before:w-px before:bg-border">
          {activityFeed.map((event) => {
            const Icon = ICONS[event.kind];
            return (
              <li key={event.id} className="relative flex gap-3">
                <span className="z-10 grid size-7 shrink-0 place-items-center rounded-full border bg-card text-muted-foreground">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[13px] leading-snug">{event.text}</p>
                  <p className="text-[11px] text-muted-foreground">{formatRelative(event.createdAt)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
