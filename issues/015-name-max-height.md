---
id: 015
title: Cap the name at 112px letter height
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [012]
created: 2026-10-30
---

# 015: Cap the name at 112px letter height

**What to build:** The name's capital letters never exceed 112px tall. On windows wide enough to reach the cap, the name stops growing and stays left-aligned.

**Status:** done

- [x] Below the cap, the name fills the width between the insets
- [x] Capital letter height is at most 112px at any window width
- [x] Above the cap, the name is left-aligned at the inset
- [x] The cap and inset are tuning values
- [x] The Playwright smoke test checks a wide window: capped size, left-aligned

## Resolution

Font size is `min((100vw - 2 x inset) / name.widthEm, maxCapHeightPx / capHeightEm)`, left-aligned at the inset. Capitals reach 112px at about 1900px wide. Smoke test measures the cap height at 2560px.

Not committed yet: the folder is not a git repository.
