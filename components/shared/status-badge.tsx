import { cn } from "@/lib/utils";

export type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground ring-border",
  primary: "bg-accent text-accent-foreground ring-primary/15",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  warning: "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
  danger: "bg-red-50 text-red-700 ring-red-600/15 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20",
  info: "bg-sky-50 text-sky-700 ring-sky-600/15 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
};

const DOT_CLASS: Record<Tone, string> = {
  neutral: "bg-muted-foreground/60",
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-sky-500",
};

interface StatusBadgeProps {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

/** Status pill — always pairs color with a text label so state is never color-only. */
export function StatusBadge({ tone = "neutral", dot = false, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full px-2 text-[11px] font-medium whitespace-nowrap ring-1 ring-inset",
        TONE_CLASS[tone],
        className,
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", DOT_CLASS[tone])} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function TagBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-md border bg-background px-1.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
