/* ============================================================
 * App state machine (useReducer).
 *
 * WHY a reducer and not scattered useState:
 *  - Every transition is a named action in ONE place, so when the
 *    founder pivots ("bookings by the hour now"), the change is
 *    localised instead of spread across components.
 *  - The discriminated-union action type + a `never` guard means a
 *    new action can't be added without the compiler forcing us to
 *    handle it.
 *
 * NOTE ON AUTH (the reshaped "force signup" request):
 *  Thabo asked to wall the whole app behind signup. We instead let
 *  people browse freely and only ask them to join at the moment they
 *  book. So auth state lives here, but it gates the BOOKING action,
 *  not the BROWSE screen. See FOUNDER-RESPONSE.md.
 * ============================================================ */

import type { Item, AvailabilityRange } from "../data/types.ts";

/** Where the user currently is. Booking is a mini 2-step flow. */
export type Route =
  | { name: "browse" }
  | { name: "detail"; itemId: string }
  | { name: "booking"; itemId: string; step: "dates" | "confirm" }
  | { name: "booked"; itemId: string; range: AvailabilityRange };

export interface Session {
  /** null = a guest (can browse, can't yet book). */
  displayName: string | null;
}

export interface AppState {
  route: Route;
  session: Session;
  /** The in-progress booking, built up across the flow. null when idle. */
  draftRange: AvailabilityRange | null;
  /** When a guest tries to book, we remember the item and show sign-up. */
  pendingBookItemId: string | null;
}

export const initialState: AppState = {
  route: { name: "browse" },
  session: { displayName: null },
  draftRange: null,
  pendingBookItemId: null,
};

export type Action =
  | { type: "GO_BROWSE" }
  | { type: "OPEN_ITEM"; itemId: string }
  | { type: "START_BOOKING"; item: Item }
  | { type: "SET_RANGE"; range: AvailabilityRange }
  | { type: "GO_CONFIRM"; itemId: string }
  | { type: "CONFIRM_BOOKING"; itemId: string; range: AvailabilityRange }
  | { type: "SIGN_IN"; displayName: string }
  | { type: "SIGN_OUT" }
  | { type: "CANCEL_SIGNUP" };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "GO_BROWSE":
      return { ...state, route: { name: "browse" }, draftRange: null, pendingBookItemId: null };

    case "OPEN_ITEM":
      return { ...state, route: { name: "detail", itemId: action.itemId } };

    case "START_BOOKING": {
      // The honest gate: guests get the sign-up prompt here, not at the door.
      if (state.session.displayName === null) {
        return { ...state, pendingBookItemId: action.item.id };
      }
      return {
        ...state,
        route: { name: "booking", itemId: action.item.id, step: "dates" },
        draftRange: null,
      };
    }

    case "SET_RANGE":
      return { ...state, draftRange: action.range };

    case "GO_CONFIRM":
      return { ...state, route: { name: "booking", itemId: action.itemId, step: "confirm" } };

    case "CONFIRM_BOOKING":
      return {
        ...state,
        route: { name: "booked", itemId: action.itemId, range: action.range },
        draftRange: null,
      };

    case "SIGN_IN": {
      // If they were mid-booking when asked to join, carry them straight in.
      const resumeId = state.pendingBookItemId;
      if (resumeId !== null) {
        return {
          ...state,
          session: { displayName: action.displayName },
          pendingBookItemId: null,
          route: { name: "booking", itemId: resumeId, step: "dates" },
          draftRange: null,
        };
      }
      return { ...state, session: { displayName: action.displayName } };
    }

    case "SIGN_OUT":
      return { ...state, session: { displayName: null } };

    case "CANCEL_SIGNUP":
      return { ...state, pendingBookItemId: null };

    default: {
      const _exhaustive: never = action;
      throw new Error(`Unhandled action: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
