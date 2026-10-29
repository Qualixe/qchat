"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Laptop, ShieldAlert, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SwitchRow } from "@/components/shared/switch-row";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { updateSettings } from "@/lib/store/app-store";
import type { WorkspaceSettings } from "@/lib/types";
import { SettingsSection } from "./settings-section";

interface MockSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
  mobile?: boolean;
}

const INITIAL_SESSIONS: MockSession[] = [
  { id: "s1", device: "Chrome on Windows", location: "Dhaka, BD", lastActive: "Active now", current: true },
  { id: "s2", device: "Safari on iPhone", location: "Dhaka, BD", lastActive: "2 hours ago", mobile: true },
  { id: "s3", device: "Firefox on macOS", location: "Chattogram, BD", lastActive: "3 days ago" },
];

export function SecuritySettings({ settings }: { settings: WorkspaceSettings["security"] }) {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [revoking, setRevoking] = useState<MockSession | "all" | null>(null);
  const others = sessions.filter((s) => !s.current);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-medium">Interface preview only.</span> This prototype has no real authentication. The settings
          and sessions below are simulated and do not protect any account.
        </p>
      </div>

      <SettingsSection title="Sign-in security (preview)">
        <div className="divide-y">
          <SwitchRow
            label="Two-factor authentication"
            description="Preview of the 2FA toggle. Turning it on does not enable real 2FA."
            checked={settings.twoFactorPreview}
            onCheckedChange={(twoFactorPreview) => {
              updateSettings("security", { ...settings, twoFactorPreview });
              toast.success(`2FA preview ${twoFactorPreview ? "on" : "off"}`, { description: "Simulation only." });
            }}
          />
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <Label htmlFor="timeout" className="text-[13px]">Idle session timeout</Label>
              <p className="text-xs text-muted-foreground">Preference only — not enforced in this demo.</p>
            </div>
            <Select
              value={String(settings.sessionTimeoutMinutes)}
              onValueChange={(v) => {
                updateSettings("security", { ...settings, sessionTimeoutMinutes: Number(v) });
                toast.success("Preference saved");
              }}
            >
              <SelectTrigger id="timeout" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
                <SelectItem value="1440">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Active sessions (simulated)"
        footer={
          <Button variant="outline" disabled={others.length === 0} onClick={() => setRevoking("all")}>
            Sign out other sessions
          </Button>
        }
      >
        <ul className="divide-y">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center gap-3 py-3">
              <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                {session.mobile ? <Smartphone className="size-4" aria-hidden="true" /> : <Laptop className="size-4" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[13px] font-medium">
                  {session.device}
                  {session.current && <StatusBadge tone="success">This device</StatusBadge>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.location} · {session.lastActive}
                </p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" onClick={() => setRevoking(session)}>
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SettingsSection>

      <ConfirmDialog
        open={revoking !== null}
        onOpenChange={(open) => !open && setRevoking(null)}
        title={revoking === "all" ? "Sign out all other sessions?" : "Sign out this session?"}
        description="This is a simulation — the session is removed from the list only."
        confirmLabel="Sign out"
        onConfirm={() => {
          setSessions((list) => (revoking === "all" ? list.filter((s) => s.current) : list.filter((s) => s !== revoking)));
          toast.success("Session signed out (simulated)");
          setRevoking(null);
        }}
      />
    </div>
  );
}
