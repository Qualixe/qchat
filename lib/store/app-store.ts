"use client";

import type {
  AiAssistantConfig,
  Automation,
  Contact,
  Conversation,
  ConversationStatus,
  ID,
  Integration,
  IntegrationId,
  IntegrationSettings,
  Message,
  MessageAttachment,
  Order,
  Product,
  TeamMember,
  TeamRole,
  WorkspaceSettings,
} from "@/lib/types";
import { automations } from "@/lib/mock-data/automations";
import { contacts } from "@/lib/mock-data/contacts";
import { conversations } from "@/lib/mock-data/conversations";
import { integrations } from "@/lib/mock-data/integrations";
import { orders } from "@/lib/mock-data/orders";
import { CURRENT_USER_ID, organizations, teamMembers } from "@/lib/mock-data/organization";
import { products } from "@/lib/mock-data/products";
import { defaultAiConfig, defaultSettings } from "@/lib/mock-data/settings";
import { hoursAgo, minutesAgo, simulatedNowISO } from "@/lib/mock-data/clock";
import { avatarColorFor } from "@/lib/mock-data/avatar-colors";
import { createId, initialsOf } from "@/lib/format";
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";
import { createStore, useStoreSelector } from "./create-store";

export interface AppNotification {
  id: ID;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
}

export interface AppState {
  organizationId: ID;
  currentUserId: ID;
  conversations: Conversation[];
  contacts: Contact[];
  products: Product[];
  orders: Order[];
  automations: Automation[];
  integrations: Integration[];
  team: TeamMember[];
  aiConfig: AiAssistantConfig;
  settings: WorkspaceSettings;
  notifications: AppNotification[];
  /** Conversation ids where the customer is currently "typing". */
  typing: ID[];
  /** True once persisted preferences have been restored on the client. */
  hydrated: boolean;
}

const initialNotifications: AppNotification[] = [
  {
    id: "nt_1",
    title: "New message from Ayesha Siddiqua",
    body: "Also do you have matching earrings?",
    href: "/inbox",
    createdAt: minutesAgo(4),
    read: false,
  },
  {
    id: "nt_2",
    title: "High-priority conversation",
    body: "Rahim Uddin is waiting on a delayed delivery.",
    href: "/inbox",
    createdAt: minutesAgo(12),
    read: false,
  },
  {
    id: "nt_3",
    title: "Low stock: Printed Silk Scarf",
    body: "Only 3 left in inventory.",
    href: "/products",
    createdAt: hoursAgo(6),
    read: false,
  },
  {
    id: "nt_4",
    title: "Shopify sync complete",
    body: "14 products updated from your store.",
    href: "/integrations",
    createdAt: hoursAgo(7),
    read: true,
  },
];

const initialState: AppState = {
  organizationId: organizations[0].id,
  currentUserId: CURRENT_USER_ID,
  conversations,
  contacts,
  products,
  orders,
  automations,
  integrations,
  team: teamMembers,
  aiConfig: defaultAiConfig,
  settings: defaultSettings,
  notifications: initialNotifications,
  typing: [],
  hydrated: false,
};

export const appStore = createStore<AppState>(initialState);

export function useAppStore<S>(selector: (state: AppState) => S): S {
  return useStoreSelector(appStore, selector);
}

const set = appStore.setState;
const get = appStore.getState;

/* ----------------------------------------------------------------------------
 * Persistence — preferences and simulated configuration survive reloads.
 * Operational data (conversations, contacts…) resets per session by design.
 * ------------------------------------------------------------------------- */

const PERSISTED_KEYS = ["organizationId", "aiConfig", "settings", "integrations", "automations"] as const;
type PersistedKey = (typeof PERSISTED_KEYS)[number];

export function restorePersistedState() {
  if (get().hydrated) return;
  const restored: Partial<AppState> = {};
  for (const key of PERSISTED_KEYS) {
    const value = readStorage<AppState[PersistedKey]>(`state.${key}`);
    if (value !== null) Object.assign(restored, { [key]: value });
  }
  if (restored.settings) {
    // Merge so newly added settings fields keep their defaults.
    restored.settings = mergeSettings(defaultSettings, restored.settings);
  }
  set({ ...restored, hydrated: true });

  let previous = get();
  appStore.subscribe(() => {
    const next = get();
    for (const key of PERSISTED_KEYS) {
      if (next[key] !== previous[key]) writeStorage(`state.${key}`, next[key]);
    }
    previous = next;
  });
}

function mergeSettings(base: WorkspaceSettings, saved: Partial<WorkspaceSettings>): WorkspaceSettings {
  return {
    general: { ...base.general, ...saved.general },
    business: { ...base.business, ...saved.business },
    notifications: { ...base.notifications, ...saved.notifications },
    appearance: { ...base.appearance, ...saved.appearance },
    security: { ...base.security, ...saved.security },
  };
}

export function resetDemoData() {
  for (const key of PERSISTED_KEYS) removeStorage(`state.${key}`);
  set({ ...initialState, hydrated: true });
}

/* ----------------------------------------------------------------------------
 * Conversations
 * ------------------------------------------------------------------------- */

function updateConversation(id: ID, patch: (c: Conversation) => Partial<Conversation>) {
  set((state) => ({
    conversations: state.conversations.map((c) => (c.id === id ? { ...c, ...patch(c) } : c)),
  }));
}

export function markConversationRead(id: ID) {
  const conversation = get().conversations.find((c) => c.id === id);
  if (conversation && conversation.unreadCount > 0) updateConversation(id, () => ({ unreadCount: 0 }));
}

export function sendMessage(
  id: ID,
  body: string,
  options: { internal?: boolean; attachment?: MessageAttachment } = {},
): Message {
  const message: Message = {
    id: createId("msg"),
    conversationId: id,
    authorType: "agent",
    authorId: get().currentUserId,
    body,
    createdAt: simulatedNowISO(),
    status: options.internal ? undefined : "sent",
    isInternalNote: options.internal,
    attachment: options.attachment,
  };
  updateConversation(id, (c) => ({
    messages: [...c.messages, message],
    lastMessageAt: message.createdAt,
    // Replying to a resolved conversation reopens it, as in most helpdesks.
    status: !options.internal && c.status === "resolved" ? "open" : c.status,
  }));
  if (!options.internal) {
    // Simulated delivery receipts.
    setTimeout(() => setMessageStatus(id, message.id, "delivered"), 900);
  }
  return message;
}

export function setMessageStatus(conversationId: ID, messageId: ID, status: Message["status"]) {
  updateConversation(conversationId, (c) => ({
    messages: c.messages.map((m) => (m.id === messageId ? { ...m, status } : m)),
  }));
}

export function receiveCustomerMessage(id: ID, body: string, unread: boolean) {
  const message: Message = {
    id: createId("msg"),
    conversationId: id,
    authorType: "customer",
    body,
    createdAt: simulatedNowISO(),
  };
  updateConversation(id, (c) => ({
    messages: [
      ...c.messages.map((m) => (m.authorType === "agent" && m.status === "delivered" ? { ...m, status: "read" as const } : m)),
      message,
    ],
    lastMessageAt: message.createdAt,
    unreadCount: unread ? c.unreadCount + 1 : c.unreadCount,
  }));
}

export function setTyping(id: ID, typing: boolean) {
  set((state) => ({
    typing: typing ? [...new Set([...state.typing, id])] : state.typing.filter((t) => t !== id),
  }));
}

export function setConversationStatus(id: ID, status: ConversationStatus) {
  updateConversation(id, () => ({ status, unreadCount: 0 }));
  appendSystemMessage(id, status === "resolved" ? "Conversation marked as resolved" : "Conversation reopened");
}

export function assignConversation(id: ID, assigneeId: ID | null) {
  updateConversation(id, () => ({ assigneeId }));
  const member = get().team.find((m) => m.id === assigneeId);
  appendSystemMessage(id, member ? `Assigned to ${member.name}` : "Conversation unassigned");
}

function appendSystemMessage(id: ID, body: string) {
  const message: Message = {
    id: createId("msg"),
    conversationId: id,
    authorType: "system",
    body,
    createdAt: simulatedNowISO(),
  };
  updateConversation(id, (c) => ({ messages: [...c.messages, message] }));
}

/* ----------------------------------------------------------------------------
 * Contacts
 * ------------------------------------------------------------------------- */

export type ContactInput = Pick<Contact, "name" | "email" | "phone" | "location" | "tags" | "status" | "channel" | "notes">;

export function addContact(input: ContactInput): Contact {
  const id = createId("ct");
  const contact: Contact = {
    ...input,
    id,
    initials: initialsOf(input.name),
    avatarColor: avatarColorFor(id),
    lastContactedAt: simulatedNowISO(),
    totalConversations: 0,
    totalOrders: 0,
    lifetimeValue: 0,
    createdAt: simulatedNowISO(),
  };
  set((state) => ({ contacts: [contact, ...state.contacts] }));
  return contact;
}

export function updateContact(id: ID, input: Partial<ContactInput>) {
  set((state) => ({
    contacts: state.contacts.map((c) =>
      c.id === id ? { ...c, ...input, initials: input.name ? initialsOf(input.name) : c.initials } : c,
    ),
  }));
}

export function deleteContact(id: ID) {
  set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) }));
}

/* ----------------------------------------------------------------------------
 * Products
 * ------------------------------------------------------------------------- */

export type ProductInput = Pick<
  Product,
  "name" | "sku" | "category" | "price" | "compareAtPrice" | "inventory" | "status" | "description" | "image"
>;

export function addProduct(input: ProductInput): Product {
  const product: Product = { ...input, id: createId("pr"), source: "manual", updatedAt: simulatedNowISO() };
  set((state) => ({ products: [product, ...state.products] }));
  return product;
}

export function updateProduct(id: ID, input: Partial<ProductInput>) {
  set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...input, updatedAt: simulatedNowISO() } : p)),
  }));
}

export function deleteProduct(id: ID) {
  set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
}

/* ----------------------------------------------------------------------------
 * Automations
 * ------------------------------------------------------------------------- */

export type AutomationInput = Omit<Automation, "id" | "runs" | "updatedAt">;

export function saveAutomation(input: AutomationInput, id?: ID): Automation {
  if (id) {
    let saved = get().automations.find((a) => a.id === id)!;
    set((state) => ({
      automations: state.automations.map((a) => {
        if (a.id !== id) return a;
        saved = { ...a, ...input, updatedAt: simulatedNowISO() };
        return saved;
      }),
    }));
    return saved;
  }
  const automation: Automation = { ...input, id: createId("au"), runs: 0, updatedAt: simulatedNowISO() };
  set((state) => ({ automations: [automation, ...state.automations] }));
  return automation;
}

export function toggleAutomation(id: ID, active: boolean) {
  set((state) => ({
    automations: state.automations.map((a) => (a.id === id ? { ...a, active, updatedAt: simulatedNowISO() } : a)),
  }));
}

export function duplicateAutomation(id: ID) {
  const source = get().automations.find((a) => a.id === id);
  if (!source) return;
  const copy: Automation = {
    ...source,
    id: createId("au"),
    name: `${source.name} (copy)`,
    active: false,
    runs: 0,
    updatedAt: simulatedNowISO(),
  };
  set((state) => {
    const index = state.automations.findIndex((a) => a.id === id);
    const next = [...state.automations];
    next.splice(index + 1, 0, copy);
    return { automations: next };
  });
}

export function deleteAutomation(id: ID) {
  set((state) => ({ automations: state.automations.filter((a) => a.id !== id) }));
}

/* ----------------------------------------------------------------------------
 * Integrations (simulated — no tokens are requested or stored)
 * ------------------------------------------------------------------------- */

export function connectIntegration(id: IntegrationId, accountLabel: string, settings: IntegrationSettings) {
  set((state) => ({
    integrations: state.integrations.map((i) =>
      i.id === id ? { ...i, status: "connected", accountLabel, settings, connectedAt: simulatedNowISO() } : i,
    ),
  }));
}

export function updateIntegrationSettings(id: IntegrationId, settings: IntegrationSettings) {
  set((state) => ({
    integrations: state.integrations.map((i) => (i.id === id ? { ...i, settings } : i)),
  }));
}

export function disconnectIntegration(id: IntegrationId) {
  set((state) => ({
    integrations: state.integrations.map((i) =>
      i.id === id ? { ...i, status: "disconnected", accountLabel: undefined, connectedAt: undefined } : i,
    ),
  }));
}

/* ----------------------------------------------------------------------------
 * Team
 * ------------------------------------------------------------------------- */

export function inviteMember(input: { name: string; email: string; role: TeamRole }) {
  const id = createId("tm");
  const member: TeamMember = {
    id,
    name: input.name,
    email: input.email,
    role: input.role,
    initials: initialsOf(input.name),
    avatarColor: avatarColorFor(id),
    title: "Invited",
    availability: "offline",
    joinedAt: simulatedNowISO(),
    invited: true,
  };
  set((state) => ({ team: [...state.team, member] }));
}

export function updateMemberRole(id: ID, role: TeamRole) {
  set((state) => ({ team: state.team.map((m) => (m.id === id ? { ...m, role } : m)) }));
}

export function removeMember(id: ID) {
  set((state) => ({
    team: state.team.filter((m) => m.id !== id),
    conversations: state.conversations.map((c) => (c.assigneeId === id ? { ...c, assigneeId: null } : c)),
  }));
}

/* ----------------------------------------------------------------------------
 * Settings, AI configuration, workspace, notifications
 * ------------------------------------------------------------------------- */

export function saveAiConfig(config: AiAssistantConfig) {
  set({ aiConfig: config });
}

export function updateSettings<K extends keyof WorkspaceSettings>(section: K, value: WorkspaceSettings[K]) {
  set((state) => ({ settings: { ...state.settings, [section]: value } }));
}

export function setSidebarCollapsed(collapsed: boolean) {
  const { settings } = get();
  updateSettings("appearance", { ...settings.appearance, sidebarCollapsed: collapsed });
}

export function switchOrganization(id: ID) {
  set({ organizationId: id });
}

export function markNotificationRead(id: ID) {
  set((state) => ({
    notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
  }));
}

export function markAllNotificationsRead() {
  set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) }));
}
