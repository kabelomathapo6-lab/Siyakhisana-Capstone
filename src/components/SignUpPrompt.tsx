/* ============================================================
 * SignUpPrompt — the reshaped "capture emails" request.
 *
 * Thabo wanted a hard wall: sign up before you can see ANYTHING.
 * That kills trust and bounces people. Instead this appears only
 * when a guest chooses to book — at that point asking who you are
 * is reasonable and expected. It states plainly why we ask.
 *
 * (Mock auth: no real backend. Any name signs you in. The point
 * is the flow and the honesty, not real credentials.)
 * ============================================================ */

import { useState } from "react";
import { Button } from "./ui.tsx";

export function SignUpPrompt({
  onJoin,
  onCancel,
}: {
  onJoin: (displayName: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const trimmed = name.trim();

  function submit() {
    if (trimmed.length >= 2) onJoin(trimmed);
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="signup-title" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 id="signup-title" className="modal-title">
          Join your neighbours
        </h2>
        <p className="modal-copy">
          You can browse everything freely. We only ask for a name when you book, so the owner
          knows who's collecting their gear. That's the whole deal.
        </p>
        <label className="field">
          <span className="field-label">Your name</span>
          <input
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="e.g. Lerato M."
            autoFocus
          />
        </label>
        <div className="modal-actions">
          <Button variant="quiet" onClick={onCancel}>
            Not now
          </Button>
          <Button onClick={submit} disabled={trimmed.length < 2}>
            Join &amp; continue
          </Button>
        </div>
      </div>
    </div>
  );
}
