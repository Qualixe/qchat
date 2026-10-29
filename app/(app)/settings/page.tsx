import { Suspense } from "react";
import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";
import { TablePageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Suspense fallback={<TablePageSkeleton />}>
      <SettingsView />
    </Suspense>
  );
}
