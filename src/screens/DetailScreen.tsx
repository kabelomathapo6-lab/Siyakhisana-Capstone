/* ============================================================
 * DetailScreen — one item in full.
 * Every awkward case handled: no photos (placeholder), no price
 * (free), owner with no rating ("new neighbour"), unknown distance,
 * and paused/removed items that must NOT be bookable — the BOOK
 * button is replaced with an honest explanation instead.
 * ============================================================ */

import type { Item } from "../data/types.ts";
import { Photo, CategoryBadge, Avatar, Button } from "../components/ui.tsx";
import {
  formatPrice,
  formatDistance,
  formatRating,
  relativeDate,
  isBookable,
} from "../lib/format.ts";

export function DetailScreen({
  item,
  onBack,
  onBook,
}: {
  item: Item;
  onBack: () => void;
  onBook: (item: Item) => void;
}) {
  const memberSince = new Date(item.owner.joinedISO).toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="detail">
      <button className="back-link" onClick={onBack}>
        ← Back to browse
      </button>

      <div className="detail-grid">
        <div className="detail-media">
          <Photo urls={item.photoUrls} title={item.title} className="detail-photo" />
          {item.photoUrls.length > 1 && (
            <div className="thumb-row">
              {item.photoUrls.slice(1).map((url, i) => (
                <img key={i} className="thumb" src={url} alt={`${item.title}, view ${i + 2}`} loading="lazy" />
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <CategoryBadge category={item.category} />
          <h1 className="detail-title">{item.title}</h1>
          <p className="detail-meta">
            {formatDistance(item.distanceKm)} · {relativeDate(item.postedISO)}
          </p>

          <p className="detail-price">{formatPrice(item.price)}</p>

          <p className="detail-desc">{item.description}</p>

          <div className="owner-card">
            <Avatar name={item.owner.displayName} />
            <div>
              <p className="owner-name">{item.owner.displayName}</p>
              <p className="owner-sub">
                {formatRating(item.owner)} · Neighbour since {memberSince}
              </p>
            </div>
          </div>

          {isBookable(item) ? (
            <Button full onClick={() => onBook(item)}>
              Book this
            </Button>
          ) : (
            <div className="unavailable-note">
              <strong>{item.status === "paused" ? "Paused by the owner" : "No longer available"}</strong>
              <span>
                {item.status === "paused"
                  ? "This item is temporarily unavailable. Check back soon."
                  : "This listing has been taken down."}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
