/* ============================================================
 * Category illustrations. Simple, honest line icons drawn inline
 * as SVG — no external image service, so nothing can break on the
 * live site, and nothing misrepresents an item (no baby on a drill).
 * Each maps to a Category from the data contract.
 * ============================================================ */

import type { ReactNode, ReactElement } from "react";
import type { Category } from "../data/types.ts";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {children}
    </svg>
  );
}

const S = { stroke: "currentColor", strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

function PowerTools() {
  return (
    <Frame>
      <path d="M20 40h30v16H20z" {...S} />
      <path d="M50 44h14l8-6v20l-8-6H50" {...S} />
      <path d="M28 56v12h10V56" {...S} />
      <circle cx="24" cy="34" r="3" fill="currentColor" />
    </Frame>
  );
}
function HandTools() {
  return (
    <Frame>
      <path d="M30 66 58 38" {...S} />
      <path d="M54 30a10 10 0 0 1 12 12l-8-4-4-8z" {...S} />
      <path d="M28 60l-6 6a4 4 0 0 0 6 6l6-6" {...S} />
    </Frame>
  );
}
function Garden() {
  return (
    <Frame>
      <path d="M48 30v40" {...S} />
      <path d="M48 44c-8 0-14-6-14-14 8 0 14 6 14 14z" {...S} />
      <path d="M48 52c8 0 14-6 14-14-8 0-14 6-14 14z" {...S} />
      <path d="M38 70h20" {...S} />
    </Frame>
  );
}
function Kitchen() {
  return (
    <Frame>
      <path d="M34 30h28l-4 20H38z" {...S} />
      <path d="M40 50v18h16V50" {...S} />
      <path d="M48 30v-6" {...S} />
    </Frame>
  );
}
function Outdoor() {
  return (
    <Frame>
      <path d="M24 68 48 28l24 40z" {...S} />
      <path d="M40 68l8-14 8 14" {...S} />
    </Frame>
  );
}
function Party() {
  return (
    <Frame>
      <path d="M30 70 44 40l10 6-16 26z" {...S} />
      <path d="M46 34c4-6 12-8 18-4" {...S} />
      <circle cx="64" cy="30" r="2.4" fill="currentColor" />
      <circle cx="58" cy="44" r="2.4" fill="currentColor" />
      <circle cx="70" cy="40" r="2.4" fill="currentColor" />
    </Frame>
  );
}
function Other() {
  return (
    <Frame>
      <rect x="30" y="30" width="36" height="36" rx="6" {...S} />
      <path d="M48 40v16M40 48h16" {...S} />
    </Frame>
  );
}

const BY_CATEGORY: Record<Category, () => ReactElement> = {
  "power-tools": PowerTools,
  "hand-tools": HandTools,
  garden: Garden,
  kitchen: Kitchen,
  outdoor: Outdoor,
  party: Party,
  other: Other,
};

export function CategoryIllustration({ category }: { category: Category }) {
  const Icon = BY_CATEGORY[category];
  return <Icon />;
}
