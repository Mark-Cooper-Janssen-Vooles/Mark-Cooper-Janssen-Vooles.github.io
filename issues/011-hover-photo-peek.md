---
id: 011
title: Faint photo peek under the cursor
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 011: Faint photo peek under the cursor

**What to build:** When hover spreads the dashes, the gap under the cursor shows the photo at low opacity instead of bare charcoal. Scratching remains the only way to see the photo at full strength.

**Supersedes:** spec 001 user story 10 and the out-of-scope "hover peek" item. The owner agreed this change.

**Status:** done

- [x] The photo layer shows at a low, tunable opacity within the dispersal radius while the pointer hovers, fading with the same falloff
- [x] The peek fades in and out with hover, so it is gone when the pointer leaves
- [x] Scratched areas still show the photo at full strength

## Resolution

The photo shader blends in the photo at `photo.hoverPeekOpacity` (0.25) within the dispersal radius, scaled by the same hover fade as the dashes. Both materials are now transparent, so `renderOrder` keeps the photo under the dashes.

Not committed yet: the folder is not a git repository.
