---
id: 020
title: Slower healing that fills from the outside in
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 020: Slower healing that fills from the outside in

**What to build:** The heal takes 8s instead of 2s, after the same 4s wait. Each scratched area fills from its edges towards its centre. Earlier strokes still start healing before later ones, so the two orderings combine.

**Supersedes:** the 2s duration and the time-only ordering in 017.

**Status:** done

- [x] Heal duration is 8s; delay stays 4s
- [x] At heal start, each cell's depth is its distance to the nearest unscratched cell, with the area outside the grid counting as unscratched
- [x] Heal order blends scratch time and depth with tunable weights; when only one applies (a single stroke, say), it uses that one alone
- [x] Unit tests: a patch's edge heals before its centre; an earlier patch still heals before a later one; everything is back to 0 after delay plus duration

## Resolution

Heal duration is 8s after the 4s wait. At heal start the mask measures each scratched cell's chamfer distance to the nearest unscratched cell (outside the grid counts as unscratched), normalised within each connected scratched area, and blends it with scratch time using `heal.timeWeight` and `heal.depthWeight` (1 and 1). Measured in the browser: unchanged at 3.8s, edges visibly drifting back first, visually healed by about 10s and fully by 12s.

Not committed yet: the folder is not a git repository.
