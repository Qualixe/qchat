"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function DashboardError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      className="min-h-[60vh]"
      icon={TriangleAlert}
      title="Something went wrong on this page"
      description="The rest of the app still works. Try again, or head back to the overview."
      action={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to overview</Link>
          </Button>
          <Button onClick={() => retry()}>Try again</Button>
        </div>
      }
    />
  );
}
