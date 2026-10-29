"use client";

import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Monitor, Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SwitchRow } from "@/components/shared/switch-row";
import { updateSettings } from "@/lib/store/app-store";
import { useMounted } from "@/lib/use-mounted";
import type { WorkspaceSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SettingsSection } from "./settings-section";

function saved() {
  toast.success("Preference saved");
}

export function NotificationSettings({ settings }: { settings: WorkspaceSettings["notifications"] }) {
  function set(patch: Partial<WorkspaceSettings["notifications"]>) {
    updateSettings("notifications", { ...settings, ...patch });
    saved();
  }

  async function toggleDesktop(enabled: boolean) {
    if (enabled && typeof Notification !== "undefined" && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        // Some browsers don't support the promise form; the preference is still saved.
      }
    }
    set({ desktop: enabled });
  }

  return (
    <SettingsSection title="Notifications" description="Changes save automatically to this browser.">
      <div className="divide-y">
        <SwitchRow
          label="Desktop notifications"
          description="Show a browser notification for new customer messages."
          checked={settings.desktop}
          onCheckedChange={toggleDesktop}
        />
        <SwitchRow
          label="Email notifications"
          description="Email me about assigned conversations. (No emails are sent in this demo.)"
          checked={settings.email}
          onCheckedChange={(email) => set({ email })}
        />
        <div className="flex items-center justify-between gap-4 py-3">
          <div>
            <Label htmlFor="digest" className="text-[13px]">Email digest</Label>
            <p className="text-xs text-muted-foreground">A summary of conversations and AI performance.</p>
          </div>
          <Select
            value={settings.emailDigest}
            onValueChange={(v) => set({ emailDigest: v as WorkspaceSettings["notifications"]["emailDigest"] })}
            disabled={!settings.email}
          >
            <SelectTrigger id="digest" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SwitchRow
          label="Unanswered conversation alerts"
          description="Alert the team when a customer is waiting too long."
          checked={settings.unansweredAlerts}
          onCheckedChange={(unansweredAlerts) => set({ unansweredAlerts })}
        />
        {settings.unansweredAlerts && (
          <div className="flex items-center justify-between gap-4 py-3">
            <Label htmlFor="alert-after" className="text-[13px]">Alert after</Label>
            <Select value={String(settings.unansweredAfterMinutes)} onValueChange={(v) => set({ unansweredAfterMinutes: Number(v) })}>
              <SelectTrigger id="alert-after" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 30, 60].map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </SettingsSection>
  );
}

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function AppearanceSettings({ settings }: { settings: WorkspaceSettings["appearance"] }) {
  const { theme: storedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const theme = mounted ? (storedTheme ?? "light") : "light";
  return (
    <div className="space-y-4">
      <SettingsSection title="Theme" description="Choose how QChat looks on this device.">
        <RadioGroup value={theme} onValueChange={setTheme} className="grid max-w-lg grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <Label
              key={value}
              htmlFor={`theme-${value}`}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 hover:bg-muted/50",
                theme === value && "border-primary/40 bg-accent/60",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span className="text-[13px]">{label}</span>
              <RadioGroupItem id={`theme-${value}`} value={value} className="sr-only" />
            </Label>
          ))}
        </RadioGroup>
      </SettingsSection>
      <SettingsSection title="Layout">
        <div className="divide-y">
          <SwitchRow
            label="Collapse sidebar"
            description="Show only icons in the main navigation on desktop."
            checked={settings.sidebarCollapsed}
            onCheckedChange={(sidebarCollapsed) => {
              updateSettings("appearance", { ...settings, sidebarCollapsed });
              saved();
            }}
          />
        </div>
      </SettingsSection>
    </div>
  );
}
