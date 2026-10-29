"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function Pagination({ page, pageSize, total, onPageChange, itemLabel = "results" }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  return (
    <nav className="flex items-center justify-between gap-3 border-t px-4 py-3" aria-label="Pagination">
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Showing <span className="font-medium text-foreground tabular-nums">{start}–{end}</span> of{" "}
        <span className="font-medium text-foreground tabular-nums">{total}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-1.5">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
