/* ============================================================
 * App — the shell. Owns the reducer, loads items once, and maps
 * the current route to a screen. Because navigation is data (a
 * Route union in the reducer), rendering is just a switch — no
 * router library needed for four screens, and the choice is
 * defended in the Decision Log.
 * ============================================================ */

import { useReducer } from "react";
import { reducer, initialState } from "./state/appState.ts";
import { useItems, findItem } from "./lib/useItems.ts";
import { Header } from "./components/Header.tsx";
import { SignUpPrompt } from "./components/SignUpPrompt.tsx";
import { BrowseScreen } from "./screens/BrowseScreen.tsx";
import { DetailScreen } from "./screens/DetailScreen.tsx";
import { BookingDates, BookingConfirm } from "./screens/BookingScreen.tsx";
import { BookedScreen } from "./screens/BookedScreen.tsx";

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const items = useItems();

  function itemFor(id: string) {
    return items.status === "ready" ? findItem(items.data, id) : null;
  }

  const { route } = state;

  return (
    <div className="app">
      <Header
        session={state.session}
        onHome={() => dispatch({ type: "GO_BROWSE" })}
        onSignIn={() => dispatch({ type: "SIGN_IN", displayName: "Neighbour" })}
        onSignOut={() => dispatch({ type: "SIGN_OUT" })}
      />

      <main className="app-main">
        {route.name === "browse" && (
          <BrowseScreen items={items} onOpen={(id) => dispatch({ type: "OPEN_ITEM", itemId: id })} />
        )}

        {route.name === "detail" &&
          (() => {
            const item = itemFor(route.itemId);
            if (!item) return <NotFound onBack={() => dispatch({ type: "GO_BROWSE" })} />;
            return (
              <DetailScreen
                item={item}
                onBack={() => dispatch({ type: "GO_BROWSE" })}
                onBook={(it) => dispatch({ type: "START_BOOKING", item: it })}
              />
            );
          })()}

        {route.name === "booking" &&
          (() => {
            const item = itemFor(route.itemId);
            if (!item) return <NotFound onBack={() => dispatch({ type: "GO_BROWSE" })} />;
            if (route.step === "dates") {
              return (
                <BookingDates
                  item={item}
                  initial={state.draftRange}
                  onBack={() => dispatch({ type: "OPEN_ITEM", itemId: item.id })}
                  onNext={(range) => {
                    dispatch({ type: "SET_RANGE", range });
                    dispatch({ type: "GO_CONFIRM", itemId: item.id });
                  }}
                />
              );
            }
            if (state.draftRange === null) {
              return (
                <NotFound
                  onBack={() => dispatch({ type: "OPEN_ITEM", itemId: item.id })}
                  label="Start your booking again"
                />
              );
            }
            const range = state.draftRange;
            return (
              <BookingConfirm
                item={item}
                range={range}
                onBack={() => dispatch({ type: "START_BOOKING", item })}
                onConfirm={() => dispatch({ type: "CONFIRM_BOOKING", itemId: item.id, range })}
              />
            );
          })()}

        {route.name === "booked" &&
          (() => {
            const item = itemFor(route.itemId);
            if (!item) return <NotFound onBack={() => dispatch({ type: "GO_BROWSE" })} />;
            return (
              <BookedScreen item={item} range={route.range} onDone={() => dispatch({ type: "GO_BROWSE" })} />
            );
          })()}
      </main>

      {state.pendingBookItemId !== null && (
        <SignUpPrompt
          onJoin={(name) => dispatch({ type: "SIGN_IN", displayName: name })}
          onCancel={() => dispatch({ type: "CANCEL_SIGNUP" })}
        />
      )}

      <footer className="site-footer">
        <p>Siyakhisana · Building together · A neighbourhood lending community</p>
        <p className="footer-fine">Made for the Founder Capstone. Mock data, no real payments.</p>
      </footer>
    </div>
  );
}

function NotFound({ onBack, label = "Back to browse" }: { onBack: () => void; label?: string }) {
  return (
    <div className="state-block">
      <h2>We lost that one</h2>
      <p>That item isn't here anymore.</p>
      <button className="btn btn-ghost" onClick={onBack}>
        {label}
      </button>
    </div>
  );
}
