"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LayoutGrid, List, MoreHorizontal, Package, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ShopifyMark } from "@/components/shared/brand-icons";
import { PRODUCT_STATUS, STOCK_STATUS, stockStatusOf } from "@/components/shared/status-maps";
import { PRODUCT_CATEGORIES } from "@/lib/mock-data/products";
import { deleteProduct, useAppStore } from "@/lib/store/app-store";
import { formatCurrency, formatRelative } from "@/lib/format";
import type { Product, ProductCategory, StockStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductDetailsSheet } from "./product-details-sheet";
import { ProductFormDialog } from "./product-form-dialog";

type View = "grid" | "list";

export function ProductsPage() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const startAdding = params.get("new") === "1";
  return <ProductsView key={`${q}|${startAdding}`} initialQuery={q} startAdding={startAdding} />;
}

function ProductsView({ initialQuery, startAdding }: { initialQuery: string; startAdding: boolean }) {
  const products = useAppStore((s) => s.products);
  const shopify = useAppStore((s) => s.integrations.find((i) => i.id === "shopify"));
  const [view, setView] = useState<View>("grid");
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [stock, setStock] = useState<StockStatus | "all">("all");
  const [formOpen, setFormOpen] = useState(startAdding);
  const [editing, setEditing] = useState<Product | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [syncing, setSyncing] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (stock === "all" || stockStatusOf(p.inventory) === stock) &&
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)),
    );
  }, [products, search, category, stock]);

  const details = products.find((p) => p.id === detailsId) ?? null;
  const shopifyConnected = shopify?.status === "connected";

  function openEdit(product: Product) {
    setDetailsId(null);
    setEditing(product);
    setFormOpen(true);
  }

  function simulateSync() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success("Catalog is up to date", { description: "Simulated Shopify sync — no data was fetched." });
    }, 1200);
  }

  const actions = (product: Product) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${product.name}`} onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onSelect={() => setDetailsId(product.id)}>
          <Package /> View details
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openEdit(product)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(product)}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <PageContainer>
      <PageIntro
        description="Your catalog — the AI assistant uses it to answer price and availability questions."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus /> Add product
          </Button>
        }
      />

      <Card className="flex-row items-center gap-3 px-4 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#5e8e3e] text-white [--brand-icon-inner:#5e8e3e]">
          <ShopifyMark className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
            Shopify
            <StatusBadge tone={shopifyConnected ? "success" : "neutral"} dot>
              {shopifyConnected ? "Connected" : "Not connected"}
            </StatusBadge>
            <StatusBadge tone="warning">Simulated</StatusBadge>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {shopifyConnected
              ? `${shopify?.accountLabel} · ${products.filter((p) => p.source === "shopify").length} products synced`
              : "Connect your store to sync products automatically."}
          </p>
        </div>
        {shopifyConnected ? (
          <Button variant="outline" size="sm" onClick={simulateSync} disabled={syncing}>
            <RefreshCw className={cn(syncing && "animate-spin")} /> {syncing ? "Syncing…" : "Sync now"}
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href="/integrations">Connect</Link>
          </Button>
        )}
      </Card>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <SearchInput value={search} onChange={setSearch} label="Search products" placeholder="Search name or SKU…" className="md:w-72" />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory | "all")}>
            <SelectTrigger className="w-40" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {PRODUCT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stock} onValueChange={(v) => setStock(v as StockStatus | "all")}>
            <SelectTrigger className="w-40" aria-label="Filter by inventory">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All inventory</SelectItem>
              {(Object.keys(STOCK_STATUS) as StockStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STOCK_STATUS[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as View)}
          variant="outline"
          className="md:ml-auto"
          aria-label="Layout"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <p className="-mt-3 text-xs text-muted-foreground" aria-live="polite">
        {filtered.length} of {products.length} products
      </p>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Package} title="No products found" description="Try another search, category, or inventory filter." />
        </Card>
      ) : view === "grid" ? (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => {
            const stockStatus = STOCK_STATUS[stockStatusOf(product.inventory)];
            return (
              <li key={product.id}>
                <Card className="group h-full gap-0 py-0 transition-shadow hover:shadow-md">
                  <button type="button" onClick={() => setDetailsId(product.id)} className="relative block text-left" aria-label={`View ${product.name}`}>
                    <Image
                      src={product.image}
                      alt=""
                      width={400}
                      height={400}
                      unoptimized
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="absolute top-2 left-2">
                      <StatusBadge tone={stockStatus.tone} dot className="bg-background/90 backdrop-blur">
                        {stockStatus.label}
                      </StatusBadge>
                    </span>
                  </button>
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <div className="flex items-start gap-1">
                      <p className="line-clamp-2 flex-1 text-[13px] leading-snug font-medium">{product.name}</p>
                      {actions(product)}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {product.sku} · {product.category}
                    </p>
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <p className="text-sm font-semibold tabular-nums">
                        {formatCurrency(product.price)}
                        {product.compareAtPrice && (
                          <span className="ml-1.5 text-xs font-normal text-muted-foreground line-through">
                            {formatCurrency(product.compareAtPrice)}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted-foreground tabular-nums">{product.inventory} in stock</p>
                    </div>
                    {product.status !== "active" && (
                      <StatusBadge tone={PRODUCT_STATUS[product.status].tone} className="mt-1 self-start">
                        {PRODUCT_STATUS[product.status].label}
                      </StatusBadge>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card className="gap-0 py-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-4">Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-10 pr-4">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => {
                  const stockStatus = STOCK_STATUS[stockStatusOf(product.inventory)];
                  return (
                    <TableRow key={product.id} className="cursor-pointer" onClick={() => setDetailsId(product.id)}>
                      <TableCell className="pl-4">
                        <span className="flex items-center gap-3">
                          <Image src={product.image} alt="" width={36} height={36} unoptimized className="size-9 rounded-md border" />
                          <span className="font-medium">{product.name}</span>
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(product.price)}</TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-2 tabular-nums">
                          {product.inventory}
                          <StatusBadge tone={stockStatus.tone}>{stockStatus.label}</StatusBadge>
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={PRODUCT_STATUS[product.status].tone}>{PRODUCT_STATUS[product.status].label}</StatusBadge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatRelative(product.updatedAt)}</TableCell>
                      <TableCell className="pr-4">{actions(product)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editing} />
      <ProductDetailsSheet
        product={details}
        onOpenChange={(open) => !open && setDetailsId(null)}
        onEdit={openEdit}
        onDelete={setDeleting}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete product?"
        description={
          <>
            <strong>{deleting?.name}</strong> will be removed from your catalog and the AI assistant will stop recommending it.
          </>
        }
        onConfirm={() => {
          if (!deleting) return;
          deleteProduct(deleting.id);
          if (detailsId === deleting.id) setDetailsId(null);
          toast.success("Product deleted", { description: deleting.name });
          setDeleting(null);
        }}
      />
    </PageContainer>
  );
}
