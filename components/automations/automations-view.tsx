"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, MoreHorizontal, Pause, Pencil, Play, Plus, Trash2, Workflow, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ACTION_LABELS, TRIGGER_LABELS } from "@/lib/mock-data/automations";
import { deleteAutomation, duplicateAutomation, toggleAutomation, useAppStore } from "@/lib/store/app-store";
import { useTeamMap } from "@/lib/store/hooks";
import { formatNumber, formatRelative } from "@/lib/format";
import type { Automation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AutomationBuilderDialog } from "./automation-builder-dialog";

type StatusFilter = "all" | "active" | "inactive";

export function AutomationsView() {
  const automations = useAppStore((s) => s.automations);
  const teamMap = useTeamMap();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editing, setEditing] = useState<Automation | null>(null);
  const [deleting, setDeleting] = useState<Automation | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return automations.filter(
      (a) =>
        (status === "all" || (status === "active") === a.active) &&
        (!q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)),
    );
  }, [automations, search, status]);

  const activeCount = automations.filter((a) => a.active).length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0);

  function describeAction(a: Automation) {
    const base = ACTION_LABELS[a.action];
    if (a.action === "assign_teammate" || a.action === "notify_teammate") {
      return `${base}: ${teamMap.get(a.actionTarget ?? "")?.name ?? "—"}`;
    }
    if (a.action === "add_tag") return `${base}: ${a.actionTarget}`;
    return base;
  }

  function openCreate() {
    setEditing(null);
    setBuilderOpen(true);
  }

  return (
    <PageContainer>
      <PageIntro
        description="Rules that run automatically on incoming conversations. All automations are simulated in this demo."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Create automation
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryTile label="Active automations" value={`${activeCount} of ${automations.length}`} />
        <SummaryTile label="Total runs (all time)" value={formatNumber(totalRuns)} />
        <SummaryTile label="Estimated time saved" value={`${Math.round((totalRuns * 1.5) / 60)} hours`} hint="at ~1.5 min per run" />
      </div>

      <Card className="gap-0 py-0">
        <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={setSearch} label="Search automations" className="sm:w-72" />
          <div className="flex gap-1" role="group" aria-label="Filter by status">
            {(["all", "active", "inactive"] as const).map((s) => (
              <Button
                key={s}
                variant={status === s ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={Workflow}
            title={automations.length ? "No automations match your filters" : "No automations yet"}
            description={automations.length ? "Try a different search or status." : "Create your first automation to save time on repetitive replies."}
            action={
              !automations.length ? (
                <Button size="sm" onClick={openCreate}>
                  <Plus /> Create automation
                </Button>
              ) : undefined
            }
          />
        ) : (
          <ul className="divide-y">
            {visible.map((automation) => (
              <li key={automation.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-lg border",
                      automation.active ? "border-primary/20 bg-accent text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Zap className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{automation.name}</p>
                      <StatusBadge tone={automation.active ? "success" : "neutral"} dot>
                        {automation.active ? "Active" : "Inactive"}
                      </StatusBadge>
                    </div>
                    {automation.description && <p className="text-xs text-muted-foreground">{automation.description}</p>}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-xs">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">When: {TRIGGER_LABELS[automation.trigger]}</span>
                      <span className="text-muted-foreground" aria-hidden="true">→</span>
                      <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">{describeAction(automation)}</span>
                      {automation.conditions.length > 0 && (
                        <span className="text-muted-foreground">
                          +{automation.conditions.length} condition{automation.conditions.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-12 sm:pl-0">
                  <div className="text-xs text-muted-foreground sm:text-right">
                    <p className="font-medium text-foreground tabular-nums">{formatNumber(automation.runs)} runs</p>
                    <p>Updated {formatRelative(automation.updatedAt)}</p>
                  </div>
                  <Switch
                    checked={automation.active}
                    onCheckedChange={(active) => {
                      toggleAutomation(automation.id, active);
                      toast.success(`${automation.name} ${active ? "enabled" : "disabled"}`);
                    }}
                    aria-label={`${automation.active ? "Disable" : "Enable"} ${automation.name}`}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${automation.name}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => {
                          setEditing(automation);
                          setBuilderOpen(true);
                        }}
                      >
                        <Pencil /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          duplicateAutomation(automation.id);
                          toast.success("Automation duplicated", { description: "The copy starts inactive." });
                        }}
                      >
                        <Copy /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          toggleAutomation(automation.id, !automation.active);
                          toast.success(`${automation.name} ${automation.active ? "disabled" : "enabled"}`);
                        }}
                      >
                        {automation.active ? <Pause /> : <Play />} {automation.active ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(automation)}>
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AutomationBuilderDialog open={builderOpen} onOpenChange={setBuilderOpen} automation={editing} />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete automation?"
        description={
          <>
            <strong>{deleting?.name}</strong> will stop running and be permanently removed. This can&apos;t be undone.
          </>
        }
        onConfirm={() => {
          if (!deleting) return;
          deleteAutomation(deleting.id);
          toast.success("Automation deleted");
          setDeleting(null);
        }}
      />
    </PageContainer>
  );
}

function SummaryTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="gap-1 px-4 py-4">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
