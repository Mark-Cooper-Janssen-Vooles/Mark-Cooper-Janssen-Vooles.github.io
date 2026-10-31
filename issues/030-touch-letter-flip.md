---
id: 030
title: Flip name letters under a finger
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [029]
created: 2026-10-31
---

# 030: Flip name letters under a finger

**What to build:** On touch screens, a finger that touches or drags across a letter of the name flips it, the same way hovering does with a mouse. Scratching keeps working during the same drag.

**Supersedes:** the "letter flip stays off on touch" note in 029.

**Status:** done

- [x] A touch that starts on, or drags across, a letter flips it once; re-entering mid-flip is ignored as on desktop
- [x] The drag still scratches the dashes and ends cleanly when the finger lifts
- [x] Reduced motion still turns the flip off on every device
- [x] The Playwright touch test checks that a finger dragged across the name flips a letter

## Resolution

Letters flip on `pointerenter` instead of `mouseenter`, and the flip is now off only under reduced motion. Touch pointers are no longer captured: the stage releases the implicit touch capture on pointerdown, so moves are hit-tested against whatever is under the finger and still bubble to the stage for scratching. A touch scratch ends on pointerup or pointercancel; lost capture only ends mouse and pen scratches. The Playwright touch test drags a finger across the first three letters and checks the third flips.
