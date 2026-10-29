import { AlertCircle, Check, CheckCheck, Clock, FileText, ImageIcon, Lock, Sparkles } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { formatTime } from "@/lib/format";
import type { Contact, DeliveryStatus, Message, TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";

const DELIVERY: Record<DeliveryStatus, { icon: typeof Check; label: string; className?: string }> = {
  sending: { icon: Clock, label: "Sending" },
  sent: { icon: Check, label: "Sent" },
  delivered: { icon: CheckCheck, label: "Delivered" },
  read: { icon: CheckCheck, label: "Read", className: "text-primary" },
  failed: { icon: AlertCircle, label: "Failed", className: "text-destructive" },
};

interface MessageBubbleProps {
  message: Message;
  contact: Contact;
  author?: TeamMember;
  aiName: string;
}

export function MessageBubble({ message, contact, author, aiName }: MessageBubbleProps) {
  if (message.authorType === "system") {
    return (
      <div className="flex justify-center py-1">
        <p className="rounded-full bg-muted px-3 py-1 text-center text-[11px] text-muted-foreground">
          {message.body} · {formatTime(message.createdAt)}
        </p>
      </div>
    );
  }

  const inbound = message.authorType === "customer";
  const isAi = message.authorType === "ai";
  const isNote = Boolean(message.isInternalNote);
  const authorName = inbound ? contact.name : isAi ? aiName : (author?.name ?? "Teammate");
  const delivery = message.status ? DELIVERY[message.status] : undefined;

  return (
    <div className={cn("flex items-end gap-2", inbound ? "justify-start" : "justify-end")}>
      {inbound && <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} size="sm" />}
      <div className={cn("flex max-w-[min(80%,34rem)] flex-col gap-1", inbound ? "items-start" : "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap",
            inbound && "rounded-bl-md bg-muted text-foreground",
            !inbound && !isAi && !isNote && "rounded-br-md bg-primary text-primary-foreground",
            isAi && "rounded-br-md border border-primary/15 bg-accent text-accent-foreground",
            isNote &&
              "rounded-br-md border border-amber-300/60 bg-amber-50 text-amber-950 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100",
          )}
        >
          {(isAi || isNote) && (
            <p className="mb-1 flex items-center gap-1 text-[11px] font-medium opacity-80">
              {isAi ? <Sparkles className="size-3" aria-hidden="true" /> : <Lock className="size-3" aria-hidden="true" />}
              {isAi ? "AI reply" : "Internal note · only visible to your team"}
            </p>
          )}
          {message.body}
          {message.attachment && (
            <span
              className={cn(
                "mt-2 flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs",
                inbound || isAi || isNote ? "bg-background/70" : "border-primary-foreground/20 bg-primary-foreground/10",
              )}
            >
              {message.attachment.kind === "image" ? (
                <ImageIcon className="size-4 shrink-0" aria-hidden="true" />
              ) : (
                <FileText className="size-4 shrink-0" aria-hidden="true" />
              )}
              <span className="min-w-0 flex-1 truncate font-medium">{message.attachment.name}</span>
              <span className="shrink-0 opacity-70">{message.attachment.size}</span>
            </span>
          )}
        </div>
        <p className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
          {!inbound && <span>{authorName} ·</span>}
          <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
          {delivery && (
            <span className={cn("inline-flex items-center", delivery.className)} title={delivery.label}>
              <delivery.icon className="size-3.5" aria-hidden="true" />
              <span className="sr-only">{delivery.label}</span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export function TypingIndicator({ contact }: { contact: Contact }) {
  return (
    <div className="flex items-end gap-2" role="status" aria-label={`${contact.name} is typing`}>
      <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} size="sm" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-3.5 py-3">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
