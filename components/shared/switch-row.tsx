"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SwitchRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function SwitchRow({ label, description, checked, onCheckedChange, disabled, className }: SwitchRowProps) {
  const id = useId();
  return (
    <div className={cn("flex items-start justify-between gap-4 py-3", className)}>
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-[13px] font-medium">
          {label}
        </Label>
        {description && (
          <p id={`${id}-desc`} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-describedby={description ? `${id}-desc` : undefined}
        className="mt-0.5"
      />
    </div>
  );
}
