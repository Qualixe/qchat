"use client";

import { useState } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ChartTable {
  headers: string[];
  rows: (string | number)[][];
}

interface ChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** Tabular fallback so chart data is never color- or vision-only. */
  table?: ChartTable;
  className?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, action, table, className, children }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);
  return (
    <Card className={cn("min-w-0 gap-4", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
        {(action || table) && (
          <CardAction className="flex items-center gap-1">
            {action}
            {table && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowTable((v) => !v)}
                aria-pressed={showTable}
                aria-label={showTable ? `Show ${title} as chart` : `Show ${title} as table`}
                title={showTable ? "Show chart" : "Show table"}
              >
                {showTable ? <BarChart3 /> : <Table2 />}
              </Button>
            )}
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="min-w-0">
        {showTable && table ? (
          <div className="max-h-72 overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {table.headers.map((h) => (
                    <TableHead key={h} className="h-8 text-xs">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.rows.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => (
                      <TableCell key={j} className="py-1.5 text-xs tabular-nums">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
