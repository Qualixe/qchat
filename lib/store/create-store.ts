import { useSyncExternalStore } from "react";

type Listener = () => void;
type Updater<T> = Partial<T> | ((state: T) => Partial<T>);

export interface Store<T> {
  getState: () => T;
  getInitialState: () => T;
  setState: (update: Updater<T>) => void;
  subscribe: (listener: Listener) => () => void;
}

/**
 * Minimal external store. Server renders and hydration read the initial
 * state, so client-only changes (e.g. localStorage restores) never cause
 * hydration mismatches.
 */
export function createStore<T extends object>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getState: () => state,
    getInitialState: () => initialState,
    setState(update) {
      const patch = typeof update === "function" ? update(state) : update;
      state = { ...state, ...patch };
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** Subscribe to a slice. Selectors must return stable references (a slice, not a new object). */
export function useStoreSelector<T, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getInitialState()),
  );
}
