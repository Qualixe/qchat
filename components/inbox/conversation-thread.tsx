"use client";

import { Fragment, useEffect, useRef } from "react";
import { ArrowLeft, Check, CheckCircle2, PanelRightClose, PanelRightOpen, RotateCcw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { CHANNEL_META, ChannelIcon } from "@/components/shared/brand-icons";
import { CONVERSATION_STATUS } from "@/components/shared/status-maps";
import { TOPIC_LABELS } from "@/lib/mock-data/analytics";
import { REFERENCE_NOW } from "@/lib/mock-data/clock";
import { formatDayLabel, formatRelative, isSameDay } from "@/lib/format";
import type { Contact, Conversation, MessageAttachment, TeamMember } from "@/lib/types";
import { MessageBubble, TypingIndicator } from "./message-bubble";
import { MessageComposer, type ComposerMode } from "./message-composer";

interface ConversationThreadProps {
  conversation: Conversation;
  contact: Contact;
  team: TeamMember[];
  teamMap: Map<string, TeamMember>;
  isTyping: boolean;
  aiName: string;
  aiEnabled: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  mode: ComposerMode;
  onModeChange: (mode: ComposerMode) => void;
  onSend: (body: string, attachment?: MessageAttachment) => void;
  onSuggest: () => void;
  onAssign: (memberId: string | null) => void;
  onToggleStatus: () => void;
  onBack: () => void;
  detailsOpen: boolean;
  onToggleDetails: () => void;
}

function presenceOf(contact: Contact) {
  const minutes = (REFERENCE_NOW - Date.parse(contact.lastContactedAt)) / 60_000;
  if (minutes <= 15) return { label: "Active now", online: true };
  return { label: `Last active ${formatRelative(contact.lastContactedAt)}`, online: false };
}

export function ConversationThread(props: ConversationThreadProps) {
  const { conversation, contact, teamMap, isTyping, aiName } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageCount = conversation.messages.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [conversation.id, messageCount, isTyping]);

  const presence = presenceOf(contact);
  const status = CONVERSATION_STATUS[conversation.status];
  const assignee = conversation.assigneeId ? teamMap.get(conversation.assigneeId) : undefined;
  const resolved = conversation.status === "resolved";

  return (
    <section aria-label={`Conversation with ${contact.name}`} className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
      <header className="flex items-center gap-2 border-b px-3 py-2.5 sm:px-4">
        <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={props.onBack} aria-label="Back to conversations">
          <ArrowLeft />
        </Button>
        <UserAvatar
          initials={contact.initials}
          colorClassName={contact.avatarColor}
          presence={presence.online ? "online" : "offline"}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold">{contact.name}</h2>
            <StatusBadge tone={status.tone} dot className="hidden sm:inline-flex">
              {status.label}
            </StatusBadge>
          </div>
          <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <ChannelIcon channel={conversation.channel} className="size-3.5" />
            <span>{CHANNEL_META[conversation.channel].label}</span>
            <span aria-hidden="true">·</span>
            <span className={presence.online ? "text-emerald-600 dark:text-emerald-400" : undefined}>{presence.label}</span>
            <span aria-hidden="true" className="hidden lg:inline">·</span>
            <span className="hidden lg:inline">{TOPIC_LABELS[conversation.topic]}</span>
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label={assignee ? `Assigned to ${assignee.name}. Change assignee` : "Assign conversation"}>
              {assignee ? (
                <UserAvatar initials={assignee.initials} colorClassName={assignee.avatarColor} size="xs" />
              ) : (
                <UserPlus />
              )}
              <span className="hidden sm:inline">{assignee ? assignee.name.split(" ")[0] : "Assign"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Assign to</DropdownMenuLabel>
            {props.team
              .filter((m) => m.role !== "viewer" && !m.invited)
              .map((member) => (
                <DropdownMenuItem key={member.id} onSelect={() => props.onAssign(member.id)}>
                  <UserAvatar
                    initials={member.initials}
                    colorClassName={member.avatarColor}
                    size="xs"
                    presence={member.availability}
                  />
                  <span className="flex-1 truncate">{member.name}</span>
                  {member.id === conversation.assigneeId && <Check className="text-primary" aria-hidden="true" />}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => props.onAssign(null)} disabled={!conversation.assigneeId}>
              Unassign
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant={resolved ? "outline" : "default"} size="sm" onClick={props.onToggleStatus}>
          {resolved ? <RotateCcw /> : <CheckCircle2 />}
          <span className="hidden sm:inline">{resolved ? "Reopen" : "Resolve"}</span>
          <span className="sr-only sm:hidden">{resolved ? "Reopen conversation" : "Resolve conversation"}</span>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={props.onToggleDetails}
              aria-label={props.detailsOpen ? "Hide customer details" : "Show customer details"}
              aria-pressed={props.detailsOpen}
            >
              {props.detailsOpen ? <PanelRightClose /> : <PanelRightOpen />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{props.detailsOpen ? "Hide details" : "Customer details"}</TooltipContent>
        </Tooltip>
      </header>

      <div
        ref={scrollRef}
        className="scrollbar-thin min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/20 px-3 py-4 sm:px-6"
        role="log"
        aria-label="Messages"
        aria-live="polite"
      >
        {conversation.messages.map((message, index) => {
          const previous = conversation.messages[index - 1];
          const showDay = !previous || !isSameDay(previous.createdAt, message.createdAt);
          return (
            <Fragment key={message.id}>
              {showDay && (
                <div className="flex items-center gap-3 py-2" role="separator">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[11px] font-medium text-muted-foreground">{formatDayLabel(message.createdAt)}</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}
              <MessageBubble
                message={message}
                contact={contact}
                author={message.authorId ? teamMap.get(message.authorId) : undefined}
                aiName={aiName}
              />
            </Fragment>
          );
        })}
        {isTyping && <TypingIndicator contact={contact} />}
      </div>

      <MessageComposer
        draft={props.draft}
        onDraftChange={props.onDraftChange}
        mode={props.mode}
        onModeChange={props.onModeChange}
        onSend={props.onSend}
        onSuggest={props.onSuggest}
        aiEnabled={props.aiEnabled}
      />
    </section>
  );
}
