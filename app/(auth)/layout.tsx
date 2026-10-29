import Link from "next/link";
import { Check } from "lucide-react";
import { Logo } from "@/components/shared/logo";

const POINTS = [
  "Messenger, Instagram, and WhatsApp in one inbox",
  "AI replies in Bangla, English, and Banglish",
  "Automations, analytics, and your product catalog",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-8">
        <Link href="/" className="w-fit rounded-md" aria-label="QChat home">
          <Logo />
        </Link>
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
        <p className="text-center text-xs text-muted-foreground">
          Demo authentication — no real accounts are created or verified.
        </p>
      </div>
      <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-10 [--border:white]" />
        <div className="relative max-w-md space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Every customer conversation, answered with care.
          </h2>
          <ul className="space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-primary-foreground/85">
                <Check className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
