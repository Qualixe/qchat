import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChannelIcon } from "@/components/shared/brand-icons";
import type { ChannelId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./cta-styles";
import { DashboardPreview } from "./dashboard-preview";
import { HeroChatDemo } from "./hero-chat-demo";

const WORKS_WITH: { channel: ChannelId; label: string }[] = [
  { channel: "messenger", label: "Messenger" },
  { channel: "instagram", label: "Instagram" },
  { channel: "whatsapp", label: "WhatsApp" },
  { channel: "webchat", label: "Web chat" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Dot matrix + soft aurora. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 right-[-10%] h-[600px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.28),transparent)] blur-2xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-24 lg:pb-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
            <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(103,232,249,0.6)]" />
            Now replying in Bangla, English &amp; Banglish
          </p>

          <h1 className="mt-6 font-display text-[2.75rem] leading-[1.02] font-bold tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.25rem]">
            Every DM{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">answered.</span>
            <br />
            Every sale closed.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            QChat brings Messenger, Instagram, and WhatsApp into one inbox — and an AI assistant that knows your
            products, prices, and delivery rules replies in seconds, then hands tricky chats to your team.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className={cn("h-12 rounded-xl px-6 text-[15px]", PRIMARY_BUTTON)} asChild>
              <Link href="/signup">
                Start free <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button size="lg" className={cn("h-12 rounded-xl px-6 text-[15px]", SECONDARY_BUTTON)} asChild>
              <Link href="/dashboard">
                <LayoutDashboard /> Try the live demo
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.07] pt-6">
            <span className="text-xs tracking-wide text-white/40 uppercase">Works with</span>
            {WORKS_WITH.map((item) => (
              <span key={item.channel} className="flex items-center gap-1.5 text-sm text-white/70">
                <ChannelIcon channel={item.channel} className="size-4" /> {item.label}
              </span>
            ))}
          </div>
        </div>

        <HeroChatDemo />
      </div>
    </section>
  );
}

/** Full workspace preview, presented as its own section below the hero. */
export function ProductShowcase() {
  return (
    <section className="relative px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            One workspace for every conversation
          </h2>
          <p className="max-w-md text-white/60">
            Conversations, customer details, and orders side by side — so your team never has to switch tabs.
          </p>
        </div>
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-px">
          <div className="rounded-[23px] bg-[oklch(0.17_0.02_262)] p-2 sm:p-3">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
