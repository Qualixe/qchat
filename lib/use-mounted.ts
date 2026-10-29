import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during SSR and hydration, true afterwards — for client-only values like the theme. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
