"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SwitchRow } from "@/components/shared/switch-row";
import { IntegrationLogo } from "@/components/shared/brand-icons";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { disconnectIntegration, updateIntegrationSettings } from "@/lib/store/app-store";
import { formatDate } from "@/lib/format";
import type { Integration, IntegrationSettings } from "@/lib/types";

interface IntegrationManageDialogProps {
  integration: Integration | null;
  onOpenChange: (open: boolean) => void;
}

export function IntegrationManageDialog({ integration, onOpenChange }: IntegrationManageDialogProps) {
  if (!integration) return null;
  // Keyed so each opening starts from the integration's saved settings.
  return <ManageDialog key={integration.id} integration={integration} onOpenChange={onOpenChange} />;
}

function ManageDialog({ integration, onOpenChange }: { integration: Integration; onOpenChange: (open: boolean) => void }) {
  const [settings, setSettings] = useState<IntegrationSettings>(integration.settings);
  const [confirming, setConfirming] = useState(false);
  const isMessaging = integration.category === "messaging";
  const dirty = JSON.stringify(settings) !== JSON.stringify(integration.settings);

  return (
    <>
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <IntegrationLogo id={integration.id} />
              <div>
                <DialogTitle>{integration.name}</DialogTitle>
                <DialogDescription>
                  {integration.accountLabel}
                  {integration.connectedAt && ` · connected ${formatDate(integration.connectedAt)}`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="divide-y rounded-lg border px-3">
            <SwitchRow
              label={isMessaging ? "Sync conversations" : "Sync catalog & orders"}
              description="Simulated — sample data only"
              checked={settings.syncEnabled}
              onCheckedChange={(v) => setSettings({ ...settings, syncEnabled: v })}
            />
            {isMessaging && (
              <SwitchRow
                label="AI assistant replies on this channel"
                checked={settings.autoReply}
                onCheckedChange={(v) => setSettings({ ...settings, autoReply: v })}
              />
            )}
            <SwitchRow
              label="Notify team about new activity"
              checked={settings.notifyOnNew}
              onCheckedChange={(v) => setSettings({ ...settings, notifyOnNew: v })}
            />
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="destructive" onClick={() => setConfirming(true)}>
              <Unplug /> Disconnect
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                disabled={!dirty}
                onClick={() => {
                  updateIntegrationSettings(integration.id, settings);
                  toast.success(`${integration.name} settings saved`);
                  onOpenChange(false);
                }}
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Disconnect ${integration.name}?`}
        description={
          isMessaging
            ? "New messages from this channel will stop appearing in your inbox. Existing conversations are kept."
            : "Product and order sync will stop. Existing catalog data stays in QChat."
        }
        confirmLabel="Disconnect"
        onConfirm={() => {
          disconnectIntegration(integration.id);
          toast.success(`${integration.name} disconnected`);
          setConfirming(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
