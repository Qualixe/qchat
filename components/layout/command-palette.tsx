"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Package, Plus, Sun, UserRound } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useAppStore } from "@/lib/store/app-store";
import { NAV_ITEMS } from "./nav-config";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const contacts = useAppStore((s) => s.contacts);
  const products = useAppStore((s) => s.products);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  function run(action: () => void) {
    onOpenChange(false);
    action();
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search" description="Jump to pages, contacts, and products">
      <Command>
        <CommandInput placeholder="Search pages, contacts, products…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {NAV_ITEMS.map((item) => (
              <CommandItem key={item.href} value={`page ${item.title}`} onSelect={() => run(() => router.push(item.href))}>
                <item.icon aria-hidden="true" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick actions">
            <CommandItem value="action add contact" onSelect={() => run(() => router.push("/contacts?new=1"))}>
              <Plus aria-hidden="true" /> Add contact
            </CommandItem>
            <CommandItem value="action add product" onSelect={() => run(() => router.push("/products?new=1"))}>
              <Plus aria-hidden="true" /> Add product
            </CommandItem>
            <CommandItem
              value="action toggle theme dark light"
              onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
            >
              {resolvedTheme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
              Toggle theme
              <CommandShortcut>Theme</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Contacts">
            {contacts.slice(0, 8).map((contact) => (
              <CommandItem
                key={contact.id}
                value={`contact ${contact.name} ${contact.email}`}
                onSelect={() => run(() => router.push(`/contacts?q=${encodeURIComponent(contact.name)}`))}
              >
                <UserRound aria-hidden="true" />
                {contact.name}
                <span className="ml-auto truncate text-xs text-muted-foreground">{contact.email}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Products">
            {products.slice(0, 8).map((product) => (
              <CommandItem
                key={product.id}
                value={`product ${product.name} ${product.sku}`}
                onSelect={() => run(() => router.push(`/products?q=${encodeURIComponent(product.name)}`))}
              >
                <Package aria-hidden="true" />
                {product.name}
                <span className="ml-auto text-xs text-muted-foreground">{product.sku}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
