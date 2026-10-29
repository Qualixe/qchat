import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";

/**
 * The public site is always dark, independent of the app theme: the `dark`
 * class scopes the dark design tokens to this subtree.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark flex min-h-dvh flex-col overflow-x-clip bg-[oklch(0.13_0.012_285)] text-foreground [--background:oklch(0.13_0.012_285)] [--card:oklch(0.17_0.014_285)] [color-scheme:dark]">
      <a
        href="#content"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <MarketingNav />
      <main id="content" className="flex-1">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
