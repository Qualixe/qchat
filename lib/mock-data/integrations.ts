import type { Integration } from "@/lib/types";
import { daysAgo } from "./clock";

export const integrations: Integration[] = [
  {
    id: "messenger",
    name: "Facebook Messenger",
    category: "messaging",
    description: "Reply to Facebook Page messages from the unified inbox.",
    status: "connected",
    accountLabel: "Nokshi Lifestyle (Page)",
    connectedAt: daysAgo(210),
    settings: { syncEnabled: true, autoReply: true, notifyOnNew: true },
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "messaging",
    description: "Handle Instagram DMs and story replies alongside other channels.",
    status: "connected",
    accountLabel: "@nokshi.lifestyle",
    connectedAt: daysAgo(180),
    settings: { syncEnabled: true, autoReply: true, notifyOnNew: false },
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "messaging",
    description: "Answer WhatsApp Business conversations with AI and your team.",
    status: "connected",
    accountLabel: "+880 1700-000000",
    connectedAt: daysAgo(95),
    settings: { syncEnabled: true, autoReply: false, notifyOnNew: true },
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "commerce",
    description: "Sync products, inventory, and orders so the AI can answer accurately.",
    status: "connected",
    accountLabel: "nokshi-lifestyle.myshopify.com",
    connectedAt: daysAgo(200),
    settings: { syncEnabled: true, autoReply: false, notifyOnNew: false },
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    category: "commerce",
    description: "Bring your WordPress store's catalog and orders into QChat.",
    status: "disconnected",
    settings: { syncEnabled: true, autoReply: false, notifyOnNew: false },
  },
];
