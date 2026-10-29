/**
 * MOCK AUTHENTICATION — FRONTEND SIMULATION ONLY.
 *
 * No credentials are verified, transmitted, or stored. "Signing in" writes a
 * display-only session object to localStorage so the UI can greet the user.
 * Replace these functions with a real provider (e.g. Supabase Auth) later;
 * the call sites only depend on the signatures below.
 */
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";

export interface MockSession {
  name: string;
  email: string;
  createdAt: string;
}

const SESSION_KEY = "mock-session";
const SIMULATED_LATENCY_MS = 900;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Emails ending in this domain simulate a failed sign-in, to demo error states. */
export const MOCK_FAILURE_DOMAIN = "@fail.test";

export async function mockSignIn(email: string): Promise<MockSession> {
  await wait(SIMULATED_LATENCY_MS);
  if (email.toLowerCase().endsWith(MOCK_FAILURE_DOMAIN)) {
    throw new Error("We couldn't sign you in with those details. (Simulated error)");
  }
  const session: MockSession = {
    name: email.split("@")[0] ?? "Demo user",
    email,
    createdAt: new Date().toISOString(),
  };
  writeStorage(SESSION_KEY, session);
  return session;
}

export async function mockSignUp(name: string, email: string): Promise<MockSession> {
  await wait(SIMULATED_LATENCY_MS);
  if (email.toLowerCase().endsWith(MOCK_FAILURE_DOMAIN)) {
    throw new Error("An account with this email already exists. (Simulated error)");
  }
  const session: MockSession = { name, email, createdAt: new Date().toISOString() };
  writeStorage(SESSION_KEY, session);
  return session;
}

export async function mockRequestPasswordReset(email: string): Promise<void> {
  await wait(SIMULATED_LATENCY_MS);
  if (email.toLowerCase().endsWith(MOCK_FAILURE_DOMAIN)) {
    throw new Error("Something went wrong. Please try again. (Simulated error)");
  }
  // Intentionally does nothing: no email is sent in this demo.
}

export function getMockSession(): MockSession | null {
  return readStorage<MockSession>(SESSION_KEY);
}

export function mockSignOut(): void {
  removeStorage(SESSION_KEY);
}
