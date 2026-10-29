"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { restorePersistedState, useAppStore } from "@/lib/store/app-store";
import { AppHeader } from "./app-header";
import { AppSidebar, SidebarContent } from "./app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useAppStore((s) => s.settings.appearance.sidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    restorePersistedState();
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <AppSidebar collapsed={collapsed} />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0 sm:max-w-72" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Main navigation menu</SheetDescription>
          </SheetHeader>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onOpenMobileNav={() => setMobileOpen(true)} />
        <main id="main" tabIndex={-1} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
