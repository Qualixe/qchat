"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MessagesSquare } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { AI_SUGGESTIONS } from "@/lib/mock-data/conversations";
import {
  assignConversation,
  markConversationRead,
  receiveCustomerMessage,
  sendMessage,
  setConversationStatus,
  setTyping,
  useAppStore,
} from "@/lib/store/app-store";
import { useContactMap, useTeamMap } from "@/lib/store/hooks";
import type { Conversation, MessageAttachment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ConversationList, type InboxFilter } from "./conversation-list";
import { ConversationThread } from "./conversation-thread";
import { CustomerPanel } from "./customer-panel";
import type { ComposerMode } from "./message-composer";

/** Canned customer follow-ups used to simulate a live conversation. */
const SIMULATED_REPLIES = [
  "Thank you so much! 🙏",
  "Okay, got it. Thanks for the quick reply!",
  "Perfect, that works for me.",
  "Great, ami wait korchi tahole.",
];

function matchesFilter(conversation: Conversation, filter: InboxFilter, currentUserId: string) {
  switch (filter) {
    case "unread":
      return conversation.unreadCount > 0;
    case "mine":
      return conversation.assigneeId === currentUserId && conversation.status !== "resolved";
    case "resolved":
      return conversation.status === "resolved";
    default:
      return true;
  }
}

function isWideScreen() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches;
}

export function InboxView() {
  const conversations = useAppStore((s) => s.conversations);
  const orders = useAppStore((s) => s.orders);
  const team = useAppStore((s) => s.team);
  const typing = useAppStore((s) => s.typing);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const aiConfig = useAppStore((s) => s.aiConfig);
  const contactMap = useContactMap();
  const teamMap = useTeamMap();

  const [filter, setFilter] = useState<InboxFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [modes, setModes] = useState<Record<string, ComposerMode>>({});
  const replyCount = useRef(0);
  const pendingReplies = useRef(new Set<string>());
  const selectedRef = useRef<string | null>(null);

  const sorted = useMemo(
    () => [...conversations].sort((a, b) => Date.parse(b.lastMessageAt) - Date.parse(a.lastMessageAt)),
    [conversations],
  );

  const counts = useMemo(
    () => ({
      all: sorted.length,
      unread: sorted.filter((c) => matchesFilter(c, "unread", currentUserId)).length,
      mine: sorted.filter((c) => matchesFilter(c, "mine", currentUserId)).length,
      resolved: sorted.filter((c) => matchesFilter(c, "resolved", currentUserId)).length,
    }),
    [sorted, currentUserId],
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sorted.filter((c) => {
      if (!matchesFilter(c, filter, currentUserId)) return false;
      if (!query) return true;
      const contact = contactMap.get(c.contactId);
      return (
        contact?.name.toLowerCase().includes(query) ||
        c.messages.some((m) => m.body.toLowerCase().includes(query))
      );
    });
  }, [sorted, filter, search, currentUserId, contactMap]);

  // Default to the most recent conversation so desktop never shows an empty pane.
  const activeId = selectedId ?? sorted[0]?.id ?? null;
  const active = conversations.find((c) => c.id === activeId) ?? null;
  const activeContact = active ? contactMap.get(active.contactId) : undefined;

  useEffect(() => {
    selectedRef.current = activeId;
  }, [activeId]);

  function select(id: string) {
    setSelectedId(id);
    setMobileView("thread");
    markConversationRead(id);
  }

  function simulateCustomerReply(id: string) {
    if (pendingReplies.current.has(id)) return;
    pendingReplies.current.add(id);
    setTimeout(() => setTyping(id, true), 1400);
    setTimeout(() => {
      setTyping(id, false);
      const body = SIMULATED_REPLIES[replyCount.current % SIMULATED_REPLIES.length];
      replyCount.current += 1;
      receiveCustomerMessage(id, body, selectedRef.current !== id);
      pendingReplies.current.delete(id);
    }, 4200);
  }

  function handleSend(body: string, attachment?: MessageAttachment) {
    if (!active) return;
    const internal = (modes[active.id] ?? "reply") === "note";
    sendMessage(active.id, body, { internal, attachment });
    setDrafts((d) => ({ ...d, [active.id]: "" }));
    if (internal) {
      toast.success("Internal note added");
    } else if (active.status !== "resolved") {
      simulateCustomerReply(active.id);
    }
  }

  function handleSuggest() {
    if (!active) return;
    const suggestion = AI_SUGGESTIONS[active.topic][0];
    setDrafts((d) => ({ ...d, [active.id]: suggestion }));
    setModes((m) => ({ ...m, [active.id]: "reply" }));
    toast("AI suggestion inserted", { description: "Review and edit before sending. (Predefined demo response)" });
  }

  function handleAssign(memberId: string | null) {
    if (!active) return;
    assignConversation(active.id, memberId);
    const member = memberId ? teamMap.get(memberId) : undefined;
    toast.success(member ? `Assigned to ${member.name}` : "Conversation unassigned");
  }

  function handleToggleStatus() {
    if (!active) return;
    const next = active.status === "resolved" ? "open" : "resolved";
    setConversationStatus(active.id, next);
    toast.success(next === "resolved" ? "Conversation resolved" : "Conversation reopened");
  }

  function handleToggleDetails() {
    if (isWideScreen()) setDetailsOpen((open) => !open);
    else setDetailsSheetOpen(true);
  }

  const panel =
    active && activeContact ? (
      <CustomerPanel
        className="w-full"
        contact={activeContact}
        conversation={active}
        orders={orders}
        team={team}
        onAssign={handleAssign}
      />
    ) : null;

  return (
    <div className="flex h-full min-h-0">
      <ConversationList
        className={cn(
          "w-full shrink-0 border-r md:flex md:w-80 lg:w-[22rem]",
          mobileView === "list" ? "flex" : "hidden",
        )}
        conversations={visible}
        counts={counts}
        contacts={contactMap}
        team={teamMap}
        typing={typing}
        selectedId={activeId}
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        onSelect={select}
      />

      <div className={cn("min-w-0 flex-1 md:flex", mobileView === "thread" ? "flex" : "hidden")}>
        {active && activeContact ? (
          <ConversationThread
            conversation={active}
            contact={activeContact}
            team={team}
            teamMap={teamMap}
            isTyping={typing.includes(active.id)}
            aiName={aiConfig.name}
            aiEnabled={aiConfig.enabled}
            draft={drafts[active.id] ?? ""}
            onDraftChange={(value) => setDrafts((d) => ({ ...d, [active.id]: value }))}
            mode={modes[active.id] ?? "reply"}
            onModeChange={(mode) => setModes((m) => ({ ...m, [active.id]: mode }))}
            onSend={handleSend}
            onSuggest={handleSuggest}
            onAssign={handleAssign}
            onToggleStatus={handleToggleStatus}
            onBack={() => setMobileView("list")}
            detailsOpen={detailsOpen}
            onToggleDetails={handleToggleDetails}
          />
        ) : (
          <EmptyState
            className="flex-1"
            icon={MessagesSquare}
            title="No conversation selected"
            description="Choose a conversation from the list to start replying."
          />
        )}
      </div>

      {detailsOpen && panel && <div className="hidden w-80 shrink-0 border-l xl:flex">{panel}</div>}

      <Sheet open={detailsSheetOpen} onOpenChange={setDetailsSheetOpen}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-sm" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>Customer details</SheetTitle>
            <SheetDescription>Profile, orders, and notes for this customer</SheetDescription>
          </SheetHeader>
          {active && activeContact && (
            <CustomerPanel
              className="h-full"
              contact={activeContact}
              conversation={active}
              orders={orders}
              team={team}
              onAssign={handleAssign}
              onClose={() => setDetailsSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
