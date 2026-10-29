"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Check,
  ChevronsUpDown,
  CircleHelp,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo, LogoMark } from "@/components/shared/logo";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { organizations } from "@/lib/mock-data/organization";
import { setSidebarCollapsed, switchOrganization } from "@/lib/store/app-store";
import { useCurrentUser, useOrganization, useUnreadCount } from "@/lib/store/hooks";
import { mockSignOut } from "@/lib/auth/mock-auth";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, findNavItem, type NavItem } from "./nav-config";

const PLAN_LABEL = { starter: "Starter", growth: "Growth", scale: "Scale" } as const;

interface SidebarContentProps {
  collapsed?: boolean;
  /** Called after a navigation link is chosen (closes the mobile drawer). */
  onNavigate?: () => void;
  /** Desktop only: renders the collapse/expand toggle in the top row. */
  onToggleCollapsed?: () => void;
}

export function SidebarContent({ collapsed = false, onNavigate, onToggleCollapsed }: SidebarContentProps) {
  const pathname = usePathname();
  const active = findNavItem(pathname);
  const unread = useUnreadCount();

  const toggle = onToggleCollapsed && (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</TooltipContent>
    </Tooltip>
  );

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-14 shrink-0 items-center", collapsed ? "justify-center px-2" : "justify-between pr-2 pl-4")}>
        {collapsed && toggle ? (
          toggle
        ) : (
          <>
            <Link href="/dashboard" onClick={onNavigate} className="rounded-md" aria-label="QChat — Overview">
              {collapsed ? <LogoMark /> : <Logo />}
            </Link>
            {toggle}
          </>
        )}
      </div>

      <div className={cn("pb-2", collapsed ? "px-2" : "px-3")}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <nav aria-label="Main" className="scrollbar-thin flex-1 overflow-y-auto px-3 py-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4 last:mb-0">
            {!collapsed && (
              <p className="px-2 pb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground/80 uppercase">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <SidebarLink
                    item={item}
                    active={active?.href === item.href}
                    collapsed={collapsed}
                    badge={item.href === "/inbox" && unread > 0 ? unread : undefined}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn("border-t border-sidebar-border p-3", collapsed && "px-2")}>
        <AccountMenu collapsed={collapsed} />
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  collapsed,
  badge,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  badge?: number;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-xs ring-1 ring-sidebar-border"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon
        className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}
        aria-hidden="true"
      />
      {collapsed ? (
        <span className="sr-only">{item.title}</span>
      ) : (
        <span className="truncate">{item.title}</span>
      )}
      {badge !== undefined &&
        (collapsed ? (
          <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" aria-label={`${badge} unread`} />
        ) : (
          <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] leading-4 font-semibold text-primary-foreground tabular-nums">
            {badge}
            <span className="sr-only"> unread conversations</span>
          </span>
        ))}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.title}</TooltipContent>
    </Tooltip>
  );
}

function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const current = useOrganization();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-background p-1.5 text-left shadow-xs transition-colors hover:bg-sidebar-accent",
            collapsed && "justify-center",
          )}
          aria-label={`Workspace: ${current.name}. Switch workspace`}
        >
          <span className={cn("grid size-6 shrink-0 place-items-center rounded-md text-[10px] font-semibold", current.color)}>
            {current.initials}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{current.name}</span>
              </span>
              <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => {
              if (org.id === current.id) return;
              switchOrganization(org.id);
              toast.success(`Switched to ${org.name}`, {
                description: "Demo workspaces share the same sample data.",
              });
            }}
          >
            <span className={cn("grid size-5 place-items-center rounded text-[9px] font-semibold", org.color)}>
              {org.initials}
            </span>
            <span className="flex-1 truncate">{org.id === current.id ? current.name : org.name}</span>
            {org.id === current.id && <Check className="size-4 text-primary" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings aria-hidden="true" /> Workspace settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AccountMenu({ collapsed }: { collapsed: boolean }) {
  const user = useCurrentUser();
  const org = useOrganization();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-sidebar-accent",
            collapsed && "justify-center",
          )}
          aria-label={`Account menu for ${user.name}`}
        >
          <UserAvatar initials={user.initials} colorClassName={user.avatarColor} size="sm" presence={user.availability} />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-medium">{user.name}</span>
                  <StatusBadge tone="primary" className="h-4 px-1.5 text-[10px]">
                    {PLAN_LABEL[org.plan]}
                  </StatusBadge>
                </span>
                <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
              </span>
              <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side={collapsed ? "right" : "top"} className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings aria-hidden="true" /> Account & settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=subscription">
            <Sparkles aria-hidden="true" /> {PLAN_LABEL[org.plan]} plan · Manage
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          {isDark ? "Light theme" : "Dark theme"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/#faq">
            <CircleHelp aria-hidden="true" /> Help & FAQ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => {
            mockSignOut();
            toast("Signed out of the demo session");
            router.push("/login");
          }}
        >
          <LogOut aria-hidden="true" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Desktop sidebar with collapse toggle. */
export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:block",
        collapsed ? "w-[60px]" : "w-60",
      )}
    >
      <SidebarContent collapsed={collapsed} onToggleCollapsed={() => setSidebarCollapsed(!collapsed)} />
    </aside>
  );
}
