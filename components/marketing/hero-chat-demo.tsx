"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, Zap } from "lucide-react";
import { ChannelIcon } from "@/components/shared/brand-icons";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { ChannelId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Scripted, looping sample conversation. Steps reveal one element each. */
const STEP_DELAYS = [900, 1600, 2200, 1500, 1200, 4200];
const FINAL_STEP = STEP_DELAYS.length - 1;
const CHANNELS: ChannelId[] = ["messenger", "instagram", "whatsapp"];

export function HeroChatDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const t = setTimeout(() => setStep(FINAL_STEP), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => (s >= FINAL_STEP ? 0 : s + 1)), STEP_DELAYS[step]);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[40px] bg-[conic-gradient(from_200deg_at_60%_40%,rgba(99,102,241,0.35),rgba(34,211,238,0.25),transparent_60%)] blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.19_0.022_262)]/90 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
          <UserAvatar initials="NJ" colorClassName="bg-amber-500/20 text-amber-300" presence="online" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">Nusrat J.</p>
            <p className="text-xs text-white/50">Customer · Dhaka</p>
          </div>
          <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            {CHANNELS.map((c) => (
              <span
                key={c}
                className={cn("grid size-7 place-items-center rounded-full", c === "whatsapp" && "bg-white/10")}
              >
                <ChannelIcon channel={c} className="size-3.5" />
              </span>
            ))}
          </div>
        </div>

        <div className="min-h-[340px] space-y-3 px-5 py-5 text-[13.5px] leading-relaxed">
          <Bubble show={step >= 0} side="left">
            Apu, ei kurti ta M size e ache? Dam koto?
          </Bubble>

          {step === 1 && <Typing />}

          <Bubble show={step >= 2} side="right" ai>
            Ji ache! Indigo Block-Print Kurti — ৳1,850 (৳2,200 theke chhar). Dhaka te delivery ৳60, kal-i pouchhe
            jabe. Order confirm korbo?
          </Bubble>

          <Bubble show={step >= 3} side="left">
            Haan, 2 ta pathan please 🙏
          </Bubble>

          <div
            className={cn(
              "flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-3.5 py-2.5 transition-all duration-500",
              step >= 4 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            <span className="text-white/90">
              Order <span className="font-medium text-white">#NK-1049</span> created · 2 items · ৳3,760
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3 text-xs text-white/45">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-cyan-300" /> Replied in Banglish, automatically
          </span>
          <span>Sample conversation</span>
        </div>
      </div>

      <div
        className={cn(
          "absolute -top-5 -right-3 hidden items-center gap-2 rounded-xl border border-white/10 bg-[oklch(0.22_0.025_262)] px-3 py-2 text-xs text-white shadow-xl transition-all duration-500 sm:flex",
          step >= 2 ? "opacity-100" : "opacity-0",
        )}
      >
        <Zap className="size-3.5 text-amber-300" /> Answered in 4 seconds
      </div>
    </div>
  );
}

function Bubble({ show, side, ai, children }: { show: boolean; side: "left" | "right"; ai?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex transition-all duration-500",
        side === "right" ? "justify-end" : "justify-start",
        show ? "translate-y-0 opacity-100" : "pointer-events-none h-0 translate-y-2 overflow-hidden opacity-0",
      )}
    >
      <p
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5",
          side === "left" && "rounded-bl-md bg-white/[0.07] text-white/90",
          ai && "rounded-br-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white",
        )}
      >
        {ai && (
          <span className="mb-1 flex items-center gap-1 text-[11px] font-medium text-indigo-100/80">
            <Sparkles className="size-3" /> QChat AI
          </span>
        )}
        {children}
      </p>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex justify-end">
      <div className="flex gap-1 rounded-2xl rounded-br-md bg-indigo-500/30 px-3.5 py-3">
        {[0, 150, 300].map((d) => (
          <span key={d} className="size-1.5 animate-bounce rounded-full bg-indigo-100/80" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  );
}
