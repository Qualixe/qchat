import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import type { ChannelId, IntegrationId } from "@/lib/types";

/*
 * Simplified, generic marks for channels and integrations. They are
 * illustrative placeholders, not official logos.
 */

type IconProps = SVGProps<SVGSVGElement>;

export function MessengerMark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.14 7.17.16.15.26.35.27.57l.05 1.78a.8.8 0 0 0 1.12.71l1.98-.87a.8.8 0 0 1 .53-.04c.9.25 1.86.38 2.91.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2Z"
      />
      <path fill="var(--brand-icon-inner, white)" d="m6 14.53 2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63l-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63Z" />
    </svg>
  );
}

export function InstagramMark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppMark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.33A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .79.8-2.92-.2-.3A8.2 8.2 0 1 1 12 20.2Z"
      />
      <path
        fill="currentColor"
        d="M16.5 14.1c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.41-.56-.42h-.48a.92.92 0 0 0-.67.31 2.8 2.8 0 0 0-.87 2.08c0 1.23.9 2.42 1.02 2.58.12.17 1.76 2.69 4.27 3.77 1.59.69 2.2.75 3 .63.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.17-.48-.29Z"
      />
    </svg>
  );
}

export function ShopifyMark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M5.2 7.5h13.6l-1.1 13.1a1.5 1.5 0 0 1-1.5 1.4H7.8a1.5 1.5 0 0 1-1.5-1.4L5.2 7.5Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path fill="var(--brand-icon-inner, white)" d="M13.6 12.2c-.4-.2-.9-.3-1.4-.3-1.2 0-2 .7-2 1.6 0 1.5 2.2 1.4 2.2 2.2 0 .3-.3.6-.8.6-.6 0-1.2-.3-1.5-.5l-.4 1.1c.4.3 1.1.5 1.8.5 1.3 0 2.2-.7 2.2-1.8 0-1.6-2.2-1.6-2.2-2.2 0-.3.2-.5.7-.5.4 0 .8.1 1.1.3l.3-1Z" />
    </svg>
  );
}

export function WooMark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5l1 4-5-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path
        d="m5.5 8 1.4 5.5L8.6 9.5l1.6 4L12 8M13.5 10.8a1.5 1.8 0 1 0 3 0 1.5 1.8 0 1 0-3 0M17.5 10.8a1.3 1.6 0 1 0 2.6 0 1.3 1.6 0 1 0-2.6 0"
        fill="none"
        stroke="var(--brand-icon-inner, white)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const CHANNEL_META: Record<
  ChannelId,
  { label: string; icon: (props: IconProps) => React.ReactNode; className: string }
> = {
  messenger: { label: "Messenger", icon: MessengerMark, className: "text-[#0a7cff]" },
  instagram: { label: "Instagram", icon: InstagramMark, className: "text-[#d6246e]" },
  whatsapp: { label: "WhatsApp", icon: WhatsAppMark, className: "text-[#1a9e55]" },
  webchat: { label: "Web chat", icon: (p) => <Globe {...p} />, className: "text-muted-foreground" },
};

export function ChannelIcon({ channel, className }: { channel: ChannelId; className?: string }) {
  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;
  return <Icon className={cn("size-4 shrink-0", meta.className, className)} aria-label={meta.label} role="img" />;
}

export const INTEGRATION_META: Record<
  IntegrationId,
  { icon: (props: IconProps) => React.ReactNode; tileClassName: string }
> = {
  messenger: { icon: MessengerMark, tileClassName: "bg-[#0a7cff] text-white [--brand-icon-inner:#0a7cff]" },
  instagram: {
    icon: InstagramMark,
    tileClassName: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
  },
  whatsapp: { icon: WhatsAppMark, tileClassName: "bg-[#1a9e55] text-white" },
  shopify: { icon: ShopifyMark, tileClassName: "bg-[#5e8e3e] text-white [--brand-icon-inner:#5e8e3e]" },
  woocommerce: { icon: WooMark, tileClassName: "bg-[#7f54b3] text-white [--brand-icon-inner:#7f54b3]" },
};

export function IntegrationLogo({ id, className }: { id: IntegrationId; className?: string }) {
  const meta = INTEGRATION_META[id];
  const Icon = meta.icon;
  return (
    <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", meta.tileClassName, className)}>
      <Icon className="size-5" />
    </span>
  );
}
