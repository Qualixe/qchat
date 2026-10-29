"use client";

import { useState } from "react";
import { FlaskConical, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { IntegrationLogo } from "@/components/shared/brand-icons";
import { useAppStore } from "@/lib/store/app-store";
import { formatDate } from "@/lib/format";
import type { Integration, IntegrationId } from "@/lib/types";
import { IntegrationManageDialog } from "./integration-manage-dialog";
import { IntegrationSetupDialog } from "./integration-setup-dialog";

export function IntegrationsView() {
  const integrations = useAppStore((s) => s.integrations);
  const [setupId, setSetupId] = useState<IntegrationId | null>(null);
  const [manageId, setManageId] = useState<IntegrationId | null>(null);

  const setup = integrations.find((i) => i.id === setupId) ?? null;
  const manage = integrations.find((i) => i.id === manageId && i.status === "connected") ?? null;

  return (
    <PageContainer>
      <PageIntro description="Connect messaging channels and your online store. Every connection on this page is a frontend simulation." />

      <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
        <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-medium">Demo mode.</span> Connecting an integration here only updates the interface. No
          accounts are linked, and no access tokens or passwords are requested or stored.
        </p>
      </div>

      {(["messaging", "commerce"] as const).map((category) => (
        <section key={category} className="space-y-3">
          <h2 className="text-sm font-semibold">{category === "messaging" ? "Messaging channels" : "E-commerce platforms"}</h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {integrations
              .filter((i) => i.category === category)
              .map((integration) => (
                <li key={integration.id}>
                  <IntegrationCard
                    integration={integration}
                    onConnect={() => setSetupId(integration.id)}
                    onManage={() => setManageId(integration.id)}
                  />
                </li>
              ))}
          </ul>
        </section>
      ))}

      <IntegrationSetupDialog integration={setup} onOpenChange={(open) => !open && setSetupId(null)} />
      <IntegrationManageDialog integration={manage} onOpenChange={(open) => !open && setManageId(null)} />
    </PageContainer>
  );
}

function IntegrationCard({
  integration,
  onConnect,
  onManage,
}: {
  integration: Integration;
  onConnect: () => void;
  onManage: () => void;
}) {
  const connected = integration.status === "connected";
  return (
    <Card className="h-full gap-0 pb-0">
      <CardContent className="flex flex-1 flex-col gap-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <IntegrationLogo id={integration.id} />
          <StatusBadge tone={connected ? "success" : "neutral"} dot>
            {connected ? "Connected" : "Not connected"}
          </StatusBadge>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{integration.name}</h3>
          <p className="text-[13px] text-muted-foreground">{integration.description}</p>
        </div>
        {connected && (
          <p className="mt-auto truncate text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{integration.accountLabel}</span>
            {integration.connectedAt && ` · since ${formatDate(integration.connectedAt)}`}
          </p>
        )}
      </CardContent>
      <CardFooter className="justify-end bg-muted/30 py-3">
        {connected ? (
          <Button variant="outline" size="sm" onClick={onManage}>
            <Settings2 /> Manage
          </Button>
        ) : (
          <Button size="sm" onClick={onConnect}>
            Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
