---
id: 021
title: Move the tagline next to the icons, top-right
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 021: Move the tagline next to the icons, top-right

**What to build:** "FULL STACK SOFTWARE ENGINEER" moves to the top-right, in one row with the icons: tagline, then LinkedIn, then GitHub.

**Supersedes:** the top-left placement in 014.

**Status:** done

- [x] The tagline, LinkedIn and GitHub sit in one right-aligned row at the top inset, vertically aligned
- [x] The Playwright smoke test checks the tagline sits to the left of the LinkedIn icon

## Resolution

The tagline and icons share one right-aligned flex row at the top inset. The tagline doesn't wrap, and shrinks on narrow screens. Smoke test checks it sits left of LinkedIn, in the right half, centred on the icons.

Not committed yet: the folder is not a git repository.
