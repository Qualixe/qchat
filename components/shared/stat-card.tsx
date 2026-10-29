import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Relative change vs. previous period, e.g. 0.12 for +12%. */
  change?: number | null;
  /** Set when a decrease is the good outcome (e.g. response time). */
  invert?: boolean;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, change, invert = false, hint = "vs previous period" }: StatCardProps) {
  const hasChange = typeof change === "number" && Number.isFinite(change);
  const positive = hasChange && change >= 0;
  const good = hasChange && (invert ? !positive : positive);
  return (
    <Card className="min-w-0 gap-2 px-3.5 py-3.5 sm:gap-3 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-medium text-muted-foreground sm:text-[13px]">{label}</p>
        <span className="hidden size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground sm:grid">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
      </div>
      <p className="text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{value}</p>
      {hasChange && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              good ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {positive ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
            {Math.abs(change * 100).toFixed(1)}%
          </span>
          <span className="hidden truncate sm:inline">{hint}</span>
        </p>
      )}
    </Card>
  );
}
