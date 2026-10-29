import type {
  Availability,
  ContactStatus,
  ConversationStatus,
  FulfillmentStatus,
  PaymentStatus,
  ProductStatus,
  StockStatus,
  TeamRole,
} from "@/lib/types";
import { LOW_STOCK_THRESHOLD } from "@/lib/mock-data/products";
import type { Tone } from "./status-badge";

type StatusMap<K extends string> = Record<K, { label: string; tone: Tone }>;

export const CONVERSATION_STATUS: StatusMap<ConversationStatus> = {
  open: { label: "Open", tone: "primary" },
  pending: { label: "Pending", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
};

export const CONTACT_STATUS: StatusMap<ContactStatus> = {
  active: { label: "Active", tone: "success" },
  lead: { label: "Lead", tone: "info" },
  vip: { label: "VIP", tone: "primary" },
  inactive: { label: "Inactive", tone: "neutral" },
};

export const PRODUCT_STATUS: StatusMap<ProductStatus> = {
  active: { label: "Active", tone: "success" },
  draft: { label: "Draft", tone: "neutral" },
  archived: { label: "Archived", tone: "neutral" },
};

export const STOCK_STATUS: StatusMap<StockStatus> = {
  in_stock: { label: "In stock", tone: "success" },
  low_stock: { label: "Low stock", tone: "warning" },
  out_of_stock: { label: "Out of stock", tone: "danger" },
};

export function stockStatusOf(inventory: number): StockStatus {
  if (inventory <= 0) return "out_of_stock";
  if (inventory <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export const PAYMENT_STATUS: StatusMap<PaymentStatus> = {
  paid: { label: "Paid", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  cod: { label: "Cash on delivery", tone: "info" },
  refunded: { label: "Refunded", tone: "neutral" },
  failed: { label: "Failed", tone: "danger" },
};

export const FULFILLMENT_STATUS: StatusMap<FulfillmentStatus> = {
  unfulfilled: { label: "Unfulfilled", tone: "warning" },
  processing: { label: "Processing", tone: "info" },
  shipped: { label: "Shipped", tone: "primary" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  returned: { label: "Returned", tone: "danger" },
};

export const AVAILABILITY: StatusMap<Availability> = {
  online: { label: "Online", tone: "success" },
  away: { label: "Away", tone: "warning" },
  offline: { label: "Offline", tone: "neutral" },
};

export const ROLE_LABELS: Record<TeamRole, { label: string; description: string }> = {
  owner: { label: "Owner", description: "Full access, including billing and workspace deletion." },
  admin: { label: "Admin", description: "Manage team, integrations, automations, and settings." },
  agent: { label: "Agent", description: "Reply to conversations and manage contacts and orders." },
  viewer: { label: "Viewer", description: "Read-only access to conversations and analytics." },
};
