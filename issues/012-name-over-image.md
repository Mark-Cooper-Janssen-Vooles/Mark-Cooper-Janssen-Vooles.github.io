---
id: 012
title: Name strip overlaid on the image
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 012: Name strip overlaid on the image

**What to build:** The dash field fills the whole viewport, and the name sits on top of it at the bottom, the same way the icons sit over it at the top.

**Supersedes:** spec 001 user story 21 (the name sits below the image). The owner agreed this change.

**Status:** done

- [x] The image area fills the full viewport, still with no scroll
- [x] The name is positioned over the bottom of the image with the same inset as the icons
- [x] Hover dispersal and scratching keep working when the pointer is over the name; letters still flip
- [x] Clicking the icon links still opens them, and does not start a scratch
- [x] Screen readers still get the heading, the links and the artwork description

## Resolution

The stage fills the viewport and holds the name, tagline and links as overlays, so pointer events from them bubble to the stage handlers. Pointer-down on a link doesn't start a scratch. The artwork description moved to an inner `role="img"` element so it no longer hides the overlays from screen readers.

Not committed yet: the folder is not a git repository.
