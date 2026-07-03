/* ============================================================
 * BookingScreen — the 2-step flow: pick dates → review & confirm.
 * Validates that end is not before start, and computes the total
 * from the item's price + number of days. Pure calc, shown clearly.
 * ============================================================ */

import { useState } from "react";
import type { Item, AvailabilityRange } from "../data/types.ts";
import { Photo, Button } from "../components/ui.tsx";
import { formatPrice } from "../lib/format.ts";

/** Inclusive day count between two ISO dates (min 1). */
export function dayCount(range: AvailabilityRange): number {
  const start = new Date(range.startISO).getTime();
  const end = new Date(range.endISO).getTime();
  const days = Math.round((end - start) / 86_400_000) + 1;
  return days < 1 ? 1 : days;
}

function estimateTotalCents(item: Item, range: AvailabilityRange): number {
  if (item.price === null) return 0;
  const days = dayCount(range);
  // Simple model: price-per-day * days (weekly/hourly kept out of scope, noted in log)
  const perDay =
    item.price.period === "day"
      ? item.price.amountCents
      : item.price.period === "week"
        ? Math.round(item.price.amountCents / 7)
        : item.price.amountCents * 8; // hourly → assume an 8h day
  return perDay * days;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- Step 1: dates ---------- */
export function BookingDates({
  item,
  initial,
  onBack,
  onNext,
}: {
  item: Item;
  initial: AvailabilityRange | null;
  onBack: () => void;
  onNext: (range: AvailabilityRange) => void;
}) {
  const [startISO, setStart] = useState(initial?.startISO ?? todayISO());
  const [endISO, setEnd] = useState(initial?.endISO ?? todayISO());

  const invalid = new Date(endISO).getTime() < new Date(startISO).getTime();

  return (
    <div className="booking">
      <BookingHeader step={1} title={`Book ${item.title}`} onBack={onBack} />

      <div className="booking-card">
        <label className="field">
          <span className="field-label">Pick-up date</span>
          <input
            className="field-input"
            type="date"
            value={startISO}
            min={todayISO()}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Return date</span>
          <input
            className="field-input"
            type="date"
            value={endISO}
            min={startISO}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>

        {invalid && <p className="field-error">Return date can't be before pick-up.</p>}

        <div className="booking-summary">
          <span>{formatPrice(item.price)}</span>
          {!invalid && (
            <span>
              {dayCount({ startISO, endISO })} day{dayCount({ startISO, endISO }) > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <Button full disabled={invalid} onClick={() => onNext({ startISO, endISO })}>
          Review booking
        </Button>
      </div>
    </div>
  );
}

/* ---------- Step 2: confirm ---------- */
export function BookingConfirm({
  item,
  range,
  onBack,
  onConfirm,
}: {
  item: Item;
  range: AvailabilityRange;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const totalCents = estimateTotalCents(item, range);
  const total =
    totalCents === 0
      ? "Free"
      : (totalCents / 100).toLocaleString("en-ZA", { style: "currency", currency: "ZAR" });

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="booking">
      <BookingHeader step={2} title="Review & confirm" onBack={onBack} />

      <div className="booking-card">
        <div className="confirm-item">
          <Photo urls={item.photoUrls} title={item.title} category={item.category} className="confirm-photo" />
          <div>
            <h3>{item.title}</h3>
            <p className="confirm-owner">from {item.owner.displayName}</p>
          </div>
        </div>

        <dl className="confirm-list">
          <div>
            <dt>Pick-up</dt>
            <dd>{fmt(range.startISO)}</dd>
          </div>
          <div>
            <dt>Return</dt>
            <dd>{fmt(range.endISO)}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>
              {dayCount(range)} day{dayCount(range) > 1 ? "s" : ""}
            </dd>
          </div>
          <div className="confirm-total">
            <dt>Estimated total</dt>
            <dd>{total}</dd>
          </div>
        </dl>

        <p className="confirm-note">
          You'll arrange pick-up directly with {item.owner.displayName}. No payment is taken now —
          this just lets them know you're coming.
        </p>

        <Button full onClick={onConfirm}>
          Confirm booking
        </Button>
      </div>
    </div>
  );
}

function BookingHeader({ step, title, onBack }: { step: 1 | 2; title: string; onBack: () => void }) {
  return (
    <div className="booking-head">
      <button className="back-link" onClick={onBack}>
        ← Back
      </button>
      <div className="steps" aria-label={`Step ${step} of 2`}>
        <span className={`step-dot${step >= 1 ? " on" : ""}`} />
        <span className={`step-dot${step >= 2 ? " on" : ""}`} />
      </div>
      <h1 className="booking-title">{title}</h1>
    </div>
  );
}
