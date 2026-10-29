"use client";

import Image from "next/image";
import { CreditCard, MapPin, StickyNote, Truck } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { CHANNEL_META, ChannelIcon } from "@/components/shared/brand-icons";
import { FULFILLMENT_STATUS, PAYMENT_STATUS } from "@/components/shared/status-maps";
import { useAppStore } from "@/lib/store/app-store";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Contact, Order } from "@/lib/types";

interface OrderDetailsSheetProps {
  order: Order | null;
  contact?: Contact;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsSheet({ order, contact, onOpenChange }: OrderDetailsSheetProps) {
  const products = useAppStore((s) => s.products);
  return (
    <Sheet open={order !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        {order && (
          <>
            <SheetHeader className="border-b p-5">
              <SheetTitle>Order {order.number}</SheetTitle>
              <SheetDescription>Placed {formatDateTime(order.createdAt)}</SheetDescription>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <StatusBadge tone={PAYMENT_STATUS[order.paymentStatus].tone} dot>
                  {PAYMENT_STATUS[order.paymentStatus].label}
                </StatusBadge>
                <StatusBadge tone={FULFILLMENT_STATUS[order.fulfillmentStatus].tone} dot>
                  {FULFILLMENT_STATUS[order.fulfillmentStatus].label}
                </StatusBadge>
              </div>
            </SheetHeader>

            <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-5">
              {contact && (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{contact.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {contact.email} · {contact.phone}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ChannelIcon channel={order.channel} /> {CHANNEL_META[order.channel].label}
                  </span>
                </div>
              )}

              <section>
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</h3>
                <ul className="divide-y rounded-lg border">
                  {order.items.map((item) => {
                    const image = products.find((p) => p.id === item.productId)?.image;
                    return (
                      <li key={item.productId} className="flex items-center gap-3 p-3">
                        {image ? (
                          <Image src={image} alt="" width={44} height={44} unoptimized className="size-11 rounded-md border" />
                        ) : (
                          <span className="size-11 rounded-md border bg-muted" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.sku} · {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="text-sm font-medium tabular-nums">{formatCurrency(item.quantity * item.unitPrice)}</p>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <dl className="space-y-1.5 text-sm">
                <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
                <SummaryRow label="Shipping" value={order.shipping ? formatCurrency(order.shipping) : "Free"} />
                {order.discount > 0 && <SummaryRow label="Discount" value={`−${formatCurrency(order.discount)}`} />}
                <Separator className="my-2" />
                <SummaryRow label="Total" value={formatCurrency(order.total)} strong />
              </dl>

              <section className="space-y-3 text-sm">
                <InfoRow icon={CreditCard} label="Payment" value={order.paymentMethod} />
                <InfoRow icon={MapPin} label="Shipping address" value={order.shippingAddress} />
                <InfoRow icon={Truck} label="Tracking" value={order.trackingNumber ?? "Not shipped yet"} />
                {order.note && <InfoRow icon={StickyNote} label="Note" value={order.note} />}
              </section>
              <p className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                Sample order data. Order editing, refunds, and payment processing aren&apos;t available in this demo.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className={strong ? "font-medium" : "text-muted-foreground"}>{label}</dt>
      <dd className={strong ? "font-semibold tabular-nums" : "tabular-nums"}>{value}</dd>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Truck; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}
