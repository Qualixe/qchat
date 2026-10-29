"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { AVAILABILITY, ROLE_LABELS } from "@/components/shared/status-maps";
import { removeMember, updateMemberRole, useAppStore } from "@/lib/store/app-store";
import { formatDate } from "@/lib/format";
import type { TeamMember, TeamRole } from "@/lib/types";
import { InviteMemberDialog } from "./invite-member-dialog";

const EDITABLE_ROLES: TeamRole[] = ["admin", "agent", "viewer"];

export function TeamView() {
  const team = useAppStore((s) => s.team);
  const conversations = useAppStore((s) => s.conversations);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removing, setRemoving] = useState<TeamMember | null>(null);

  // Live count of open/pending conversations assigned to each teammate.
  const assigned = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of conversations) {
      if (c.assigneeId && c.status !== "resolved") counts.set(c.assigneeId, (counts.get(c.assigneeId) ?? 0) + 1);
    }
    return counts;
  }, [conversations]);

  const online = team.filter((m) => m.availability === "online" && !m.invited).length;

  return (
    <PageContainer>
      <PageIntro
        description={`${team.length} members · ${online} online now`}
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus /> Invite member
          </Button>
        }
      />

      <Card className="gap-0 py-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-4">Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Assigned conversations</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10 pr-4">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => {
                const isOwner = member.role === "owner";
                const isSelf = member.id === currentUserId;
                return (
                  <TableRow key={member.id}>
                    <TableCell className="pl-4">
                      <span className="flex items-center gap-3">
                        <UserAvatar
                          initials={member.initials}
                          colorClassName={member.avatarColor}
                          presence={member.invited ? undefined : member.availability}
                        />
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 font-medium">
                            {member.name}
                            {isSelf && <span className="text-xs font-normal text-muted-foreground">(you)</span>}
                          </span>
                          <span className="block text-xs text-muted-foreground">{member.email}</span>
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      {isOwner ? (
                        <StatusBadge tone="primary">Owner</StatusBadge>
                      ) : (
                        <Select
                          value={member.role}
                          onValueChange={(role) => {
                            updateMemberRole(member.id, role as TeamRole);
                            toast.success(`${member.name} is now ${ROLE_LABELS[role as TeamRole].label.toLowerCase()}`);
                          }}
                        >
                          <SelectTrigger size="sm" className="w-28" aria-label={`Role for ${member.name}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EDITABLE_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {ROLE_LABELS[role].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{assigned.get(member.id) ?? 0}</TableCell>
                    <TableCell>
                      {member.invited ? (
                        <StatusBadge tone="info">Invitation pending</StatusBadge>
                      ) : (
                        <StatusBadge tone={AVAILABILITY[member.availability].tone} dot>
                          {AVAILABILITY[member.availability].label}
                        </StatusBadge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(member.joinedAt)}</TableCell>
                    <TableCell className="pr-4">
                      {!isOwner && !isSelf && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem variant="destructive" onSelect={() => setRemoving(member)}>
                              <Trash2 /> {member.invited ? "Revoke invitation" : "Remove from team"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Role permissions">
        {(Object.keys(ROLE_LABELS) as TeamRole[]).map((role) => (
          <Card key={role} className="gap-1 px-4 py-3">
            <p className="text-[13px] font-medium">{ROLE_LABELS[role].label}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[role].description}</p>
          </Card>
        ))}
      </section>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={removing?.invited ? "Revoke invitation?" : "Remove teammate?"}
        description={
          <>
            <strong>{removing?.name}</strong> will lose access to this workspace. Their assigned conversations become unassigned.
          </>
        }
        confirmLabel={removing?.invited ? "Revoke" : "Remove"}
        onConfirm={() => {
          if (!removing) return;
          removeMember(removing.id);
          toast.success(`${removing.name} removed`);
          setRemoving(null);
        }}
      />
    </PageContainer>
  );
}
