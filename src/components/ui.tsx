/* ============================================================
 * Small shared UI primitives. Each has an explicit props type and
 * a single job. The Photo component is where the "some items have
 * no photos" reality is handled once, for the whole app.
 * ============================================================ */

import type { ReactNode } from "react";
import type { Category } from "../data/types.ts";
import { categoryLabel } from "../lib/format.ts";
import { CategoryIllustration } from "./CategoryIllustration.tsx";

/* ---- Brand wordmark ---- */
export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Siyakhisana home">
      <span className="logo-mark" aria-hidden="true">◈</span>
      <span className="logo-word">
        Siyakhisana<span className="logo-dot">.</span>
      </span>
    </button>
  );
}

/* ---- Button ---- */
type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "quiet";
  type?: "button" | "submit";
  disabled?: boolean;
  full?: boolean;
};
export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  full = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}${full ? " btn-full" : ""}`}
    >
      {children}
    </button>
  );
}

/* ---- Category chip ---- */
export function CategoryBadge({ category }: { category: Category }) {
  return <span className={`chip chip-${category}`}>{categoryLabel(category)}</span>;
}

/* ---- Status ribbon for paused items ---- */
export function StatusNote({ status }: { status: "available" | "paused" | "removed" }) {
  if (status === "available") return null;
  const text = status === "paused" ? "Paused by owner" : "No longer listed";
  return <span className="status-note">{text}</span>;
}

/* ---- Owner avatar (initials, since we have no photos of people) ---- */
export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="avatar" aria-hidden="true">
      {initials}
    </span>
  );
}

/* ---- Item photo with graceful empty state ----
 * When an item has no photo we show a clean, category-matched
 * illustration rather than a random stock image. This keeps every
 * tile honest (no baby on a drill) and never depends on an external
 * image service, so nothing can break on the deployed site. ---- */
export function Photo({
  urls,
  title,
  category,
  className,
}: {
  urls: string[];
  title: string;
  category: Category;
  className?: string;
}) {
  if (urls.length === 0) {
    return (
      <div className={`photo photo-empty ${className ?? ""}`} role="img" aria-label={`${categoryLabel(category)} illustration for ${title}`}>
        <CategoryIllustration category={category} />
        <small>{categoryLabel(category)}</small>
      </div>
    );
  }
  return <img className={`photo ${className ?? ""}`} src={urls[0]} alt={title} loading="lazy" />;
}
