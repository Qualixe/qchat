"use client";

import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination, paginate } from "@/components/shared/pagination";
import { ChannelIcon } from "@/components/shared/brand-icons";
import { FULFILLMENT_STATUS, PAYMENT_STATUS } from "@/components/shared/status-maps";
import { useAppStore } from "@/lib/store/app-store";
import { useContactMap } from "@/lib/store/hooks";
import { formatCurrency, formatDate } from "@/lib/format";
import type { FulfillmentStatus, PaymentStatus } from "@/lib/types";
import { OrderDetailsSheet } from "./order-details-sheet";

const PAGE_SIZE = 8;

export function OrdersView() {
  const orders = useAppStore((s) => s.orders);
  const contacts = useContactMap();
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState<PaymentStatus | "all">("all");
  const [fulfillment, setFulfillment] = useState<FulfillmentStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) => {
        if (payment !== "all" && o.paymentStatus !== payment) return false;
        if (fulfillment !== "all" && o.fulfillmentStatus !== fulfillment) return false;
        if (!q) return true;
        const name = contacts.get(o.contactId)?.name.toLowerCase() ?? "";
        return o.number.toLowerCase().includes(q) || name.includes(q);
      })
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [orders, contacts, search, payment, fulfillment]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = paginate(filtered, currentPage, PAGE_SIZE);
  const selected = orders.find((o) => o.id === selectedId) ?? null;

  const revenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const toFulfil = orders.filter((o) => o.fulfillmentStatus === "unfulfilled" || o.fulfillmentStatus === "processing").length;
  const filtersActive = search !== "" || payment !== "all" || fulfillment !== "all";

  return (
    <PageContainer>
      <PageIntro description="Orders placed through your conversations and connected store. Sample data — read only." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Summary label="Orders" value={String(orders.length)} />
        <Summary label="Paid revenue" value={formatCurrency(revenue)} />
        <Summary label="Awaiting fulfillment" value={String(toFulfil)} />
      </div>

      <Card className="gap-0 py-0">
        <div className="flex flex-col gap-2 border-b p-3 md:flex-row md:items-center">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            label="Search orders"
            placeholder="Search order # or customer…"
            className="md:w-72"
          />
          <div className="flex flex-wrap gap-2">
            <Select
              value={payment}
              onValueChange={(v) => {
                setPayment(v as PaymentStatus | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44" aria-label="Filter by payment status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                {(Object.keys(PAYMENT_STATUS) as PaymentStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {PAYMENT_STATUS[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={fulfillment}
              onValueChange={(v) => {
                setFulfillment(v as FulfillmentStatus | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-44" aria-label="Filter by fulfillment status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All fulfillment</SelectItem>
                {(Object.keys(FULFILLMENT_STATUS) as FulfillmentStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {FULFILLMENT_STATUS[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filtersActive && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setPayment("all");
                  setFulfillment("all");
                  setPage(1);
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No orders found" description="Try a different search or status filter." />
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[780px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-4">Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="pr-4">Fulfillment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((order) => {
                  const contact = contacts.get(order.contactId);
                  return (
                    <TableRow key={order.id} className="cursor-pointer" onClick={() => setSelectedId(order.id)}>
                      <TableCell className="pl-4">
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(order.id);
                          }}
                        >
                          {order.number}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <ChannelIcon channel={order.channel} className="size-3.5" />
                          {contact?.name ?? "Deleted contact"}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-right tabular-nums">{order.items.reduce((s, i) => s + i.quantity, 0)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <StatusBadge tone={PAYMENT_STATUS[order.paymentStatus].tone} dot>
                          {PAYMENT_STATUS[order.paymentStatus].label}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="pr-4">
                        <StatusBadge tone={FULFILLMENT_STATUS[order.fulfillmentStatus].tone} dot>
                          {FULFILLMENT_STATUS[order.fulfillmentStatus].label}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} itemLabel="orders" />
      </Card>

      <OrderDetailsSheet
        order={selected}
        contact={selected ? contacts.get(selected.contactId) : undefined}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </PageContainer>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-1 px-4 py-4">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </Card>
  );
}
