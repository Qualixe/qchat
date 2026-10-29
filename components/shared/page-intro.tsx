import { cn } from "@/lib/utils";

interface PageIntroProps {
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Description + primary actions row at the top of a page. The page title
 * itself lives in the app header (as the page's h1).
 */
export function PageIntro({ description, actions, className }: PageIntroProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
      {actions && <div className="flex flex-wrap items-center gap-2 sm:ml-auto">{actions}</div>}
    </div>
  );
}

export function PageContainer({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}
