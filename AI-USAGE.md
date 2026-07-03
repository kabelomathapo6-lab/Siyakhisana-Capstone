# AI Usage Log

I used AI throughout this build as a fast collaborator, but the decisions, the scoping, and the
judgement calls were mine — and in the places that mattered most I overrode what the AI first
suggested. Here are three substantial moments, including one where its first instinct was wrong.

## Entry 1 — Scoping the build against the founder's wishlist

**What I was doing:** Deciding which of Thabo's roughly twelve requested features to actually
build, and which to cut or refuse.

**The prompt I used (roughly):** I asked for help working out a sensible scope given the brief
says to scope ruthlessly and to watch for bad ideas.

**What the AI gave back:** It produced its own feature list quickly.

**What I did with it:** I pushed back. I argued that my list made more sense than the AI's,
because mine was thought-driven and built around actually understanding the brief, not just a
generic "build these" list. The concrete difference: the generic instinct treats the brief as a
feature count — build as much as possible. My call was to *refuse* the dark patterns (the fake "3
people looking" urgency and the forced sign-up wall) and instead ship four honest features done
well. That refusal is the whole point of the brief, and it's the part a generic list misses. In
the end I went with my list, and my list is what made it through — the AI didn't decide the scope,
I did, and I can defend every inclusion and every cut.

## Entry 2 — The auth flow and state architecture

**What I was doing:** Deciding how login should work and how app state should be structured.

**What the AI could have defaulted to:** The brief literally asks to force sign-up before the user
sees anything, and an AI told to "implement the brief" would build exactly that.

**The call I made instead:** It was my decision *not* to put the user into a hard login first. I
chose to let people see the products and services first, and only then bring in the login at the
point of booking. The reasoning is in my Founder Response — a hard wall bounces users before
they've seen any value. I then had the state built as a useReducer machine so that this flow (guest
browses, tries to book, gets asked to join, and is carried back to the exact item they wanted) is
handled in one place and stays consistent. The architecture served my product decision, not the
other way around.

## Entry 3 — The AI's design default (the moment it was confidently wrong)

**What I was doing:** Choosing the visual identity.

**What happened:** When asked for a "warm, community" design, the default that came back was the
common AI-generated look — a cream / off-white background with a terracotta or clay accent.

**Why that was wrong for this project:** That palette simply doesn't represent the branding I want
to put out for Thabo. It's the safe default that shows up on almost every AI-generated design
regardless of the brief, so it would have made Siyakhisana look like a template instead of a real
brand. More importantly, it doesn't carry the ambition. I want Siyakhisana to read as a startup
that is going to scale into a luxury brand — one that competes on a bigger stage in the near
future. So I pushed back and steered it to a deep indigo with a marigold-gold accent: a palette
that gives an essence of calmness, of growth, and of a premium brand with room to grow into itself.

**How I caught it:** I didn't accept the first design just because it looked fine. I judged it
against what the brand is actually trying to become, saw that the default said "generic template"
rather than "future luxury brand", and made the call to change direction. That judgement — not the
tool's first answer — is what set the identity.
