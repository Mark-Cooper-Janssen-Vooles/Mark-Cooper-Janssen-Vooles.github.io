---
id: 023
title: Start healing 1s after scratching stops
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 023: Start healing 1s after scratching stops

**What to build:** Healing starts 1s after scratching stops instead of 4s. The 8s fill stays the same.

**Supersedes:** the 4s delay in 017 and 020.

**Status:** done

- [x] `heal.delayMs` is 1000

## Resolution

`heal.delayMs` is 1000; the 8s fill is unchanged. Measured in the browser: healing visible by 1.8s after release, visually back by about 6-7s, fully at 9s.

Not committed yet: the folder is not a git repository.
