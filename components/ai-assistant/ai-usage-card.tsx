import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { aiUsage } from "@/lib/mock-data/settings";
import { formatDate, formatNumber } from "@/lib/format";

export function AiUsageCard({ compact = false }: { compact?: boolean }) {
  const ratio = aiUsage.used / aiUsage.limit;
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="size-4 text-primary" aria-hidden="true" /> AI usage
        </CardTitle>
        <CardDescription className="text-xs">Resets {formatDate(aiUsage.resetsOn)}</CardDescription>
        {!compact && (
          <CardAction>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings?tab=subscription">Manage plan</Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-2xl font-semibold tabular-nums">
            {formatNumber(aiUsage.used)}
            <span className="text-sm font-normal text-muted-foreground"> / {formatNumber(aiUsage.limit)}</span>
          </p>
          <p className="text-xs text-muted-foreground">{Math.round(ratio * 100)}% used</p>
        </div>
        <Progress value={ratio * 100} className="h-2" aria-label="AI replies used this month" />
        <p className="text-xs text-muted-foreground">
          AI replies this billing cycle (sample data). You have {formatNumber(aiUsage.limit - aiUsage.used)} replies left on
          the Growth plan.
        </p>
      </CardContent>
    </Card>
  );
}
