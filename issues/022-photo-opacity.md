---
id: 022
title: Same photo opacity for hover and scratch
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 022: Same photo opacity for hover and scratch

**What to build:** The photo shows at 45% opacity both in the hover peek (up from 25%) and in scratched areas (down from 100%), so hovering and scratching look the same.

**Supersedes:** 011's 25% peek, and the full-strength scratch reveal.

**Status:** done

- [x] One tuning value, `photo.opacity`, set to 0.45, drives both the peek and scratched areas

## Resolution

`photo.opacity` (0.45) scales both the hover peek and scratched areas in the photo shader.

Not committed yet: the folder is not a git repository.
