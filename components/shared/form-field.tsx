import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  description?: string;
  className?: string;
  optional?: boolean;
  children: React.ReactNode;
}

/** Label + control + description/error, wired for screen readers via ids. */
export function FormField({ label, htmlFor, error, description, className, optional, children }: FormFieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-[13px]">
        {label}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {description && !error && (
        <p id={`${htmlFor}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props to attach to the control rendered inside a FormField. */
export function fieldAria(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
