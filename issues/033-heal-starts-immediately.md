---
id: 033
title: Scratched spots visibly start healing within 1s
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-11-02
---

# 033: Scratched spots visibly start healing within 1s

**What to build:** Healing starts as soon as a spot is scratched, and the first dashes are visibly back within 0.5–1s.

**Supersedes:** the 2s delay in 032.

**Status:** done

- [x] `heal.delayMs` is 0
- [x] The heal curve drops fast at first, so a fully scratched spot falls below the dash-reappear threshold (0.55) between 0.5s and 1s after scratching
- [x] A unit test pins that window using the real tuning values

## Resolution

`heal.delayMs` is 0 and the ease is ease-out quint over 8s, so a fully scratched spot drops below 0.55 at about 0.9s (0.72 at 0.5s, 0.51 at 1s) and looks fully healed by about 3.5s. `src/core/healTiming.test.ts` pins the 0.5-1s window against the real tuning. In the browser, with the button held, the area was well into healing at the first sample (1.6s) and gone by about 5s.
