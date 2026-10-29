import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DARK_BUTTON, GLOW_BUTTON } from "./cta-styles";
import { DashboardPreview } from "./dashboard-preview";

const COLS = 12;
const ROWS = 7;
/** Grid cells (col, row, delay) that glow softly behind the headline. */
const LIT_TILES: [number, number, number][] = [
  [1, 0, 0], [10, 0, 2.5], [3, 1, 4], [7, 1, 1], [0, 2, 3], [5, 2, 5.5],
  [11, 2, 0.5], [2, 3, 2], [8, 3, 3.5], [10, 4, 6], [1, 5, 1.5], [6, 5, 4.5],
];

function TileGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[980px] overflow-hidden">
      <div
        className="absolute top-0 left-1/2 grid -translate-x-1/2 [mask-image:radial-gradient(ellipse_60%_65%_at_50%_35%,black_35%,transparent_100%)]"
        style={{ gridTemplateColumns: `repeat(${COLS}, 140px)`, gridTemplateRows: `repeat(${ROWS}, 140px)` }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const lit = LIT_TILES.find(([c, r]) => c === col && r === row);
          return (
            <div key={i} className="relative border-r border-b border-white/[0.045]">
              {lit && (
                <div
                  className="absolute inset-0 animate-tile-pulse bg-[linear-gradient(135deg,rgba(124,58,237,0.22),rgba(124,58,237,0.06))]"
                  style={{ animationDelay: `${lit[2]}s` }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Violet glow rising from below the fold. */}
      <div className="absolute -bottom-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.35),transparent)] blur-2xl" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative -mt-24 overflow-hidden pt-24">
      <TileGrid />
      <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href="/#features"
            className="group mx-auto mb-8 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] p-1 pr-3.5 text-sm text-white/85 backdrop-blur transition-colors hover:border-white/25 hover:bg-white/[0.06]"
          >
            <span className="rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 font-medium text-white">New</span>
            AI product recommendations
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>

          <h1 className="font-display text-[2.6rem] leading-[1.08] font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-[4.5rem]">
            Sell more on <span className="text-sky-400">Facebook</span>,{" "}
            <span className="text-pink-400">Instagram</span> &amp; <span className="text-green-400">WhatsApp</span> with AI
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-white/70 sm:text-xl">
            Turn every customer conversation into an opportunity. QChat answers product questions, shares prices and
            delivery details, and hands off to your team when it matters.
          </p>

          <div className="mx-auto mt-10 flex max-w-sm flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row">
            <Button size="lg" className={cn("h-12 w-full rounded-xl px-6 text-base sm:w-auto", DARK_BUTTON)} asChild>
              <Link href="/dashboard">
                <PlayCircle className="size-5" aria-hidden="true" /> Explore live demo
              </Link>
            </Button>
            <Button size="lg" className={cn("h-12 w-full rounded-xl px-6 text-base sm:w-auto", GLOW_BUTTON)} asChild>
              <Link href="/signup">
                Get started free <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/45">No credit card needed · The demo runs on sample data</p>
        </div>

        <div className="relative mx-auto mt-20 max-w-6xl">
          <div
            aria-hidden="true"
            className="absolute -inset-x-10 -top-10 bottom-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.28),transparent)] blur-3xl"
          />
          <div className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-2 shadow-[0_0_80px_-20px_rgba(124,58,237,0.5)] backdrop-blur sm:p-3">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
