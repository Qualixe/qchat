"use client";

import { useMemo } from "react";
import type { Contact, TeamMember } from "@/lib/types";
import { organizations } from "@/lib/mock-data/organization";
import { useAppStore } from "./app-store";

export function useCurrentUser(): TeamMember {
  const team = useAppStore((s) => s.team);
  const currentUserId = useAppStore((s) => s.currentUserId);
  return useMemo(() => team.find((m) => m.id === currentUserId) ?? team[0], [team, currentUserId]);
}

export function useOrganization() {
  const organizationId = useAppStore((s) => s.organizationId);
  const workspaceName = useAppStore((s) => s.settings.general.workspaceName);
  return useMemo(() => {
    const org = organizations.find((o) => o.id === organizationId) ?? organizations[0];
    // The primary demo workspace's name is editable in Settings → General.
    return org.id === organizations[0].id ? { ...org, name: workspaceName || org.name } : org;
  }, [organizationId, workspaceName]);
}

export function useContactMap(): Map<string, Contact> {
  const contacts = useAppStore((s) => s.contacts);
  return useMemo(() => new Map(contacts.map((c) => [c.id, c])), [contacts]);
}

export function useTeamMap(): Map<string, TeamMember> {
  const team = useAppStore((s) => s.team);
  return useMemo(() => new Map(team.map((m) => [m.id, m])), [team]);
}

export function useUnreadCount(): number {
  const conversations = useAppStore((s) => s.conversations);
  return useMemo(
    () => conversations.reduce((sum, c) => sum + (c.status !== "resolved" && c.unreadCount > 0 ? 1 : 0), 0),
    [conversations],
  );
}
