import type { AiAssistantConfig, WorkspaceSettings } from "@/lib/types";

export const defaultAiConfig: AiAssistantConfig = {
  name: "Nokshi Assistant",
  enabled: true,
  language: "auto",
  voice: "friendly",
  responseLength: "balanced",
  instructions:
    "Always greet customers warmly. Reply in the customer's language (Bangla, English, or Banglish). Never promise delivery dates the courier hasn't confirmed. Offer free delivery for VIP customers inside Dhaka.",
  businessInfo:
    "Nokshi Lifestyle is a Dhaka-based clothing, beauty, and lifestyle brand. Open 10am–9pm every day except Friday morning. Payment: bKash, Nagad, card, or cash on delivery.",
  faqs: [
    {
      id: "faq_1",
      question: "What is the delivery charge?",
      answer: "৳60 inside Dhaka, ৳120 outside Dhaka. Free delivery on orders above ৳5,000.",
    },
    {
      id: "faq_2",
      question: "How long does delivery take?",
      answer: "1–2 days inside Dhaka and 2–4 working days elsewhere in Bangladesh.",
    },
    {
      id: "faq_3",
      question: "Can I exchange a product?",
      answer: "Yes, within 7 days of delivery if the tags are intact and the item is unused.",
    },
  ],
  productKnowledge: {
    useCatalog: true,
    shareStockLevels: true,
    sharePrices: true,
    recommendSimilar: true,
  },
  handoff: {
    onComplaint: true,
    onRefundRequest: true,
    onLowConfidence: true,
    confidenceThreshold: 70,
    handoffMessage: "I'm connecting you with a teammate who can help with this right away.",
  },
};

export const defaultSettings: WorkspaceSettings = {
  general: {
    workspaceName: "Nokshi Lifestyle",
    logoDataUrl: null,
    timezone: "Asia/Dhaka",
    defaultLanguage: "auto",
  },
  business: {
    businessName: "Nokshi Lifestyle",
    description: "Handcrafted clothing, beauty, and lifestyle products made in Bangladesh.",
    website: "https://nokshi.example",
    email: "hello@nokshi.example",
    phone: "+880 1700-000000",
    address: "House 21, Road 5, Dhanmondi, Dhaka 1205",
    deliveryPolicy:
      "Inside Dhaka: ৳60, 1–2 days. Outside Dhaka: ৳120, 2–4 working days. Free delivery above ৳5,000.",
    returnPolicy:
      "Exchanges and returns accepted within 7 days of delivery for unused items with tags attached.",
  },
  notifications: {
    desktop: true,
    email: true,
    emailDigest: "daily",
    unansweredAlerts: true,
    unansweredAfterMinutes: 15,
  },
  appearance: {
    sidebarCollapsed: false,
    compactInbox: false,
  },
  security: {
    twoFactorPreview: false,
    sessionTimeoutMinutes: 60,
  },
};

/** Mock AI usage for the current billing cycle. */
export const aiUsage = {
  used: 3420,
  limit: 5000,
  resetsOn: "2026-11-01T00:00:00.000Z",
};

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 1900,
    description: "For new shops getting their first channels organised.",
    aiReplies: 1000,
    seats: 2,
    features: ["2 messaging channels", "1,000 AI replies / month", "Basic analytics", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 4900,
    description: "For growing brands that want AI to handle routine questions.",
    aiReplies: 5000,
    seats: 6,
    features: [
      "All messaging channels",
      "5,000 AI replies / month",
      "Automations",
      "Shopify & WooCommerce sync",
      "Priority support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: 12900,
    description: "For high-volume teams with multiple brands and advanced needs.",
    aiReplies: 20000,
    seats: 20,
    features: [
      "Everything in Growth",
      "20,000 AI replies / month",
      "Multiple workspaces",
      "Advanced analytics",
      "Dedicated onboarding",
    ],
  },
] as const;
