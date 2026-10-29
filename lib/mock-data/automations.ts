import type {
  Automation,
  AutomationActionType,
  AutomationTrigger,
  ConditionField,
  ConditionOperator,
} from "@/lib/types";
import { daysAgo, hoursAgo } from "./clock";

export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  new_conversation: "New conversation started",
  keyword_match: "Message contains keyword",
  topic_detected: "Topic detected",
  negative_sentiment: "Negative sentiment detected",
  no_reply_timeout: "No reply within time limit",
};

export const ACTION_LABELS: Record<AutomationActionType, string> = {
  send_message: "Send a message",
  ai_reply: "Reply with AI assistant",
  recommend_products: "Recommend products",
  assign_teammate: "Assign to teammate",
  notify_teammate: "Notify teammate",
  add_tag: "Add contact tag",
};

export const CONDITION_FIELD_LABELS: Record<ConditionField, string> = {
  channel: "Channel",
  message_text: "Message text",
  contact_tag: "Contact tag",
  business_hours: "Business hours",
};

export const CONDITION_OPERATOR_LABELS: Record<ConditionOperator, string> = {
  is: "is",
  is_not: "is not",
  contains: "contains",
};

export const automations: Automation[] = [
  {
    id: "au_welcome",
    name: "Welcome new customers",
    description: "Greets first-time customers and shares this week's highlights.",
    trigger: "new_conversation",
    conditions: [{ id: "c1", field: "contact_tag", operator: "is_not", value: "Repeat buyer" }],
    action: "send_message",
    responseTemplate:
      "Hi {{first_name}}! 👋 Welcome to Nokshi Lifestyle. Ask me anything about sizes, prices, or delivery — I'm here to help.",
    active: true,
    runs: 1284,
    updatedAt: daysAgo(2),
  },
  {
    id: "au_delivery",
    name: "Answer delivery questions",
    description: "Lets the AI assistant answer delivery charge and timeline questions.",
    trigger: "topic_detected",
    triggerValue: "delivery",
    conditions: [],
    action: "ai_reply",
    active: true,
    runs: 862,
    updatedAt: hoursAgo(20),
  },
  {
    id: "au_recommend",
    name: "Recommend products",
    description: "Suggests related items when a customer asks about a specific product.",
    trigger: "keyword_match",
    triggerValue: "available, stock, ache",
    conditions: [{ id: "c1", field: "channel", operator: "is", value: "instagram" }],
    action: "recommend_products",
    responseTemplate: "You might also love these — {{related_products}}",
    active: true,
    runs: 419,
    updatedAt: daysAgo(5),
  },
  {
    id: "au_escalate",
    name: "Escalate complaints",
    description: "Hands conversations with negative sentiment to a senior teammate.",
    trigger: "negative_sentiment",
    conditions: [],
    action: "assign_teammate",
    actionTarget: "tm_tanvir",
    active: true,
    runs: 57,
    updatedAt: daysAgo(9),
  },
  {
    id: "au_unanswered",
    name: "Notify about unanswered conversations",
    description: "Pings the on-call teammate if a customer waits more than 15 minutes.",
    trigger: "no_reply_timeout",
    triggerValue: "15",
    conditions: [{ id: "c1", field: "business_hours", operator: "is", value: "open" }],
    action: "notify_teammate",
    actionTarget: "tm_farhana",
    active: false,
    runs: 112,
    updatedAt: daysAgo(14),
  },
  {
    id: "au_vip_tag",
    name: "Tag wholesale enquiries",
    description: "Adds the Wholesale tag when customers ask about bulk pricing.",
    trigger: "keyword_match",
    triggerValue: "wholesale, bulk, paikari",
    conditions: [],
    action: "add_tag",
    actionTarget: "Wholesale",
    active: false,
    runs: 23,
    updatedAt: daysAgo(21),
  },
];
