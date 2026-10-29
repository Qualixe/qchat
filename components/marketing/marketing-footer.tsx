import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#integrations", label: "Integrations" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/dashboard", label: "Live demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/#faq", label: "FAQ" },
      { href: "mailto:hello@qchat.example", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            AI-powered customer conversations for social commerce teams.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-3 text-sm font-semibold">{column.title}</h2>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © 2026 QChat. Product prototype — company and legal details are placeholders.
        </p>
      </div>
    </footer>
  );
}
