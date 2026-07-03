/* ============================================================
 * BrowseScreen — the home. Hero states the thesis honestly
 * (real count of items, no fake "3 people looking now"), then
 * search + filters + the grid. Handles loading, error, and the
 * genuinely-empty search result.
 * ============================================================ */

import { useMemo, useState } from "react";
import type { Item } from "../data/types.ts";
import type { Loadable } from "../lib/useItems.ts";
import { runBrowse, DEFAULT_QUERY } from "../lib/filter.ts";
import type { BrowseQuery } from "../lib/filter.ts";
import { FilterBar } from "../components/FilterBar.tsx";
import { ItemCard } from "../components/ItemCard.tsx";
import { Button } from "../components/ui.tsx";

export function BrowseScreen({
  items,
  onOpen,
}: {
  items: Loadable<Item[]>;
  onOpen: (id: string) => void;
}) {
  const [query, setQuery] = useState<BrowseQuery>(DEFAULT_QUERY);

  const results = useMemo(() => {
    if (items.status !== "ready") return [];
    return runBrowse(items.data, query);
  }, [items, query]);

  const liveCount = items.status === "ready" ? runBrowse(items.data, DEFAULT_QUERY).length : 0;

  return (
    <div className="browse">
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Borrow from the street, not the store</p>
          <h1 className="hero-title">
            Why buy the drill<br />
            when <span className="hero-accent">Naledi</span> has one?
          </h1>
          <p className="hero-sub">
            Siyakhisana is how neighbours lend and borrow the things they already own.
            {items.status === "ready" && (
              <> Right now there {liveCount === 1 ? "is" : "are"} <strong>{liveCount}</strong> {liveCount === 1 ? "thing" : "things"} to borrow near you.</>
            )}
          </p>
        </div>
        <div className="hero-glow" aria-hidden="true" />
      </section>

      <section className="browse-body">
        {items.status === "ready" && (
          <FilterBar query={query} onChange={setQuery} resultCount={results.length} />
        )}

        {items.status === "loading" && (
          <div className="grid" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card card-skeleton" />
            ))}
          </div>
        )}

        {items.status === "error" && (
          <div className="state-block">
            <h2>We couldn't load listings</h2>
            <p>{items.message}</p>
          </div>
        )}

        {items.status === "ready" && results.length === 0 && (
          <div className="state-block">
            <h2>Nothing matches that yet</h2>
            <p>Try a wider search, or clear your filters to see everything nearby.</p>
            <Button variant="ghost" onClick={() => setQuery(DEFAULT_QUERY)}>
              Clear filters
            </Button>
          </div>
        )}

        {items.status === "ready" && results.length > 0 && (
          <div className="grid">
            {results.map((item) => (
              <ItemCard key={item.id} item={item} onOpen={onOpen} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
