---
id: 007
title: Healing of scratched areas
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [006]
created: 2026-10-30
---

# 007: Healing of scratched areas

**What to build:** About 4s after the visitor stops scratching, scratched areas heal over about 15s. The dashes drift back into position from a slight offset rather than popping in. Healing pauses while scratching.

**Blocked by:** 006

**Status:** done

- [x] The mask model gains a time step that takes explicit time, so tests are deterministic
- [x] Unit tests: no healing before the delay; values reach 0 after the delay plus the duration; healing pauses while scratching is active and restarts its delay afterwards
- [x] Healing dashes drift back to their rest positions, with the offset proportional to heal progress
- [x] Heal delay, duration and easing are tuning values

## Resolution

`RevealMask.step(now)` heals from a snapshot after the delay with the configured easing, pauses while scratching and restarts its delay afterwards. Dashes drift back by an offset proportional to the remaining reveal value.

Not committed yet: the folder is not a git repository.
