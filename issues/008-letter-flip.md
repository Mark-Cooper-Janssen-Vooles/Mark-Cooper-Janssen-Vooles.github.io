---
id: 008
title: Name letter flip on hover
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [003]
created: 2026-10-30
---

# 008: Name letter flip on hover

**What to build:** Hovering a letter of "MARK JANSSEN-VOOLES" makes it flip once around its vertical axis, like a coin.

**Blocked by:** 003

**Status:** done

- [x] The name is split into per-letter elements; screen readers still read it as one name
- [x] A plain CSS `rotateY` 360° flip of about 600ms with ease-out; no GSAP
- [x] Re-hovering mid-flip is ignored, so sweeping across the name looks smooth
- [x] The Playwright smoke test checks that a hovered letter starts its flip

## Resolution

Per-letter spans under an `aria-hidden` wrapper, with a visually hidden "Mark Janssen-Vooles" for screen readers. CSS `rotateY` 360deg over 600ms ease-out; re-hovering mid-flip is a no-op until `animationend`.

Not committed yet: the folder is not a git repository.
