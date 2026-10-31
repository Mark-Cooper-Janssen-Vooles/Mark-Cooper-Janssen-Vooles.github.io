---
id: 029
title: Touch to scratch on mobile
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-31
---

# 029: Touch to scratch on mobile

**What to build:** On touch screens, dragging a finger scratches the dashes away exactly as click-dragging does on desktop, and the same healing follows.

**Supersedes:** spec 001 user story 32 and the out-of-scope "touch scratching" item, and the static touch fallback from 009.

**Status:** done

- [x] Touch and coarse-pointer devices get the same scratch interaction as a mouse: finger down starts a scratch, dragging extends it, lifting ends it and healing starts
- [x] Touch never triggers the hover dispersion, glow or peek, before, during or after a drag
- [x] Dragging on the artwork doesn't scroll or zoom the page
- [x] The artwork's text description invites scratching in wording that suits both mouse and touch
- [x] The Playwright touch test checks that a touch drag starts and ends a scratch

## Resolution

The stage no longer has a static touch mode: every device gets the scratch handlers once the intro finishes. Touch pointers never set `pointer.inside`, so hover dispersion, glow and peek never appear for a finger. `touch-action: none` on the interactive stage stops the drag from scrolling or zooming. The description now says "Drag across it". The stage exposes `data-scratching`, and the Playwright touch test drives a real CDP touch drag on an emulated Pixel 7. The letter flip stays off on touch.
