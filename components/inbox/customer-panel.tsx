"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, Mail, MapPin, Pencil, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge, TagBadge } from "@/components/shared/status-badge";
import { CONTACT_STATUS, FULFILLMENT_STATUS } from "@/components/shared/status-maps";
import { ContactFormDialog } from "@/components/contacts/contact-form-dialog";
import { TOPIC_LABELS } from "@/lib/mock-data/analytics";
import { updateContact } from "@/lib/store/app-store";
import { formatCurrency, formatDate, formatShortDate } from "@/lib/format";
import type { Contact, Conversation, Order, TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CustomerPanelProps {
  contact: Contact;
  conversation: Conversation;
  orders: Order[];
  team: TeamMember[];
  onAssign: (memberId: string | null) => void;
  onClose?: () => void;
  className?: string;
}

export function CustomerPanel({ contact, conversation, orders, team, onAssign, onClose, className }: CustomerPanelProps) {
  const [editOpen, setEditOpen] = useState(false);
  const status = CONTACT_STATUS[contact.status];
  const recentOrders = orders.filter((o) => o.contactId === contact.id).slice(0, 3);

  return (
    <aside aria-label="Customer details" className={cn("flex min-h-0 flex-col bg-background", className)}>
      <div className="flex h-[57px] shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold">Customer details</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Edit
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close customer details">
              <X />
            </Button>
          )}
        </div>
      </div>

      <div className="scrollbar-thin min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <div className="flex items-center gap-3">
          <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{contact.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" aria-hidden="true" />
              {contact.location || "Location unknown"}
            </p>
            <StatusBadge tone={status.tone} className="mt-1.5">
              {status.label}
            </StatusBadge>
          </div>
        </div>

        <dl className="space-y-2 text-sm">
          <ContactRow icon={Mail} label="Email" value={contact.email} />
          <ContactRow icon={Phone} label="Phone" value={contact.phone} />
        </dl>

        <div className="grid grid-cols-2 gap-2">
          <Metric label="Lifetime value" value={formatCurrency(contact.lifetimeValue)} />
          <Metric label="Orders" value={String(contact.totalOrders)} />
        </div>

        <Section title="Tags">
          {contact.tags.length ? (
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No tags yet — add some with Edit.</p>
          )}
        </Section>

        <Section title="Assigned teammate">
          <Select
            value={conversation.assigneeId ?? "unassigned"}
            onValueChange={(value) => onAssign(value === "unassigned" ? null : value)}
          >
            <SelectTrigger className="w-full" aria-label="Assigned teammate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {team
                .filter((m) => m.role !== "viewer" && !m.invited)
                .map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Section>

        <Section title="Conversation summary">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <SummaryItem label="Topic" value={TOPIC_LABELS[conversation.topic]} />
            <SummaryItem label="Handled by" value={conversation.aiHandled ? "AI assistant" : "Team"} />
            <SummaryItem label="Total conversations" value={String(contact.totalConversations)} />
            <SummaryItem label="Customer since" value={formatDate(contact.createdAt)} />
          </dl>
        </Section>

        <Section
          title="Recent orders"
          action={
            recentOrders.length > 0 ? (
              <Link href="/orders" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            ) : undefined
          }
        >
          {recentOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {recentOrders.map((order) => {
                const fulfillment = FULFILLMENT_STATUS[order.fulfillmentStatus];
                return (
                  <li key={order.id} className="flex items-center justify-between gap-2 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium">{order.number}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatShortDate(order.createdAt)} · {formatCurrency(order.total)}
                      </p>
                    </div>
                    <StatusBadge tone={fulfillment.tone}>{fulfillment.label}</StatusBadge>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        {/* Re-keyed on saved notes so edits made elsewhere reset the local draft. */}
        <NotesEditor key={`${contact.id}:${contact.notes}`} contact={contact} />
      </div>

      <ContactFormDialog open={editOpen} onOpenChange={setEditOpen} contact={contact} />
    </aside>
  );
}

function NotesEditor({ contact }: { contact: Contact }) {
  const [notes, setNotes] = useState(contact.notes);
  const dirty = notes !== contact.notes;
  return (
    <Section title="Customer notes">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Add context for your team…"
        aria-label="Customer notes"
        className="text-sm"
      />
      {dirty && (
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setNotes(contact.notes)}>
            Discard
          </Button>
          <Button
            size="sm"
            onClick={() => {
              updateContact(contact.id, { notes });
              toast.success("Notes saved");
            }}
          >
            Save notes
          </Button>
        </div>
      )}
    </Section>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <Separator className="mb-4" />
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="group flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <dt className="sr-only">{label}</dt>
      <dd className="min-w-0 flex-1 truncate">{value}</dd>
      <button
        type="button"
        className="grid size-6 place-items-center rounded text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100"
        aria-label={`Copy ${label.toLowerCase()}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            toast.success(`${label} copied`);
          } catch {
            toast.error("Couldn't access the clipboard");
          }
        }}
      >
        <Copy className="size-3" />
      </button>
    </div>
  );
}
