"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { PLANS, aiUsage } from "@/lib/mock-data/settings";
import { useAppStore } from "@/lib/store/app-store";
import { useOrganization } from "@/lib/store/hooks";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SettingsSection } from "./settings-section";

type Plan = (typeof PLANS)[number];

export function SubscriptionSettings() {
  const org = useOrganization();
  const team = useAppStore((s) => s.team);
  const [upgrading, setUpgrading] = useState<Plan | null>(null);
  const current = PLANS.find((p) => p.id === org.plan) ?? PLANS[1];
  const seatsUsed = team.length;

  return (
    <div className="space-y-4">
      <SettingsSection title="Current plan" description="Billing is not active in this demo.">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="space-y-1 lg:w-64">
            <p className="flex items-center gap-2 text-lg font-semibold">
              {current.name} <StatusBadge tone="primary">Current</StatusBadge>
            </p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(current.price)} / month · renews {formatDate(aiUsage.resetsOn)}
            </p>
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <UsageMeter label="AI replies" used={aiUsage.used} limit={aiUsage.limit} />
            <UsageMeter label="Team seats" used={seatsUsed} limit={current.seats} />
          </div>
        </div>
      </SettingsSection>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === current.id;
          const isUpgrade = plan.price > current.price;
          return (
            <Card key={plan.id} className={cn("gap-4 px-5 py-5", isCurrent && "ring-2 ring-primary")}>
              <div>
                <p className="font-semibold">{plan.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
              </div>
              <p>
                <span className="text-2xl font-semibold tabular-nums">{formatCurrency(plan.price)}</span>
                <span className="text-sm text-muted-foreground"> / month</span>
              </p>
              <ul className="space-y-2 text-[13px]">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-auto"
                variant={isCurrent ? "outline" : isUpgrade ? "default" : "outline"}
                disabled={isCurrent}
                onClick={() => setUpgrading(plan)}
              >
                {isCurrent ? "Current plan" : isUpgrade ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`}
              </Button>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Prices are placeholders for this prototype and do not reflect real pricing.</p>

      <Dialog open={upgrading !== null} onOpenChange={(open) => !open && setUpgrading(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change to {upgrading?.name}?</DialogTitle>
            <DialogDescription>
              Billing isn&apos;t connected in this demo, so no payment is taken and your plan stays the same. This shows where a
              checkout step would appear.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgrading(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success(`Plan change to ${upgrading?.name} simulated`, { description: "No payment was processed." });
                setUpgrading(null);
              }}
            >
              Continue (demo)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const ratio = Math.min(1, used / limit);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {formatNumber(used)} / {formatNumber(limit)}
        </span>
      </div>
      <Progress value={ratio * 100} className="h-2" aria-label={`${label} used`} />
    </div>
  );
}
