import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsPage } from "@/components/products/products-view";
import { TablePageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Products" };

export default function Page() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <ProductsPage />
    </Suspense>
  );
}
