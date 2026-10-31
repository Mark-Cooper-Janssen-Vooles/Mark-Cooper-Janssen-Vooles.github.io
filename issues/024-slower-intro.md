---
id: 024
title: Slow the dither-in intro by 4x
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 024: Slow the dither-in intro by 4x

**What to build:** On first load the dashes resolve in over 3.2s instead of 800ms.

**Supersedes:** the 800ms intro in 004.

**Status:** done

- [x] `intro.durationMs` is 3200

## Resolution

`intro.durationMs` is 3200. The Playwright expect timeout went to 10s to cover the longer intro under software rendering.

Not committed yet: the folder is not a git repository.
