"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { SwitchRow } from "@/components/shared/switch-row";
import { IntegrationLogo } from "@/components/shared/brand-icons";
import { connectIntegration } from "@/lib/store/app-store";
import type { Integration, IntegrationId, IntegrationSettings } from "@/lib/types";

const FIELD_CONFIG: Record<IntegrationId, { label: string; placeholder: string; pattern: RegExp; message: string; hint: string }> = {
  messenger: {
    label: "Facebook Page name",
    placeholder: "Nokshi Lifestyle",
    pattern: /^.{3,60}$/,
    message: "Enter your Page name (3–60 characters)",
    hint: "In production you'd sign in with Facebook and pick a Page.",
  },
  instagram: {
    label: "Instagram username",
    placeholder: "@nokshi.lifestyle",
    pattern: /^@?[a-z0-9._]{3,30}$/i,
    message: "Enter a valid Instagram username",
    hint: "In production you'd authorize a professional Instagram account.",
  },
  whatsapp: {
    label: "WhatsApp Business number",
    placeholder: "+880 1700-000000",
    pattern: /^\+?[0-9\s-]{8,20}$/,
    message: "Enter a valid phone number",
    hint: "In production you'd verify the number through Meta.",
  },
  shopify: {
    label: "Store domain",
    placeholder: "your-store.myshopify.com",
    pattern: /^[a-z0-9-]+\.myshopify\.com$/i,
    message: "Use the format your-store.myshopify.com",
    hint: "In production you'd install the QChat app from Shopify.",
  },
  woocommerce: {
    label: "Store URL",
    placeholder: "https://shop.example.com",
    pattern: /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i,
    message: "Enter a valid URL starting with https://",
    hint: "In production you'd approve access from your WordPress admin.",
  },
};

const STEPS = ["Validating details", "Simulating authorization", "Syncing sample data"];

interface IntegrationSetupDialogProps {
  integration: Integration | null;
  onOpenChange: (open: boolean) => void;
}

export function IntegrationSetupDialog({ integration, onOpenChange }: IntegrationSetupDialogProps) {
  if (!integration) return null;
  // Keyed so each opening starts with a fresh form.
  return <SetupDialog key={integration.id} integration={integration} onOpenChange={onOpenChange} />;
}

function SetupDialog({ integration, onOpenChange }: { integration: Integration; onOpenChange: (open: boolean) => void }) {
  const config = FIELD_CONFIG[integration.id];
  const schema = z.object({
    account: z.string().trim().regex(config.pattern, config.message),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ account: string }>({ resolver: zodResolver(schema), defaultValues: { account: "" } });
  const [settings, setSettings] = useState<IntegrationSettings>(integration.settings);
  const [step, setStep] = useState<number | null>(null);

  function onSubmit({ account }: { account: string }) {
    setStep(0);
    STEPS.forEach((_, i) => setTimeout(() => setStep(i + 1), 700 * (i + 1)));
    setTimeout(() => {
      connectIntegration(integration.id, account.trim(), settings);
      toast.success(`${integration.name} connected`, { description: "Simulated connection — no real account was linked." });
      onOpenChange(false);
    }, 700 * STEPS.length + 400);
  }

  const busy = step !== null;
  const isMessaging = integration.category === "messaging";

  return (
    <Dialog open onOpenChange={(next) => !busy && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <>
            <DialogHeader>
              <div className="mb-1 flex items-center gap-3">
                <IntegrationLogo id={integration.id} />
                <div>
                  <DialogTitle>Connect {integration.name}</DialogTitle>
                  <DialogDescription>{integration.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex gap-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
              <FlaskConical className="size-4 shrink-0" aria-hidden="true" />
              <p>
                This is a frontend simulation. No passwords or access tokens are requested or stored. {config.hint}
              </p>
            </div>

            {busy ? (
              <ol className="space-y-2.5 py-2" aria-live="polite">
                {STEPS.map((label, i) => {
                  const done = (step ?? 0) > i;
                  const active = step === i;
                  return (
                    <li key={label} className="flex items-center gap-2.5 text-sm">
                      <span className="grid size-5 place-items-center">
                        {done ? (
                          <Check className="size-4 text-emerald-600" aria-hidden="true" />
                        ) : active ? (
                          <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
                        ) : (
                          <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                        )}
                      </span>
                      <span className={done || active ? "" : "text-muted-foreground"}>{label}</span>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <form id="integration-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
                <FormField label={config.label} htmlFor="int-account" error={errors.account?.message}>
                  <Input {...fieldAria("int-account", errors.account?.message)} {...register("account")} placeholder={config.placeholder} autoComplete="off" />
                </FormField>
                <div className="divide-y rounded-lg border px-3">
                  <SwitchRow
                    label={isMessaging ? "Import recent conversations" : "Sync catalog & orders"}
                    checked={settings.syncEnabled}
                    onCheckedChange={(v) => setSettings((s) => ({ ...s, syncEnabled: v }))}
                  />
                  {isMessaging && (
                    <SwitchRow
                      label="Let AI assistant reply on this channel"
                      checked={settings.autoReply}
                      onCheckedChange={(v) => setSettings((s) => ({ ...s, autoReply: v }))}
                    />
                  )}
                  <SwitchRow
                    label="Notify team about new activity"
                    checked={settings.notifyOnNew}
                    onCheckedChange={(v) => setSettings((s) => ({ ...s, notifyOnNew: v }))}
                  />
                </div>
              </form>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Cancel
              </Button>
              <Button type="submit" form="integration-form" disabled={busy}>
                {busy ? "Connecting…" : "Connect (simulated)"}
              </Button>
            </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}
