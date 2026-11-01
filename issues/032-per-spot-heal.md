---
id: 032
title: Each spot heals 2s after it was scratched
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-11-02
---

# 032: Each spot heals 2s after it was scratched

**What to build:** Every scratched spot starts healing 2s after it was last scratched, whether or not the button or finger is still down, and fills back over 8s. Strokes therefore come back in the order they were drawn.

**Supersedes:** the global heal pause while scratching (spec 001 user story 18, 007, 017), the edges-first ordering (020), and the 1s delay (023).

**Status:** done

- [x] Each cell records its own scratch time and peak value; it holds for 2s, then eases back to 0 over 8s
- [x] Holding the button or finger down doesn't pause healing
- [x] Re-scratching a spot restarts that spot's timer
- [x] The scene wakes for the first pending heal and renders only while a spot is healing
- [x] Unit tests: no healing before 2s; fully healed after 10s; an earlier spot heals while a later one is still waiting; re-scratching restarts the timer

## Resolution

`RevealMask` stores each cell's peak value and scratch time; `step` holds a cell for `heal.delayMs` (2000), then eases it to 0 over `heal.durationMs` (8000). The global pause, `beginScratch`/`endScratch`, and the depth/time stagger are gone. `healStartsAt` reports the earliest pending heal so on-demand rendering wakes for it. Measured in the browser with the button held throughout: unchanged at 1.6s, visibly healing by 3.1s, fully back by about 9s.
