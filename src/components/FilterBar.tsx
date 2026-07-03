/* ============================================================
 * FilterBar — search + category + price + sort.
 * Controlled inputs driven entirely by the BrowseQuery object, so
 * the browse engine stays the single source of truth.
 * ============================================================ */

import type { BrowseQuery, PriceFilter, SortKey } from "../lib/filter.ts";
import type { Category } from "../data/types.ts";
import { ALL_CATEGORIES, categoryLabel } from "../lib/format.ts";

export function FilterBar({
  query,
  onChange,
  resultCount,
}: {
  query: BrowseQuery;
  onChange: (next: BrowseQuery) => void;
  resultCount: number;
}) {
  return (
    <div className="filterbar">
      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          className="search-input"
          type="search"
          value={query.search}
          onChange={(e) => onChange({ ...query, search: e.target.value })}
          placeholder="Search drills, ladders, gazebos, a neighbour…"
          aria-label="Search listings"
        />
      </div>

      <div className="filter-row">
        <label className="select-wrap">
          <span className="select-label">Category</span>
          <select
            value={query.category}
            onChange={(e) => onChange({ ...query, category: e.target.value as Category | "all" })}
          >
            <option value="all">All categories</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
        </label>

        <label className="select-wrap">
          <span className="select-label">Price</span>
          <select
            value={query.price}
            onChange={(e) => onChange({ ...query, price: e.target.value as PriceFilter })}
          >
            <option value="all">Free &amp; paid</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
          </select>
        </label>

        <label className="select-wrap">
          <span className="select-label">Sort</span>
          <select
            value={query.sort}
            onChange={(e) => onChange({ ...query, sort: e.target.value as SortKey })}
          >
            <option value="closest">Closest first</option>
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
          </select>
        </label>

        <span className="result-count" aria-live="polite">
          {resultCount} {resultCount === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  );
}
