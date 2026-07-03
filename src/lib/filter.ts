/* ============================================================
 * The browse engine: search + filters + sort, as ONE pure
 * function over the item list. Keeping this separate from React
 * means the filtering logic can be reasoned about and changed
 * without touching any component — a deliberate architecture call
 * (see Decision Log: "isolate business rules from UI").
 * ============================================================ */

import type { Item, Category } from "../data/types.ts";

export type PriceFilter = "all" | "free" | "paid";
export type SortKey = "closest" | "newest" | "price-low";

export interface BrowseQuery {
  search: string;
  category: Category | "all";
  price: PriceFilter;
  sort: SortKey;
}

export const DEFAULT_QUERY: BrowseQuery = {
  search: "",
  category: "all",
  price: "all",
  sort: "closest",
};

/** Removed items never show anywhere. Paused items still show (greyed) so
 *  neighbours know they exist, but they aren't bookable — handled in UI. */
function isVisible(item: Item): boolean {
  return item.status !== "removed";
}

function matchesSearch(item: Item, term: string): boolean {
  if (term.trim() === "") return true;
  const needle = term.trim().toLowerCase();
  return (
    item.title.toLowerCase().includes(needle) ||
    item.description.toLowerCase().includes(needle) ||
    item.owner.displayName.toLowerCase().includes(needle)
  );
}

function matchesCategory(item: Item, category: Category | "all"): boolean {
  return category === "all" || item.category === category;
}

function matchesPrice(item: Item, price: PriceFilter): boolean {
  if (price === "all") return true;
  const isFree = item.price === null || item.price.amountCents === 0;
  return price === "free" ? isFree : !isFree;
}

/** Sort helpers. Nulls (unknown distance / free) sort last for "closest"
 *  and "price-low" so the user always sees concrete info first. */
function compare(a: Item, b: Item, sort: SortKey): number {
  switch (sort) {
    case "closest": {
      if (a.distanceKm === null && b.distanceKm === null) return 0;
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    }
    case "newest":
      return new Date(b.postedISO).getTime() - new Date(a.postedISO).getTime();
    case "price-low": {
      const pa = a.price?.amountCents ?? 0;
      const pb = b.price?.amountCents ?? 0;
      return pa - pb;
    }
    default: {
      // exhaustiveness guard: adding a SortKey without handling it fails to compile
      const _exhaustive: never = sort;
      return _exhaustive;
    }
  }
}

export function runBrowse(items: Item[], query: BrowseQuery): Item[] {
  return items
    .filter(isVisible)
    .filter((i) => matchesSearch(i, query.search))
    .filter((i) => matchesCategory(i, query.category))
    .filter((i) => matchesPrice(i, query.price))
    .slice()
    .sort((a, b) => compare(a, b, query.sort));
}
