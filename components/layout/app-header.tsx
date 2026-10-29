"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Bell, ChevronRight, CircleHelp, FlaskConical, Keyboard, Menu, Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { markAllNotificationsRead, markNotificationRead, useAppStore } from "@/lib/store/app-store";
import { useOrganization } from "@/lib/store/hooks";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-palette";
import { findNavItem } from "./nav-config";

export function AppHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const item = findNavItem(pathname);
  const org = useOrganization();
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur supports-backdrop-filter:bg-background/70 sm:px-4">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobileNav} aria-label="Open navigation">
        <Menu />
      </Button>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <nav aria-label="Breadcrumb" className="hidden sm:block">
          <ol className="flex items-center gap-1 text-xs text-muted-foreground">
            <li className="truncate">{org.name}</li>
            <li aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="truncate">{item?.title ?? "Dashboard"}</li>
          </ol>
        </nav>
        <h1 className="truncate text-[15px] leading-tight font-semibold">{item?.title ?? "Dashboard"}</h1>
      </div>

      <Button
        variant="outline"
        className="hidden h-8 w-56 justify-start gap-2 text-muted-foreground md:flex"
        onClick={() => setPaletteOpen(true)}
      >
        <Search aria-hidden="true" />
        <span className="flex-1 text-left text-[13px] font-normal">Search…</span>
        <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px]">Ctrl K</kbd>
      </Button>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setPaletteOpen(true)} aria-label="Search">
        <Search />
      </Button>

      <ThemeToggle />
      <HelpMenu />
      <NotificationsMenu />

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}

const SHORTCUTS = [
  ["Ctrl / ⌘ K", "Open search"],
  ["Enter", "Send message in inbox"],
  ["Shift + Enter", "New line in composer"],
  ["Esc", "Close dialogs and drawers"],
] as const;

function HelpMenu() {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Help">
              <CircleHelp />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Help</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b p-3">
          <p className="text-sm font-medium">Help & shortcuts</p>
          <p className="text-xs text-muted-foreground">Quick reference for this workspace.</p>
        </div>
        <div className="space-y-2 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Keyboard className="size-3.5" aria-hidden="true" /> Keyboard shortcuts
          </p>
          <dl className="space-y-1.5">
            {SHORTCUTS.map(([keys, label]) => (
              <div key={keys} className="flex items-center justify-between text-sm">
                <dt>{label}</dt>
                <dd>
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px]">{keys}</kbd>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="space-y-1.5 border-t bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5 font-medium text-foreground">
            <FlaskConical className="size-3.5" aria-hidden="true" /> Demo environment
          </p>
          <p>
            This is a frontend prototype. Conversations, AI replies, integrations, and sign-in are simulated with sample
            data — nothing is sent to real customers or services.
          </p>
          <Link href="/#faq" className="inline-block font-medium text-primary hover:underline">
            Read the FAQ
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationsMenu() {
  const notifications = useAppStore((s) => s.notifications);
  const router = useRouter();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unread} unread`}>
          <Bell />
          {unread > 0 && (
            <span className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] leading-4 font-semibold text-primary-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <DropdownMenuLabel className="p-0 text-sm">Notifications</DropdownMenuLabel>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline disabled:pointer-events-none disabled:opacity-50"
            onClick={markAllNotificationsRead}
            disabled={unread === 0}
          >
            Mark all as read
          </button>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-80 overflow-y-auto p-1">
          {notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="items-start gap-2.5 px-2 py-2"
              onSelect={() => {
                markNotificationRead(n.id);
                router.push(n.href);
              }}
            >
              <span
                className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className={cn("block text-[13px]", !n.read && "font-medium")}>{n.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{n.body}</span>
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">{formatRelative(n.createdAt)}</span>
              {!n.read && <span className="sr-only">Unread</span>}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
