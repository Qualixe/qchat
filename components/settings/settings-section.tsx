import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, description, footer, className, children }: SettingsSectionProps) {
  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="justify-end gap-2 py-3">{footer}</CardFooter>}
    </Card>
  );
}
