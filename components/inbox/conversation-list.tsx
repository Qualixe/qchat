"use client";

import { Bot, Inbox, PenLine } from "lucide-react";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ChannelIcon } from "@/components/shared/brand-icons";
import { formatMessageStamp } from "@/lib/format";
import type { Contact, Conversation, TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";

export type InboxFilter = "all" | "unread" | "mine" | "resolved";

export const INBOX_FILTERS: { value: InboxFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "mine", label: "Assigned to me" },
  { value: "resolved", label: "Resolved" },
];

interface ConversationListProps {
  conversations: Conversation[];
  counts: Record<InboxFilter, number>;
  contacts: Map<string, Contact>;
  team: Map<string, TeamMember>;
  typing: string[];
  selectedId: string | null;
  filter: InboxFilter;
  onFilterChange: (filter: InboxFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
  className?: string;
}

export function ConversationList({
  conversations,
  counts,
  contacts,
  team,
  typing,
  selectedId,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  onSelect,
  className,
}: ConversationListProps) {
  return (
    <section aria-label="Conversations" className={cn("flex min-h-0 flex-col bg-background", className)}>
      <div className="space-y-3 border-b p-3">
        <SearchInput value={search} onChange={onSearchChange} label="Search conversations" placeholder="Search name or message…" />
        <div role="group" aria-label="Conversation filters" className="scrollbar-thin -mx-1 flex gap-0.5 overflow-x-auto px-1">
          {INBOX_FILTERS.map((f) => {
            const active = f.value === filter;
            return (
              <button
                key={f.value}
                type="button"

                aria-pressed={active}
                onClick={() => onFilterChange(f.value)}
                className={cn(
                  "flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium whitespace-nowrap transition-colors",
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded px-1 text-[10px] tabular-nums",
                    active ? "bg-background/20" : "bg-muted text-muted-foreground",
                  )}
                >
                  {counts[f.value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={search ? "No matching conversations" : "You're all caught up"}
            description={search ? "Try a different name or keyword." : "New conversations will appear here."}
          />
        ) : (
          <ul className="divide-y">
            {conversations.map((conversation) => {
              const contact = contacts.get(conversation.contactId);
              if (!contact) return null;
              return (
                <li key={conversation.id}>
                  <ConversationRow
                    conversation={conversation}
                    contact={contact}
                    assignee={conversation.assigneeId ? team.get(conversation.assigneeId) : undefined}
                    isTyping={typing.includes(conversation.id)}
                    selected={conversation.id === selectedId}
                    onSelect={() => onSelect(conversation.id)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function lastPreview(conversation: Conversation): { text: string; prefix?: string } {
  const visible = [...conversation.messages].reverse().find((m) => m.authorType !== "system");
  if (!visible) return { text: "No messages yet" };
  const body = visible.attachment && !visible.body ? `📎 ${visible.attachment.name}` : visible.body;
  if (visible.isInternalNote) return { text: body, prefix: "Note:" };
  if (visible.authorType === "ai") return { text: body, prefix: "AI:" };
  if (visible.authorType === "agent") return { text: body, prefix: "You:" };
  return { text: body };
}

function ConversationRow({
  conversation,
  contact,
  assignee,
  isTyping,
  selected,
  onSelect,
}: {
  conversation: Conversation;
  contact: Contact;
  assignee?: TeamMember;
  isTyping: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const unread = conversation.unreadCount > 0;
  const preview = lastPreview(conversation);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "relative flex w-full gap-3 px-3 py-3 text-left transition-colors focus-visible:z-10",
        selected ? "bg-accent/70" : "hover:bg-muted/60",
      )}
    >
      {selected && <span className="absolute inset-y-0 left-0 w-0.5 bg-primary" aria-hidden="true" />}
      <span className="relative">
        <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} />
        <span className="absolute -right-1 -bottom-1 grid size-[18px] place-items-center rounded-full bg-background ring-1 ring-border">
          <ChannelIcon channel={conversation.channel} className="size-3" />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn("truncate text-[13px]", unread ? "font-semibold" : "font-medium")}>{contact.name}</span>
          {conversation.priority === "high" && conversation.status !== "resolved" && (
            <span className="rounded bg-red-50 px-1 text-[10px] font-medium text-red-700 dark:bg-red-500/10 dark:text-red-300">
              Urgent
            </span>
          )}
          <span className={cn("ml-auto shrink-0 text-[11px] tabular-nums", unread ? "font-medium text-primary" : "text-muted-foreground")}>
            {formatMessageStamp(conversation.lastMessageAt)}
          </span>
        </span>
        <span className="mt-0.5 flex items-center gap-2">
          {isTyping ? (
            <span className="truncate text-xs font-medium text-primary">typing…</span>
          ) : (
            <span className={cn("truncate text-xs", unread ? "text-foreground" : "text-muted-foreground")}>
              {preview.prefix && <span className="text-muted-foreground">{preview.prefix} </span>}
              {preview.text}
            </span>
          )}
          {unread && (
            <span className="ml-auto grid min-w-[18px] shrink-0 place-items-center rounded-full bg-primary px-1 text-[10px] leading-[18px] font-semibold text-primary-foreground">
              {conversation.unreadCount}
              <span className="sr-only"> unread messages</span>
            </span>
          )}
        </span>
        <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <StatusDot status={conversation.status} />
          {conversation.aiHandled && (
            <span className="inline-flex items-center gap-0.5 text-primary">
              <Bot className="size-3" aria-hidden="true" /> AI
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 truncate">
            {assignee ? (
              <>
                <UserAvatar initials={assignee.initials} colorClassName={assignee.avatarColor} size="xs" />
                <span className="truncate">{assignee.name.split(" ")[0]}</span>
              </>
            ) : (
              <>
                <PenLine className="size-3" aria-hidden="true" /> Unassigned
              </>
            )}
          </span>
        </span>
      </span>
    </button>
  );
}

function StatusDot({ status }: { status: Conversation["status"] }) {
  const map = {
    open: { label: "Open", className: "bg-primary" },
    pending: { label: "Pending", className: "bg-amber-500" },
    resolved: { label: "Resolved", className: "bg-emerald-500" },
  } as const;
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("size-1.5 rounded-full", map[status].className)} aria-hidden="true" />
      {map[status].label}
    </span>
  );
}
