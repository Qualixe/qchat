"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Mail, MapPin, MessageSquare, Pencil, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge, TagBadge } from "@/components/shared/status-badge";
import { CHANNEL_META, ChannelIcon } from "@/components/shared/brand-icons";
import { CONTACT_STATUS, FULFILLMENT_STATUS } from "@/components/shared/status-maps";
import { useAppStore } from "@/lib/store/app-store";
import { formatCurrency, formatDate, formatRelative, formatShortDate } from "@/lib/format";
import type { Contact } from "@/lib/types";

interface ContactDetailsSheetProps {
  contact: Contact | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactDetailsSheet({ contact, onOpenChange, onEdit, onDelete }: ContactDetailsSheetProps) {
  const orders = useAppStore((s) => s.orders);
  const conversations = useAppStore((s) => s.conversations);
  const contactOrders = useMemo(() => orders.filter((o) => o.contactId === contact?.id), [orders, contact]);
  const hasConversation = conversations.some((c) => c.contactId === contact?.id);

  return (
    <Sheet open={contact !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        {contact && (
          <>
            <SheetHeader className="border-b p-5">
              <div className="flex items-center gap-3">
                <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} size="lg" />
                <div className="min-w-0">
                  <SheetTitle className="truncate">{contact.name}</SheetTitle>
                  <SheetDescription className="flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden="true" /> {contact.location || "Location unknown"}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <StatusBadge tone={CONTACT_STATUS[contact.status].tone}>{CONTACT_STATUS[contact.status].label}</StatusBadge>
                {contact.tags.map((t) => (
                  <TagBadge key={t}>{t}</TagBadge>
                ))}
              </div>
            </SheetHeader>

            <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-5">
              <dl className="grid gap-2.5 text-sm">
                <Row icon={<Mail className="size-4" />} label="Email" value={contact.email} />
                <Row icon={<Phone className="size-4" />} label="Phone" value={contact.phone} />
                <Row icon={<ChannelIcon channel={contact.channel} />} label="Channel" value={CHANNEL_META[contact.channel].label} />
              </dl>

              <div className="grid grid-cols-3 gap-2">
                <Tile label="Lifetime value" value={formatCurrency(contact.lifetimeValue)} />
                <Tile label="Orders" value={String(contact.totalOrders)} />
                <Tile label="Conversations" value={String(contact.totalConversations)} />
              </div>

              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Last contacted</dt>
                  <dd className="font-medium">{formatRelative(contact.lastContactedAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Customer since</dt>
                  <dd className="font-medium">{formatDate(contact.createdAt)}</dd>
                </div>
              </dl>

              <Separator />
              <section>
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">Notes</h3>
                <p className="text-sm whitespace-pre-wrap">{contact.notes || "No notes yet."}</p>
              </section>

              <Separator />
              <section>
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">Orders</h3>
                {contactOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet.</p>
                ) : (
                  <ul className="divide-y rounded-lg border">
                    {contactOrders.map((order) => (
                      <li key={order.id} className="flex items-center justify-between gap-2 px-3 py-2">
                        <div>
                          <p className="text-[13px] font-medium">{order.number}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatShortDate(order.createdAt)} · {formatCurrency(order.total)}
                          </p>
                        </div>
                        <StatusBadge tone={FULFILLMENT_STATUS[order.fulfillmentStatus].tone}>
                          {FULFILLMENT_STATUS[order.fulfillmentStatus].label}
                        </StatusBadge>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <SheetFooter className="flex-row border-t p-4">
              {hasConversation && (
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/inbox">
                    <MessageSquare /> Open inbox
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="flex-1" onClick={() => onEdit(contact)}>
                <Pencil /> Edit
              </Button>
              <Button variant="destructive" size="icon" onClick={() => onDelete(contact)} aria-label={`Delete ${contact.name}`}>
                <Trash2 />
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <dt className="sr-only">{label}</dt>
      <dd className="truncate">{value}</dd>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
