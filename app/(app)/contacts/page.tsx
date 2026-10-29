import { Suspense } from "react";
import type { Metadata } from "next";
import { ContactsPage } from "@/components/contacts/contacts-view";
import { TablePageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Contacts" };

export default function Page() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <ContactsPage />
    </Suspense>
  );
}
