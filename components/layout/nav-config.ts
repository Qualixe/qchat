import {
  BarChart3,
  Bot,
  Inbox,
  LayoutDashboard,
  Package,
  Plug,
  Settings,
  ShoppingBag,
  UserRound,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard, description: "Your store's conversations at a glance" },
      { title: "Inbox", href: "/inbox", icon: Inbox, description: "All customer conversations in one place" },
      { title: "AI Assistant", href: "/ai-assistant", icon: Bot, description: "Configure how your AI replies" },
      { title: "Automations", href: "/automations", icon: Workflow, description: "Rules that run on every conversation" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { title: "Contacts", href: "/contacts", icon: UserRound, description: "Customers and leads" },
      { title: "Products", href: "/products", icon: Package, description: "Catalog the AI can answer from" },
      { title: "Orders", href: "/orders", icon: ShoppingBag, description: "Orders from all channels" },
      { title: "Analytics", href: "/analytics", icon: BarChart3, description: "Performance and trends" },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Integrations", href: "/integrations", icon: Plug, description: "Channels and store connections" },
      { title: "Team", href: "/team", icon: Users, description: "Teammates and roles" },
      { title: "Settings", href: "/settings", icon: Settings, description: "Workspace preferences" },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((section) => section.items);

export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
