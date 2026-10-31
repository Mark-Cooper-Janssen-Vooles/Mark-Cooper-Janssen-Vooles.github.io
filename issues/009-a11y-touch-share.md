---
id: 009
title: Reduced motion, touch fallback and share preview
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [005, 007, 008]
created: 2026-10-30
---

# 009: Reduced motion, touch fallback and share preview

**What to build:** The page behaves well beyond a mouse on a desktop, and looks good when shared.

**Blocked by:** 005, 007, 008

**Status:** done

- [x] With `prefers-reduced-motion`, dispersal and the letter flip are off, the intro is a plain fade, and scratching and healing still work
- [x] Touch or coarse-pointer devices get the static dash field, name and icons, with no interaction
- [x] The name is the main heading; the canvas has a text description of the artwork; the icons show visible focus
- [x] An Open Graph image (a screenshot of the dash render) and the title "Mark Janssen-Vooles" are in the page head
- [x] The Playwright smoke test is extended: the letter does not flip under emulated reduced motion, and a touch-emulated viewport gets the static fallback

## Resolution

Reduced motion turns off dispersal, heal drift and the letter flip, and the intro is a plain fade; scratching and healing still work (verified in a reduced-motion browser run). Coarse-pointer devices get the static field with no handlers. The name is the h1, the stage has a text description, and the links show a visible focus ring. `npm run capture-og` produced `public/og.png`, referenced in the page head with the title.

Not committed yet: the folder is not a git repository.
