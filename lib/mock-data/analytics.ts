import type { ActivityEvent, ChannelId, ConversationTopic, DailyMetrics } from "@/lib/types";
import { daysAgo, hoursAgo, minutesAgo } from "./clock";

/** Small deterministic PRNG so the generated series is stable between renders. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CHANNEL_SHARE: Record<ChannelId, number> = {
  messenger: 0.4,
  whatsapp: 0.28,
  instagram: 0.25,
  webchat: 0.07,
};

/** Relative traffic by hour of day (Dhaka time), peaking in the evening. */
const HOURLY_SHAPE = [
  0.15, 0.08, 0.05, 0.03, 0.03, 0.05, 0.12, 0.25, 0.4, 0.55, 0.7, 0.8, 0.85, 0.8, 0.75, 0.8, 0.9, 1,
  1, 0.95, 1, 0.95, 0.7, 0.4,
];

export const ANALYTICS_HISTORY_DAYS = 60;

function buildDailyMetrics(): DailyMetrics[] {
  const rand = mulberry32(20261029);
  const days: DailyMetrics[] = [];
  for (let i = ANALYTICS_HISTORY_DAYS - 1; i >= 0; i--) {
    const date = daysAgo(i);
    const weekday = new Date(Date.parse(date) + 6 * 3_600_000).getUTCDay();
    const weekly = weekday === 5 ? 0.72 : weekday === 6 ? 1.12 : 1;
    // Gentle upward trend across the period.
    const trend = 1 + (ANALYTICS_HISTORY_DAYS - i) * 0.006;
    const conversations = Math.round(150 * weekly * trend * (0.88 + rand() * 0.24));
    const resolved = Math.round(conversations * (0.86 + rand() * 0.08));
    const aiResolved = Math.round(resolved * (0.58 + rand() * 0.1 + (ANALYTICS_HISTORY_DAYS - i) * 0.001));
    const humanHandled = conversations - aiResolved;
    const handoffs = Math.round(conversations * (0.14 + rand() * 0.06));

    const byChannel = {} as Record<ChannelId, number>;
    let assigned = 0;
    const channels = Object.keys(CHANNEL_SHARE) as ChannelId[];
    channels.forEach((channel, idx) => {
      if (idx === channels.length - 1) {
        byChannel[channel] = conversations - assigned;
      } else {
        const value = Math.round(conversations * CHANNEL_SHARE[channel] * (0.9 + rand() * 0.2));
        byChannel[channel] = value;
        assigned += value;
      }
    });

    const shapeTotal = HOURLY_SHAPE.reduce((a, b) => a + b, 0);
    const byHour = HOURLY_SHAPE.map((w) => Math.round((conversations * w * (0.85 + rand() * 0.3)) / shapeTotal));

    days.push({
      date,
      conversations,
      resolved,
      aiResolved,
      humanHandled,
      handoffs,
      avgFirstResponseSec: Math.round(38 + rand() * 40 - (ANALYTICS_HISTORY_DAYS - i) * 0.25),
      aiMessages: Math.round(aiResolved * (2.4 + rand() * 0.6)),
      byChannel,
      byHour,
    });
  }
  return days;
}

export const dailyMetrics: DailyMetrics[] = buildDailyMetrics();

export const TOPIC_LABELS: Record<ConversationTopic, string> = {
  pricing: "Pricing",
  delivery: "Delivery",
  availability: "Product availability",
  order_tracking: "Order tracking",
  refund: "Refunds & returns",
  complaint: "Complaints",
  product_question: "Product questions",
};

/** Share of conversations by topic over the analytics period. */
export const TOPIC_SHARE: Record<ConversationTopic, number> = {
  delivery: 0.24,
  pricing: 0.2,
  availability: 0.18,
  order_tracking: 0.15,
  product_question: 0.12,
  refund: 0.06,
  complaint: 0.05,
};

export const activityFeed: ActivityEvent[] = [
  { id: "ac_1", kind: "order", text: "Ayesha Siddiqua placed order #NK-1048 via Messenger", createdAt: hoursAgo(3) },
  { id: "ac_2", kind: "handoff", text: "AI handed off Rahim Uddin to Farhana Akter", createdAt: minutesAgo(94) },
  { id: "ac_3", kind: "resolved", text: "Sadia Islam resolved a pricing question from Tahmid Hossain", createdAt: minutesAgo(118) },
  { id: "ac_4", kind: "automation", text: "“Answer delivery questions” ran 38 times today", createdAt: minutesAgo(140) },
  { id: "ac_5", kind: "assigned", text: "Complaint from Arif Mahmud assigned to Imran Chowdhury", createdAt: minutesAgo(329) },
  { id: "ac_6", kind: "integration", text: "Shopify catalog sync completed — 14 products updated", createdAt: hoursAgo(7) },
  { id: "ac_7", kind: "order", text: "Nusrat Jahan placed wholesale order #NK-1046", createdAt: daysAgo(1, 60) },
];
