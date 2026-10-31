---
id: 028
title: Hover dispersion uses the scratch brush shape
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 028: Hover dispersion uses the scratch brush shape

**What to build:** The hover dispersion and photo peek take exactly the same jagged plus shape as the scratch brush. The brush itself gets 1.5x bigger and a bit thinner.

**Supersedes:** the separate smooth crosshair dispersion shape in 026.

**Status:** done

- [x] The brush radius goes from 42px to 63px, and its arm width from 0.3 to 0.22 of the radius
- [x] The brush falloff lives in one shared function used by both scratching and hover
- [x] Each frame the pointer moves, a hover mask is stamped with the brush at the smoothed pointer and uploaded as a texture
- [x] Dashes are pushed away from the arm they sit on, scaled by the hover mask; the photo peek uses the hover mask directly
- [x] Unit test: a hover stamp matches a single full-strength scratch at the same point

## Resolution

The brush moved to `src/core/brush.ts` (`forEachBrushCell`, `stampBrush`), shared by `RevealMask.scratch` and the hover stamp. The scene stamps a hover mask at the smoothed pointer when it moves and uploads it as a second R8 texture. Dashes are pushed off the arm they sit on by `dispersal.strengthPx` x the stamp, and the photo peek runs the stamp through the same strength and reveal curve as a single click, so the two match. Brush: 63px, arm width 0.22. The radial glow is unchanged.

Not committed yet: the folder is not a git repository.
