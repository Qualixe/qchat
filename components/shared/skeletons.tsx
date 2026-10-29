import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "./page-intro";

export function TablePageSkeleton() {
  return (
    <PageContainer aria-busy="true">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="rounded-xl border">
        <div className="flex gap-2 border-b p-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-8 w-32" />
        </div>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 border-b px-4 py-3 last:border-0">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

export function DashboardSkeleton() {
  return (
    <PageContainer aria-busy="true">
      <Skeleton className="h-4 w-80" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </PageContainer>
  );
}
