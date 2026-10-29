"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { DARK_BUTTON, GLOW_BUTTON } from "./cta-styles";

const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#integrations", label: "Integrations" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

/** Floating, pill-shaped navigation bar. */
export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center gap-4 rounded-2xl border border-white/10 bg-[oklch(0.15_0.012_285)]/75 px-3 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:h-16 sm:px-4"
      >
        <Link href="/" aria-label="QChat home" className="rounded-md">
          <Logo />
        </Link>
        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-[15px] text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto hidden items-center gap-2 lg:ml-0 lg:flex">
          <Button variant="ghost" className="h-10 px-4 text-[15px] text-white/80 hover:bg-white/5 hover:text-white" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className={cn("h-10 rounded-xl px-5 text-[15px]", GLOW_BUTTON)} asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-white hover:bg-white/10 hover:text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </nav>
      <div
        id="mobile-menu"
        className={cn(
          "mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-[oklch(0.15_0.012_285)]/95 p-3 backdrop-blur-xl lg:hidden",
          !open && "hidden",
        )}
      >
        <ul className="space-y-1">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button className={cn("h-10 rounded-xl", DARK_BUTTON)} asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className={cn("h-10 rounded-xl", GLOW_BUTTON)} asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
