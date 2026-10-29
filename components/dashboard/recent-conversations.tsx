"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChannelIcon } from "@/components/shared/brand-icons";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { CONVERSATION_STATUS } from "@/components/shared/status-maps";
import { useAppStore } from "@/lib/store/app-store";
import { useContactMap } from "@/lib/store/hooks";
import { formatMessageStamp } from "@/lib/format";
import type { ChannelFilter } from "@/lib/analytics";

export function RecentConversations({ channel }: { channel: ChannelFilter }) {
  const conversations = useAppStore((s) => s.conversations);
  const contacts = useContactMap();
  const recent = useMemo(
    () =>
      [...conversations]
        .filter((c) => channel === "all" || c.channel === channel)
        .sort((a, b) => Date.parse(b.lastMessageAt) - Date.parse(a.lastMessageAt))
        .slice(0, 5),
    [conversations, channel],
  );

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Recent conversations</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/inbox">
              Open inbox <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2">
        {recent.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">No conversations on this channel yet.</p>
        ) : (
          <ul>
            {recent.map((conversation) => {
              const contact = contacts.get(conversation.contactId);
              const last = [...conversation.messages].reverse().find((m) => m.authorType !== "system");
              const status = CONVERSATION_STATUS[conversation.status];
              if (!contact) return null;
              return (
                <li key={conversation.id}>
                  <Link
                    href="/inbox"
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
                  >
                    <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-medium">{contact.name}</span>
                        <ChannelIcon channel={conversation.channel} className="size-3.5" />
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">{last?.body}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[11px] text-muted-foreground">{formatMessageStamp(conversation.lastMessageAt)}</span>
                      <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
