/* ============================================================
 * Header — brand + auth affordance.
 * A guest sees "Sign in"; a signed-in neighbour sees their name
 * and can sign out. No dark patterns, no forced wall.
 * ============================================================ */

import type { Session } from "../state/appState.ts";
import { Logo, Button, Avatar } from "./ui.tsx";

export function Header({
  session,
  onHome,
  onSignIn,
  onSignOut,
}: {
  session: Session;
  onHome: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo onClick={onHome} />
        <nav className="header-nav">
          {session.displayName === null ? (
            <Button variant="ghost" onClick={onSignIn}>
              Sign in
            </Button>
          ) : (
            <div className="header-user">
              <Avatar name={session.displayName} />
              <span className="header-user-name">{session.displayName}</span>
              <button className="linklike" onClick={onSignOut}>
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
