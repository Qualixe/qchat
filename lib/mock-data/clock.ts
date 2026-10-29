/**
 * Mock data is anchored to a fixed reference time so that server prerendering
 * and client hydration produce identical output. Items created at runtime use
 * `simulatedNow()`, which advances from the reference time as the session runs.
 */
export const REFERENCE_NOW = Date.parse("2026-10-29T09:30:00.000Z");
export const BUSINESS_TIMEZONE = "Asia/Dhaka";

const sessionStart = Date.now();

export function simulatedNow(): number {
  return REFERENCE_NOW + (Date.now() - sessionStart);
}

export function simulatedNowISO(): string {
  return new Date(simulatedNow()).toISOString();
}

export function minutesAgo(minutes: number): string {
  return new Date(REFERENCE_NOW - minutes * 60_000).toISOString();
}

export function hoursAgo(hours: number): string {
  return minutesAgo(hours * 60);
}

export function daysAgo(days: number, atMinutes = 0): string {
  return minutesAgo(days * 24 * 60 + atMinutes);
}
