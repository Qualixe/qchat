import { Bot, CheckCircle2, Sparkles } from "lucide-react";
import { MessageBubble } from "@/components/inbox/message-bubble";
import { ChannelIcon } from "@/components/shared/brand-icons";
import { LogoMark } from "@/components/shared/logo";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { contacts } from "@/lib/mock-data/contacts";
import { conversations } from "@/lib/mock-data/conversations";
import { teamMembers } from "@/lib/mock-data/organization";
import { formatMessageStamp } from "@/lib/format";

const contactById = new Map(contacts.map((c) => [c.id, c]));
const listed = conversations.slice(0, 5);
const featured = conversations.find((c) => c.id === "cv_1003") ?? conversations[0];
const featuredContact = contactById.get(featured.contactId)!;

/**
 * Product preview for the landing page, rendered with the same components the
 * app uses. Decorative: hidden from assistive tech, described by the caption.
 */
export function DashboardPreview() {
  return (
    <figure className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none overflow-hidden rounded-[20px] border border-white/10 bg-background select-none"
        inert
      >
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="mx-auto rounded-md border bg-background px-3 py-0.5 text-[11px] text-muted-foreground">
            app.qchat.example/inbox
          </span>
        </div>
        <div className="grid h-[420px] grid-cols-1 sm:grid-cols-[230px_1fr] lg:grid-cols-[52px_250px_1fr]">
          <div className="hidden flex-col items-center gap-3 border-r bg-sidebar py-3 lg:flex">
            <LogoMark className="size-7" />
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className={i === 1 ? "size-7 rounded-md bg-background ring-1 ring-border" : "size-7 rounded-md bg-muted/70"} />
            ))}
          </div>
          <ul className="hidden divide-y overflow-hidden border-r sm:block">
            {listed.map((conversation, index) => {
              const contact = contactById.get(conversation.contactId)!;
              const last = conversation.messages[conversation.messages.length - 1];
              return (
                <li key={conversation.id} className={index === 2 ? "flex gap-2.5 bg-accent/70 p-3" : "flex gap-2.5 p-3"}>
                  <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs font-medium">
                      <span className="truncate">{contact.name}</span>
                      <ChannelIcon channel={conversation.channel} className="size-3" />
                      <span className="ml-auto text-[10px] font-normal text-muted-foreground">
                        {formatMessageStamp(conversation.lastMessageAt)}
                      </span>
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">{last?.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2.5 border-b px-4 py-2.5">
              <UserAvatar initials={featuredContact.initials} colorClassName={featuredContact.avatarColor} size="sm" presence="online" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{featuredContact.name}</p>
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ChannelIcon channel={featured.channel} className="size-3" /> Instagram · Active now
                </p>
              </div>
              <StatusBadge tone="primary" dot>
                <Bot className="size-3" /> AI handling
              </StatusBadge>
            </div>
            <div className="flex-1 space-y-2.5 overflow-hidden bg-muted/20 p-4 [&_p]:text-[12px]">
              {featured.messages.slice(0, 4).map((m) => (
                <MessageBubble key={m.id} message={m} contact={featuredContact} author={teamMembers[0]} aiName="Nokshi Assistant" />
              ))}
            </div>
            <div className="border-t p-3">
              <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-[11px] text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                <span className="flex-1 truncate">AI suggestion ready: “Together they come to ৳2,430 with free delivery…”</span>
                <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">Send</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute -bottom-6 -left-4 hidden w-56 rounded-xl border bg-card p-3 shadow-xl md:block lg:-left-10"
      >
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-emerald-600" /> Resolved by AI
        </p>
        <p className="mt-1 text-[13px] font-medium">“Delivery charge koto?” answered in Banglish</p>
      </div>
      <figcaption className="sr-only">
        Preview of the QChat inbox showing customer conversations from Messenger, WhatsApp, and Instagram, with the AI
        assistant answering a product question.
      </figcaption>
    </figure>
  );
}
