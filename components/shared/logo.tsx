import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-[60%]" fill="none">
        <path
          d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.2 3.4c-.5.4-1.3 0-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-7Z"
          fill="currentColor"
          opacity=".95"
        />
        <path d="m12.6 6.8-.9 2.4-2.4.9 2.4.9.9 2.4.9-2.4 2.4-.9-2.4-.9-.9-2.4Z" fill="var(--primary)" />
      </svg>
    </span>
  );
}

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {showText && <span className="text-[15px] font-semibold tracking-tight">QChat</span>}
    </span>
  );
}
