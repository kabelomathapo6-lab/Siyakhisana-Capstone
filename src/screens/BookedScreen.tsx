/* ============================================================
 * BookedScreen — the clear confirmation the brief requires.
 * Honest and calm: what happens next, who to expect, no fake
 * countdowns or upsells.
 * ============================================================ */

import type { Item, AvailabilityRange } from "../data/types.ts";
import { Button } from "../components/ui.tsx";

export function BookedScreen({
  item,
  range,
  onDone,
}: {
  item: Item;
  range: AvailabilityRange;
  onDone: () => void;
}) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });

  return (
    <div className="booked">
      <div className="booked-card">
        <div className="booked-check" aria-hidden="true">
          ✓
        </div>
        <h1>You're booked in</h1>
        <p className="booked-lead">
          {item.owner.displayName} has been notified. You've got <strong>{item.title}</strong> from{" "}
          {fmt(range.startISO)} to {fmt(range.endISO)}.
        </p>
        <div className="booked-next">
          <h2>What happens now</h2>
          <ol>
            <li>{item.owner.displayName} confirms and shares a pick-up spot.</li>
            <li>You collect the item and sort out any deposit face to face.</li>
            <li>Return it on time so the next neighbour can borrow it too.</li>
          </ol>
        </div>
        <Button full onClick={onDone}>
          Back to browse
        </Button>
      </div>
    </div>
  );
}
