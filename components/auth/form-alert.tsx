import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  error: { icon: CircleAlert, className: "border-destructive/30 bg-destructive/5 text-destructive" },
  success: { icon: CircleCheck, className: "border-emerald-600/25 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300" },
  info: { icon: Info, className: "bg-muted/50 text-muted-foreground" },
} as const;

export function FormAlert({ tone, children }: { tone: keyof typeof TONES; children: React.ReactNode }) {
  const { icon: Icon, className } = TONES[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex gap-2 rounded-lg border p-3 text-sm", className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
