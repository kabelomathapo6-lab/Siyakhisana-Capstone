/* ============================================================
 * Pure formatting + display helpers.
 * Everything here is pure (no side effects) so it is trivial to
 * reason about and could be unit-tested in isolation.
 * These functions are where the "messy data" from the API
 * contract gets turned into something safe to render.
 * ============================================================ */

import type { Item, Price, Owner, Category } from "../data/types.ts";

/** Rand formatting from integer cents, so we never do float math on money. */
export function formatPrice(price: Price | null): string {
  if (price === null) return "Free to borrow";
  const rand = price.amountCents / 100;
  const amount = rand.toLocaleString("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: rand % 1 === 0 ? 0 : 2,
  });
  return `${amount} / ${price.period}`;
}

/** Short price for tight spaces (cards). */
export function formatPriceShort(price: Price | null): string {
  if (price === null) return "Free";
  const rand = price.amountCents / 100;
  return `R${rand.toLocaleString("en-ZA")}/${price.period[0]}`;
}

/** Distance is null when the viewer hasn't shared location — say so honestly. */
export function formatDistance(distanceKm: number | null): string {
  if (distanceKm === null) return "Distance unknown";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m away`;
  return `${distanceKm.toFixed(1)} km away`;
}

/** Ratings can be null (no ratings yet). Never render "null stars". */
export function formatRating(owner: Pick<Owner, "rating" | "ratingCount">): string {
  if (owner.rating === null || owner.ratingCount === 0) return "New neighbour";
  return `${owner.rating.toFixed(1)} ★ (${owner.ratingCount})`;
}

/** Human category labels — the raw union values are not for end users. */
const CATEGORY_LABELS: Record<Category, string> = {
  "power-tools": "Power tools",
  "hand-tools": "Hand tools",
  garden: "Garden",
  kitchen: "Kitchen",
  outdoor: "Outdoor",
  party: "Party",
  other: "Other",
};

export function categoryLabel(category: Category): string {
  return CATEGORY_LABELS[category];
}

export const ALL_CATEGORIES: Category[] = [
  "power-tools",
  "hand-tools",
  "garden",
  "kitchen",
  "outdoor",
  "party",
  "other",
];

/** "Posted 3 days ago" style relative time from an ISO date. */
export function relativeDate(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((now.getTime() - then) / 86_400_000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)} week${days < 14 ? "" : "s"} ago`;
  return `Posted ${Math.floor(days / 30)} month${days < 60 ? "" : "s"} ago`;
}

/** Only available items can be booked. Central rule so the UI can't drift. */
export function isBookable(item: Item): boolean {
  return item.status === "available";
}
