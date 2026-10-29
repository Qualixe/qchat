import { BarChart3, Bot, Check, Inbox, Workflow, type LucideIcon } from "lucide-react";
import { ChannelIcon } from "@/components/shared/brand-icons";
import { StatusBadge } from "@/components/shared/status-badge";
import { BarList } from "@/components/charts/bar-list";
import { CHANNEL_COLOR } from "@/components/charts/analytics-filters";
import type { ChannelId } from "@/lib/types";

interface Feature {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  visual: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    icon: Inbox,
    eyebrow: "Unified inbox",
    title: "Every channel, one calm inbox",
    description: "Messenger, Instagram, WhatsApp, and web chat in a single queue your whole team can work from.",
    points: ["Assign, resolve, and reopen conversations", "Internal notes your customers never see", "Customer profile and orders beside every chat"],
    visual: <InboxVisual />,
  },
  {
    icon: Bot,
    eyebrow: "AI sales assistant",
    title: "Answers product questions in your brand voice",
    description: "The assistant learns your catalog, policies, and FAQs, then replies in the customer's own language.",
    points: ["Bangla, English, and Banglish replies", "Hands off complaints and refunds to your team", "Suggested replies you can edit before sending"],
    visual: <AiVisual />,
  },
  {
    icon: Workflow,
    eyebrow: "Automation",
    title: "Put repetitive replies on autopilot",
    description: "Build simple when–then rules for greetings, delivery questions, escalations, and follow-ups.",
    points: ["Triggers for keywords, topics, and wait times", "Route urgent conversations to the right person", "Turn rules on and off any time"],
    visual: <AutomationVisual />,
  },
  {
    icon: BarChart3,
    eyebrow: "Analytics",
    title: "See what customers ask — and how fast you answer",
    description: "Track volume, resolution, response time, and which channels and topics drive conversations.",
    points: ["Channel and topic breakdowns", "AI vs. human resolution trends", "Busiest hours to plan staffing"],
    visual: <AnalyticsVisual />,
  },
];

export function FeatureSections() {
  return (
    <section id="features" className="scroll-mt-20 border-t bg-muted/20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-cyan-300">Features</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything your team needs to sell through chat
          </h2>
        </div>
        <div className="mt-16 space-y-20">
          {FEATURES.map((feature, index) => (
            <article key={feature.eyebrow} className="grid items-center gap-10 lg:grid-cols-2">
              <div className={index % 2 ? "lg:order-2" : undefined}>
                <p className="flex items-center gap-2 text-sm font-medium text-cyan-300">
                  <feature.icon className="size-4" aria-hidden="true" /> {feature.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground">{feature.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {feature.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6" aria-hidden="true">
                {feature.visual}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InboxVisual() {
  const rows: { channel: ChannelId; name: string; text: string; status: "Open" | "Resolved" }[] = [
    { channel: "messenger", name: "Customer on Messenger", text: "Is this available in size M?", status: "Open" },
    { channel: "whatsapp", name: "Customer on WhatsApp", text: "Amar order kobe pabo?", status: "Open" },
    { channel: "instagram", name: "Customer on Instagram", text: "Gift wrap kora jabe?", status: "Resolved" },
  ];
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.name} className="flex items-center gap-3 rounded-lg border p-3">
          <ChannelIcon channel={row.channel} className="size-5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{row.name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.text}</p>
          </div>
          <StatusBadge tone={row.status === "Open" ? "primary" : "success"} dot>
            {row.status}
          </StatusBadge>
        </li>
      ))}
    </ul>
  );
}

function AiVisual() {
  return (
    <div className="space-y-3 text-sm">
      <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-primary-foreground">
        Delivery charge koto?
      </p>
      <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md border border-primary/15 bg-accent px-3.5 py-2 text-accent-foreground">
        <span className="mb-0.5 block text-[11px] font-medium">AI reply · Banglish</span>
        Dhaka r moddhe ৳60, baire ৳120. ৳5,000 er upore order hole delivery free! 🚚
      </p>
      <p className="text-center text-xs text-muted-foreground">Example response — your assistant uses your own policies.</p>
    </div>
  );
}

function AutomationVisual() {
  const steps = [
    { label: "When", value: "Message mentions “refund”" },
    { label: "If", value: "Channel is WhatsApp" },
    { label: "Then", value: "Assign to Operations lead" },
  ];
  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-3 rounded-lg border p-3">
          <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground">{i + 1}</span>
          <span className="w-12 text-xs font-medium text-muted-foreground uppercase">{step.label}</span>
          <span className="text-sm">{step.value}</span>
        </li>
      ))}
    </ol>
  );
}

function AnalyticsVisual() {
  const items = (["messenger", "whatsapp", "instagram", "webchat"] as ChannelId[]).map((c, i) => ({
    key: c,
    label: { messenger: "Messenger", whatsapp: "WhatsApp", instagram: "Instagram", webchat: "Web chat" }[c],
    value: [40, 28, 25, 7][i] ?? 0,
    icon: <ChannelIcon channel={c} />,
    color: CHANNEL_COLOR[c],
  }));
  return (
    <div>
      <p className="mb-4 text-sm font-medium">Conversations by channel <span className="text-xs font-normal text-muted-foreground">(illustrative)</span></p>
      <BarList items={items} valueFormatter={(v) => `${v}%`} />
    </div>
  );
}
