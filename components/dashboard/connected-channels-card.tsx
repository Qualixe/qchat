"use client";

import Link from "next/link";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IntegrationLogo } from "@/components/shared/brand-icons";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAppStore } from "@/lib/store/app-store";

export function ConnectedChannelsCard() {
  const integrations = useAppStore((s) => s.integrations);
  const connected = integrations.filter((i) => i.status === "connected").length;
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Connected channels</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/integrations">Manage</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {connected} of {integrations.length} integrations connected (simulated)
        </p>
        <ul className="space-y-2.5">
          {integrations.map((integration) => (
            <li key={integration.id} className="flex items-center gap-3">
              <IntegrationLogo id={integration.id} className="size-7 rounded-md [&_svg]:size-4" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{integration.name}</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {integration.accountLabel ?? "Not connected"}
                </span>
              </span>
              <StatusBadge tone={integration.status === "connected" ? "success" : "neutral"} dot>
                {integration.status === "connected" ? "Connected" : "Off"}
              </StatusBadge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
