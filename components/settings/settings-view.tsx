"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, Building2, CreditCard, Palette, Settings2, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { useAppStore } from "@/lib/store/app-store";
import { BusinessSettings } from "./business-settings";
import { GeneralSettings } from "./general-settings";
import { AppearanceSettings, NotificationSettings } from "./preference-settings";
import { SecuritySettings } from "./security-settings";
import { SubscriptionSettings } from "./subscription-settings";

const TABS = [
  { value: "general", label: "General", icon: Settings2 },
  { value: "business", label: "Business profile", icon: Building2 },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "appearance", label: "Appearance", icon: Palette },
  { value: "subscription", label: "Subscription", icon: CreditCard },
  { value: "security", label: "Security", icon: ShieldCheck },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function isTab(value: string | null): value is TabValue {
  return TABS.some((t) => t.value === value);
}

export function SettingsView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const settings = useAppStore((s) => s.settings);
  const requested = params.get("tab");
  const tab: TabValue = isTab(requested) ? requested : "general";

  return (
    <PageContainer className="max-w-5xl">
      <PageIntro description="Manage your workspace, business details, and preferences. Settings are saved in this browser." />
      <Tabs
        value={tab}
        onValueChange={(value) => router.replace(value === "general" ? pathname : `${pathname}?tab=${value}`, { scroll: false })}
        className="gap-6"
      >
        <div className="scrollbar-thin -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList variant="line" className="w-max border-b">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-1.5 px-3">
                <Icon aria-hidden="true" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {/* Forms are keyed on saved values so they refresh after restores or resets. */}
        <TabsContent value="general">
          <GeneralSettings key={JSON.stringify(settings.general)} settings={settings.general} />
        </TabsContent>
        <TabsContent value="business">
          <BusinessSettings key={JSON.stringify(settings.business)} settings={settings.business} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings settings={settings.notifications} />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettings settings={settings.appearance} />
        </TabsContent>
        <TabsContent value="subscription">
          <SubscriptionSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings settings={settings.security} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
