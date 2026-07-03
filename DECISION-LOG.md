# Decision Log

## Decision: Reshape "force signup" into signup-at-booking
- Context: Thabo wanted a hard wall — no browsing until you hand over an email.
- Options I considered: (a) build the wall as asked; (b) no auth at all; (c) let people
  browse freely and only ask for a name at the moment they book.
- What I chose and why: You want the product in front of the user before you ask them to commit.
  When someone can already see the drill or the ladder, they've mentally decided they'd use it, and
  then signing up feels natural. A hard wall kills that — an older neighbour who's forced to hand
  over an email before seeing anything just leaves, because nothing has drawn her in yet. Gating the
  BOOKING action instead of the browse screen still captures the users who matter (the ones actually
  booking) without bouncing everyone at the door.
- What I gave up: Fewer captured emails up front, since guests can browse without signing up. That's
  the intended trade: a smaller list of genuinely interested people beats a bigger list of addresses
  from users who never came back.

## Decision: Model app state as a useReducer state machine
- Context: The app has navigation, auth, and an in-progress booking that spans two screens.
  That state has to stay consistent as the founder changes his mind.
- Options I considered: (a) scattered useState across components; (b) a single useReducer with
  named actions and a typed Route union; (c) a state library like Redux/Zustand.
- What I chose and why: A useReducer state machine keeps every state change in one place with
  named actions. So when Thabo inevitably pivots something — "bookings by the hour now", "add a
  step to the flow" — the change lands in one file instead of being scattered across ten
  components. It also builds directly on the discriminated-union reducer pattern I used in the
  previous assessment, including a `never` exhaustiveness guard, so if a new action is ever added
  without being handled, the compiler refuses to build rather than failing silently at runtime.
  A full state library like Redux would be overkill for an app this size.
- What I gave up: A bit more upfront structure than scattering useState around — you have to
  define the action types and the reducer before anything moves. For a trivial app that would be
  overhead; for one with a multi-step flow and auth, it pays for itself immediately.

## Decision: No router library — navigation is data
- Context: Four screens: browse, detail, booking, booked.
- Options I considered: (a) React Router; (b) a Route union inside the reducer rendered by a switch.
- What I chose and why: For four screens with no need for real shareable URLs yet, pulling in
  React Router would be over-engineering — an extra dependency and more moving parts than the
  problem calls for. Instead I modelled navigation as a typed Route union inside the same reducer
  that runs the rest of the app, so the whole app has one consistent state pattern instead of two.
  The engineering judgement here is matching the tool to the size of the problem, not reaching for
  a library by reflex.
- What I gave up: Real URLs. Without a router you can't deep-link straight to one item, and the
  browser back button doesn't move between screens. For an MVP where the goal is proving the flow
  works, that's an acceptable trade — but it's the first thing I'd add when the app needs sharing
  and proper history.

## Decision: Keep the browse engine (search/filter/sort) as ONE pure function
- Context: Filtering logic could live inside the component, tangled with rendering.
- Options I considered: (a) filter inline in the component with useState; (b) a pure runBrowse()
  function that takes items + a query object and returns results.
- What I chose and why: Keeping the browse engine as its own pure function means it can be tested
  on its own, in isolation, without touching or complicating the rest of the system. It also means
  I can change how search or sorting works — an individual change — without rippling edits through
  the components. The logic has one home, and the UI just calls it.
- What I gave up: A little indirection and one extra file, versus filtering inline where it's used.
  For logic this central, having a single well-defined place to change it is worth the extra hop.

## Decision: Model the "messy data" cases as first-class UI states
- Context: The API contract has null ratings, empty photos, null distance, paused/removed items.
- Options I considered: (a) assume happy-path data and let blanks/nulls render; (b) handle every
  awkward case explicitly with dedicated formatters and UI ("New neighbour", "No photo yet").
- What I chose and why: The data comes from an API contract I don't control, and it's deliberately
  messy — null ratings, missing photos, paused listings. If I only build for the clean happy path,
  the app breaks or shows "null" the first time a real awkward listing arrives, and in the real world
  those awkward cases are guaranteed to show up. So I designed for them on purpose up front —
  "New neighbour" instead of a blank rating, "No photo yet" instead of a broken image. Anyone can
  render clean data; handling the messy data gracefully is the actual craft.
- What I gave up: More code and a set of small formatters to maintain, rather than assuming tidy
  data. That's a fair price — the alternative is a UI that falls over on exactly the real-world data
  it's meant to handle.

## Decision: Model async loading as a Loadable<T> union
- Context: Data comes from a fake async API that could be loading, failed, or ready.
- Options I considered: (a) isLoading + error + data as three separate booleans; (b) a single
  discriminated union with status "loading" | "error" | "ready".
- What I chose and why: With three separate booleans (isLoading, hasError, data) you can
  accidentally land in nonsense states — "loading AND error at the same time", or "ready but no
  data". Modelling it as ONE union that is either loading, or error, or ready means those
  contradictory combinations can't even be written; the type system won't allow it. Every screen is
  then forced to handle each real state, which is exactly how a real API integration should behave.
- What I gave up: Slightly more verbose reads at the call site — you check `status` and narrow —
  versus a quick `if (isLoading)`. In exchange, whole categories of bug become impossible.

## Decision: Money as integer cents, formatted at the edge
- Context: The Price type stores amountCents. Money + floats = rounding bugs.
- Options I considered: (a) convert to rand floats early and do math on them; (b) keep integer
  cents everywhere and only format to "R50/day" at render time.
- What I chose and why: Storing money as integer cents gives a simple, reliable foundation, and
  Rands are just a formatting step at the edge when a price is actually shown. Doing float maths on
  Rands early invites rounding bugs (0.1 + 0.2 problems); keeping whole cents until the last moment
  avoids that entirely and still lets any screen display the price however it needs to.
- What I gave up: A formatting call every time a price is rendered, instead of storing a
  ready-to-show string. That's a tiny, worthwhile cost for never having money-rounding bugs.

## Decision: Visual identity — indigo + marigold, not the safe default
- Context: 25% of the mark is a distinctive identity; the founder said "make it look premium".
- Options I considered: (a) a clean neutral/cream template look; (b) a Highveld-evening indigo
  with a marigold "hustle" accent, grounded in a South African community feeling.
- What I chose and why: Indigo paired with a marigold gold reads as a brand that intends to grow
  from a startup into something premium. The combination feels trustworthy, safe and calm — the deep
  indigo gives credibility and the gold gives warmth, and together they're genuinely easy on the eye.
  That matters because the ambition for Siyakhisana isn't to stay a small neighbourhood tool — it's
  to scale into a business that can compete on a bigger, even global stage, and the identity should
  already carry that intent. I deliberately avoided the safe cream-and-terracotta look because it's
  the default AI-generated palette; it shows up on every brief regardless of subject, so it would
  have made Siyakhisana look like every other template instead of a brand with its own point of view.
- What I gave up: A bolder, more experimental direction, and some time spent tuning the indigo/gold
  contrast so text stays readable and accessible. I chose a palette with room to grow into a premium
  brand over a louder one that might not age as well.

