import { BUSINESS_TIMEZONE, REFERENCE_NOW } from "@/lib/mock-data/clock";

/*
 * All formatters pin locale and timezone so server and client render the
 * same strings regardless of the visitor's machine settings.
 */

const LOCALE = "en-US";

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: "numeric",
  minute: "2-digit",
  timeZone: BUSINESS_TIMEZONE,
});

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  day: "numeric",
  timeZone: BUSINESS_TIMEZONE,
});

const longDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: BUSINESS_TIMEZONE,
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: BUSINESS_TIMEZONE,
});

const weekdayFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  timeZone: BUSINESS_TIMEZONE,
});

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: BUSINESS_TIMEZONE,
});

const numberFormatter = new Intl.NumberFormat(LOCALE);
const compactFormatter = new Intl.NumberFormat(LOCALE, {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return longDateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatWeekday(iso: string): string {
  return weekdayFormatter.format(new Date(iso));
}

function dayKey(ms: number): string {
  return dayKeyFormatter.format(new Date(ms));
}

/** Inbox-style stamp: time today, "Yesterday", weekday this week, else date. */
export function formatMessageStamp(iso: string, now = REFERENCE_NOW): string {
  const ms = Date.parse(iso);
  if (dayKey(ms) === dayKey(now)) return formatTime(iso);
  if (dayKey(ms) === dayKey(now - 86_400_000)) return "Yesterday";
  if (now - ms < 6 * 86_400_000) return formatWeekday(iso);
  return formatShortDate(iso);
}

/** Day separator label for message threads. */
export function formatDayLabel(iso: string, now = REFERENCE_NOW): string {
  const ms = Date.parse(iso);
  if (dayKey(ms) === dayKey(now)) return "Today";
  if (dayKey(ms) === dayKey(now - 86_400_000)) return "Yesterday";
  return formatDate(iso);
}

export function isSameDay(a: string, b: string): boolean {
  return dayKey(Date.parse(a)) === dayKey(Date.parse(b));
}

export function formatRelative(iso: string, now = REFERENCE_NOW): string {
  const diff = Math.max(0, now - Date.parse(iso));
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function formatCurrency(amount: number): string {
  return `৳${numberFormatter.format(Math.round(amount))}`;
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
