/* ============================================================
 * useItems — loads items through the fake async API.
 *
 * WHY model loading/error/success as a union instead of three
 * loose booleans: it makes impossible states impossible. You can
 * never be "loading AND error" at once, and the UI must handle
 * every case, which is exactly how a real API integration behaves.
 * When the real backend arrives, only this hook changes.
 * ============================================================ */

import { useEffect, useState } from "react";
import type { Item } from "../data/types.ts";
import { fetchItems } from "../data/items.ts";

export type Loadable<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

export function useItems(): Loadable<Item[]> {
  const [state, setState] = useState<Loadable<Item[]>>({ status: "loading" });

  useEffect(() => {
    let active = true;
    fetchItems()
      .then((items) => {
        if (active) setState({ status: "ready", data: items });
      })
      .catch(() => {
        if (active) {
          setState({ status: "error", message: "We couldn't load listings. Check your connection and try again." });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

/** Find one item by id inside a loaded list. Returns null if missing. */
export function findItem(items: Item[], id: string): Item | null {
  return items.find((i) => i.id === id) ?? null;
}
