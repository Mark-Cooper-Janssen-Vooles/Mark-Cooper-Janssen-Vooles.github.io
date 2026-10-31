---
id: 005
title: Hover dispersal and glow
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [004]
created: 2026-10-30
---

# 005: Hover dispersal and glow

**What to build:** Moving the cursor pushes nearby dashes outward with a smooth falloff, and a soft lighter circle sits under the cursor. Dashes settle back when the cursor leaves. Hovering never reveals the photo.

**Blocked by:** 004

**Status:** done

- [x] The vertex shader pushes dashes away from the pointer, with tunable radius and strength
- [x] The dashes return smoothly to their rest positions when the pointer moves away or leaves the canvas
- [x] A soft glow brightens the dashes under the pointer, with a tunable radius
- [x] Hover is only active once the intro has finished
- [ ] It holds about 60fps on Mark's laptop at full-screen desktop resolution (checked by eye or with the frame meter)

## Resolution

The vertex shader pushes dashes away from a smoothed pointer with a smoothstep falloff; hover strength eases in and out so dashes settle when the pointer leaves. Glow brightens dashes under the pointer. Hover only starts after the intro. The 60fps check on Mark's laptop is still to do by eye.

Not committed yet: the folder is not a git repository.
