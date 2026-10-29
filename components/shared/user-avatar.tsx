import { cn } from "@/lib/utils";
import type { Availability } from "@/lib/types";

const PRESENCE_CLASS: Record<Availability, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-400",
  offline: "bg-muted-foreground/40",
};

const SIZE_CLASS = {
  xs: "size-5 text-[9px]",
  sm: "size-7 text-[11px]",
  md: "size-9 text-xs",
  lg: "size-12 text-sm",
  xl: "size-16 text-lg",
} as const;

interface UserAvatarProps {
  initials: string;
  colorClassName: string;
  size?: keyof typeof SIZE_CLASS;
  presence?: Availability;
  className?: string;
  label?: string;
}

/** Initials avatar — keeps the app free of remote image dependencies. */
export function UserAvatar({ initials, colorClassName, size = "md", presence, className, label }: UserAvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-full font-semibold select-none",
        SIZE_CLASS[size],
        colorClassName,
        className,
      )}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {initials}
      {presence && (
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 rounded-full ring-2 ring-background",
            size === "xs" || size === "sm" ? "size-2" : "size-2.5",
            PRESENCE_CLASS[presence],
          )}
        />
      )}
    </span>
  );
}
