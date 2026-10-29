import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

export interface BarListItem {
  key: string;
  label: string;
  value: number;
  icon?: React.ReactNode;
  /** CSS color for the bar; defaults to the primary series slot. */
  color?: string;
}

/**
 * Labeled horizontal bars — values and labels are always printed, so the
 * bar color is a secondary cue rather than the only carrier of meaning.
 */
export function BarList({ items, className, valueFormatter = formatNumber }: {
  items: BarListItem[];
  className?: string;
  valueFormatter?: (value: number) => string;
}) {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => {
        const share = total ? item.value / total : 0;
        return (
          <li key={item.key} className="space-y-1.5">
            <div className="flex items-center gap-2 text-[13px]">
              {item.icon}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <span className="font-medium tabular-nums">{valueFormatter(item.value)}</span>
              <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{Math.round(share * 100)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${(item.value / max) * 100}%`, background: item.color ?? "var(--chart-1)" }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
