/**
 * localStorage wrapper that never throws: private browsing, disabled storage,
 * quota errors, or server rendering all fall back to "nothing stored".
 */
const PREFIX = "qchat.";

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStorage<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore quota or availability errors — persistence is best-effort.
  }
}

export function removeStorage(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(PREFIX + key);
  } catch {
    // Ignore.
  }
}
