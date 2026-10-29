/**
 * Domain types for QChat.
 *
 * These mirror the shape a real backend (e.g. Supabase tables) would return,
 * so mock data can later be swapped for API calls without touching the UI.
 * Timestamps are ISO-8601 strings; money is stored in whole BDT (৳).
 */

export type ID = string;
export type ISODateString = string;

/* ----------------------------------------------------------------------------
 * Organization & people
 * ------------------------------------------------------------------------- */

export type PlanId = "starter" | "growth" | "scale";

export interface Organization {
  id: ID;
  name: string;
  slug: string;
  plan: PlanId;
  timezone: string;
  defaultLanguage: Language;
  /** Two-letter mark rendered when no logo is uploaded. */
  initials: string;
  color: string;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  initials: string;
  /** Tailwind-safe avatar background used for initials avatars. */
  avatarColor: string;
}

export type TeamRole = "owner" | "admin" | "agent" | "viewer";
export type Availability = "online" | "away" | "offline";

export interface TeamMember extends User {
  role: TeamRole;
  title: string;
  availability: Availability;
  joinedAt: ISODateString;
  /** Invited members have not accepted yet. */
  invited?: boolean;
}

/* ----------------------------------------------------------------------------
 * Contacts
 * ------------------------------------------------------------------------- */

export type ChannelId = "messenger" | "instagram" | "whatsapp" | "webchat";
export type ContactStatus = "active" | "lead" | "vip" | "inactive";

export interface Contact {
  id: ID;
  name: string;
  email: string;
  phone: string;
  location: string;
  initials: string;
  avatarColor: string;
  tags: string[];
  status: ContactStatus;
  channel: ChannelId;
  lastContactedAt: ISODateString;
  totalConversations: number;
  totalOrders: number;
  lifetimeValue: number;
  notes: string;
  createdAt: ISODateString;
}

/* ----------------------------------------------------------------------------
 * Conversations
 * ------------------------------------------------------------------------- */

export type ConversationStatus = "open" | "pending" | "resolved";
export type ConversationPriority = "low" | "normal" | "high";
export type ConversationTopic =
  | "pricing"
  | "delivery"
  | "availability"
  | "order_tracking"
  | "refund"
  | "complaint"
  | "product_question";

export type MessageAuthorType = "customer" | "agent" | "ai" | "system";
export type DeliveryStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface MessageAttachment {
  name: string;
  kind: "image" | "file";
  size: string;
}

export interface Message {
  id: ID;
  conversationId: ID;
  authorType: MessageAuthorType;
  /** Team member id for agent messages. */
  authorId?: ID;
  body: string;
  createdAt: ISODateString;
  status?: DeliveryStatus;
  /** Internal notes are visible to teammates only. */
  isInternalNote?: boolean;
  attachment?: MessageAttachment;
}

export interface Conversation {
  id: ID;
  contactId: ID;
  channel: ChannelId;
  status: ConversationStatus;
  priority: ConversationPriority;
  topic: ConversationTopic;
  assigneeId: ID | null;
  unreadCount: number;
  /** True while the AI assistant is handling the thread. */
  aiHandled: boolean;
  lastMessageAt: ISODateString;
  messages: Message[];
}

/* ----------------------------------------------------------------------------
 * Commerce
 * ------------------------------------------------------------------------- */

export type ProductCategory = "Clothing" | "Beauty" | "Accessories" | "Home";
export type ProductStatus = "active" | "draft" | "archived";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: ID;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  status: ProductStatus;
  image: string;
  description: string;
  source: "shopify" | "manual";
  updatedAt: ISODateString;
}

export type PaymentStatus = "paid" | "pending" | "cod" | "refunded" | "failed";
export type FulfillmentStatus =
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface OrderItem {
  productId: ID;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: ID;
  number: string;
  contactId: ID;
  channel: ChannelId;
  createdAt: ISODateString;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress: string;
  trackingNumber?: string;
  note?: string;
}

/* ----------------------------------------------------------------------------
 * Automation
 * ------------------------------------------------------------------------- */

export type AutomationTrigger =
  | "new_conversation"
  | "keyword_match"
  | "topic_detected"
  | "negative_sentiment"
  | "no_reply_timeout";

export type AutomationActionType =
  | "send_message"
  | "ai_reply"
  | "recommend_products"
  | "assign_teammate"
  | "notify_teammate"
  | "add_tag";

export type ConditionField = "channel" | "message_text" | "contact_tag" | "business_hours";
export type ConditionOperator = "is" | "is_not" | "contains";

export interface AutomationCondition {
  id: ID;
  field: ConditionField;
  operator: ConditionOperator;
  value: string;
}

export interface Automation {
  id: ID;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  triggerValue?: string;
  conditions: AutomationCondition[];
  action: AutomationActionType;
  actionTarget?: string;
  responseTemplate?: string;
  active: boolean;
  runs: number;
  updatedAt: ISODateString;
}

/* ----------------------------------------------------------------------------
 * Integrations
 * ------------------------------------------------------------------------- */

export type IntegrationId = "messenger" | "instagram" | "whatsapp" | "shopify" | "woocommerce";

export interface IntegrationSettings {
  syncEnabled: boolean;
  autoReply: boolean;
  notifyOnNew: boolean;
}

export interface Integration {
  id: IntegrationId;
  name: string;
  category: "messaging" | "commerce";
  description: string;
  status: "connected" | "disconnected";
  /** Display-only label for the simulated connected account. */
  accountLabel?: string;
  connectedAt?: ISODateString;
  settings: IntegrationSettings;
}

/* ----------------------------------------------------------------------------
 * AI assistant
 * ------------------------------------------------------------------------- */

export type Language = "auto" | "bn" | "en" | "banglish";
export type BrandVoice = "friendly" | "professional" | "playful" | "concise";
export type ResponseLength = "short" | "balanced" | "detailed";

export interface FaqItem {
  id: ID;
  question: string;
  answer: string;
}

export interface AiAssistantConfig {
  name: string;
  enabled: boolean;
  language: Language;
  voice: BrandVoice;
  responseLength: ResponseLength;
  instructions: string;
  businessInfo: string;
  faqs: FaqItem[];
  productKnowledge: {
    useCatalog: boolean;
    shareStockLevels: boolean;
    sharePrices: boolean;
    recommendSimilar: boolean;
  };
  handoff: {
    onComplaint: boolean;
    onRefundRequest: boolean;
    onLowConfidence: boolean;
    confidenceThreshold: number;
    handoffMessage: string;
  };
}

/* ----------------------------------------------------------------------------
 * Analytics
 * ------------------------------------------------------------------------- */

export interface DailyMetrics {
  date: ISODateString;
  conversations: number;
  resolved: number;
  aiResolved: number;
  humanHandled: number;
  handoffs: number;
  avgFirstResponseSec: number;
  aiMessages: number;
  byChannel: Record<ChannelId, number>;
  byHour: number[];
}

export interface AnalyticsMetrics {
  totalConversations: number;
  resolved: number;
  resolutionRate: number;
  aiAssisted: number;
  aiResolutionRate: number;
  handoffRate: number;
  avgFirstResponseSec: number;
  aiMessages: number;
}

export interface ActivityEvent {
  id: ID;
  kind: "order" | "resolved" | "assigned" | "automation" | "integration" | "handoff";
  text: string;
  createdAt: ISODateString;
}

/* ----------------------------------------------------------------------------
 * Settings
 * ------------------------------------------------------------------------- */

export interface WorkspaceSettings {
  general: {
    workspaceName: string;
    logoDataUrl: string | null;
    timezone: string;
    defaultLanguage: Language;
  };
  business: {
    businessName: string;
    description: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    deliveryPolicy: string;
    returnPolicy: string;
  };
  notifications: {
    desktop: boolean;
    email: boolean;
    emailDigest: "off" | "daily" | "weekly";
    unansweredAlerts: boolean;
    unansweredAfterMinutes: number;
  };
  appearance: {
    sidebarCollapsed: boolean;
    compactInbox: boolean;
  };
  security: {
    twoFactorPreview: boolean;
    sessionTimeoutMinutes: number;
  };
}
