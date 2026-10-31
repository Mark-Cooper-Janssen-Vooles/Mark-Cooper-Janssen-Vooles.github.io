---
id: 027
title: Render only when something changes
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 027: Render only when something changes

**What to build:** The canvas stops redrawing when nothing is moving, to save battery.

**Status:** done

- [x] The canvas renders on demand
- [x] A frame is requested on pointer input, during the intro, while hover is easing in or out, and while any area is scratched or healing
- [x] Once the intro is done, the pointer is still or outside, and healing has finished, no frames are drawn
- [x] Frame delta is clamped so the first frame after an idle gap doesn't jump

## Resolution

The canvas uses `frameloop="demand"`. Pointer handlers wake it; frames continue only during the intro, while hover or the smoothed pointer is settling, and while healing changes the mask. A timeout wakes it for the start of healing. Delta is clamped to 1/30s. Measured: 0 WebGL draw calls over 2s when idle, with and without the pointer resting on the image.

Not committed yet: the folder is not a git repository.
