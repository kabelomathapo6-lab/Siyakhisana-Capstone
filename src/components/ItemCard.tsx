/* ============================================================
 * ItemCard — one listing in the browse grid.
 * Pulls together the safe formatters so every messy-data case
 * (no photo, no price, no rating, unknown distance, paused) is
 * shown honestly rather than crashing or showing "null".
 * ============================================================ */

import type { Item } from "../data/types.ts";
import { Photo, CategoryBadge, StatusNote, Avatar } from "./ui.tsx";
import { formatPriceShort, formatDistance, formatRating, isBookable } from "../lib/format.ts";

export function ItemCard({ item, onOpen }: { item: Item; onOpen: (id: string) => void }) {
  const free = item.price === null || item.price.amountCents === 0;
  return (
    <button
      className={`card${!isBookable(item) ? " card-muted" : ""}`}
      onClick={() => onOpen(item.id)}
      aria-label={`View ${item.title}`}
    >
      <div className="card-photo-wrap">
        <Photo urls={item.photoUrls} title={item.title} category={item.category} className="card-photo" />
        <span className={`price-tag${free ? " price-tag-free" : ""}`}>{formatPriceShort(item.price)}</span>
        <StatusNote status={item.status} />
      </div>

      <div className="card-body">
        <div className="card-top">
          <CategoryBadge category={item.category} />
          <span className="card-dist">{formatDistance(item.distanceKm)}</span>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <div className="card-owner">
          <Avatar name={item.owner.displayName} />
          <span className="card-owner-name">{item.owner.displayName}</span>
          <span className="card-owner-rating">{formatRating(item.owner)}</span>
        </div>
      </div>
    </button>
  );
}
