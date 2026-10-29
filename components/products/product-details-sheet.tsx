"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/shared/status-badge";
import { ShopifyMark } from "@/components/shared/brand-icons";
import { PRODUCT_STATUS, STOCK_STATUS, stockStatusOf } from "@/components/shared/status-maps";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductDetailsSheetProps {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductDetailsSheet({ product, onOpenChange, onEdit, onDelete }: ProductDetailsSheetProps) {
  return (
    <Sheet open={product !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        {product && (
          <>
            <SheetHeader className="border-b p-5">
              <SheetTitle>{product.name}</SheetTitle>
              <SheetDescription>
                {product.sku} · {product.category}
              </SheetDescription>
            </SheetHeader>
            <div className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-5">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                unoptimized
                className="aspect-square w-full rounded-xl border object-cover"
              />
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge tone={PRODUCT_STATUS[product.status].tone}>{PRODUCT_STATUS[product.status].label}</StatusBadge>
                <StatusBadge tone={STOCK_STATUS[stockStatusOf(product.inventory)].tone} dot>
                  {STOCK_STATUS[stockStatusOf(product.inventory)].label}
                </StatusBadge>
                {product.source === "shopify" && (
                  <StatusBadge tone="success">
                    <ShopifyMark className="size-3" /> Synced from Shopify
                  </StatusBadge>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <Tile label="Price" value={formatCurrency(product.price)} sub={product.compareAtPrice ? `was ${formatCurrency(product.compareAtPrice)}` : undefined} />
                <Tile label="Inventory" value={`${product.inventory} units`} />
              </dl>
              <section>
                <h3 className="mb-1.5 text-xs font-medium text-muted-foreground">Description</h3>
                <p className="text-sm">{product.description || "No description."}</p>
              </section>
              <p className="text-xs text-muted-foreground">Last updated {formatRelative(product.updatedAt)}</p>
            </div>
            <SheetFooter className="flex-row border-t p-4">
              <Button variant="outline" className="flex-1" onClick={() => onEdit(product)}>
                <Pencil /> Edit product
              </Button>
              <Button variant="destructive" size="icon" onClick={() => onDelete(product)} aria-label={`Delete ${product.name}`}>
                <Trash2 />
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold tabular-nums">
        {value}
        {sub && <span className="block text-[11px] font-normal text-muted-foreground line-through">{sub}</span>}
      </dd>
    </div>
  );
}
