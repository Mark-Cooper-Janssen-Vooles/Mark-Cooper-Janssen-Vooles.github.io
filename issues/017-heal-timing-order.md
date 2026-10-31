---
id: 017
title: Faster healing, oldest scratch first
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 017: Faster healing, oldest scratch first

**What to build:** Healing starts 4s after scratching stops and finishes 2s later. Within that window, the areas scratched first heal first, so the stroke unwinds in the order it was drawn. Healing still pauses while the button is held.

**Supersedes:** spec 001's 15s heal duration. Healing used an ease-in-out curve that showed no visible change for the first several seconds; it now starts visibly at the 4s mark.

**Status:** done

- [x] Heal delay is 4s and duration 2s; easing starts fast so the return is visible as soon as healing starts
- [x] The mask records when each cell was last scratched; during healing, earlier cells heal before later ones, and everything is healed by delay plus duration
- [x] Healing still pauses while scratching is active and restarts its delay afterwards
- [x] Unit tests: an earlier-scratched cell has healed more than a later one partway through; all cells reach 0 after delay plus duration
- [x] Delay, duration, easing and stagger are tuning values

## Resolution

Delay 4s, duration 2s, ease-out cubic. The mask records each cell's scratch time; at heal start the scratched cells are ordered by that time and `heal.stagger` (1) spreads them across the window. Healing still pauses while scratching. Measured in the browser: unchanged at 3.9s after release, fully healed by 7.7s (2s sampling). The old ease-in-out curve plus the dash visibility threshold explained the 12-13s you saw.

Not committed yet: the folder is not a git repository.
