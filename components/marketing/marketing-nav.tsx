"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./cta-styles";

const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#integrations", label: "Integrations" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[oklch(0.145_0.02_262)]/80 backdrop-blur-xl">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6">
        <Link href="/" aria-label="QChat home" className="rounded-md">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto hidden items-center gap-5 lg:flex">
          <Link href="/login" className="text-sm text-white/70 transition-colors hover:text-white">
            Log in
          </Link>
          <Button className={cn("h-9 rounded-lg px-4", PRIMARY_BUTTON)} asChild>
            <Link href="/signup">
              Start free <ArrowRight data-icon="inline-end" />
            </Link>
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
      <div id="mobile-menu" className={cn("border-t border-white/[0.07] px-4 pb-4 lg:hidden", !open && "hidden")}>
        <ul className="py-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-2">
          <Button className={cn("h-10 rounded-lg", SECONDARY_BUTTON)} asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className={cn("h-10 rounded-lg", PRIMARY_BUTTON)} asChild>
            <Link href="/signup">Start free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
