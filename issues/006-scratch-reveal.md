---
id: 006
title: Scratch to reveal the photo
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [004]
created: 2026-10-30
---

# 006: Scratch to reveal the photo

**What to build:** Click-dragging rubs dashes off with a soft circular brush, like a scratchie. Underneath is the photo, with mild pixelation, a faint scanline and a subtle cool grade (partly desaturated, shadows towards navy). The whole image can be scratched clear. It doesn't heal yet.

**Blocked by:** 004

**Status:** done

- [x] A pure scratch-mask model: a grid of reveal values from 0 to 1, and a scratch at a point and radius applies a soft brush
- [x] Unit tests: a scratch raises values inside the radius and leaves values outside untouched; repeated scratches saturate at 1
- [x] The mask is uploaded as a data texture only when it changes; dashes are hidden where the area is revealed
- [x] The photo layer shows only through revealed areas, with pixel-block size, scanline strength and grade strength as tuning values
- [x] Scratching follows the pointer path smoothly, with no gaps on fast drags
- [x] Scratching is only active once the intro has finished

## Resolution

`src/core/revealMask.ts` applies a soft circular brush, and strokes are stamped every quarter radius so fast drags leave no gaps. The mask uploads as an R8 data texture only when its version changes. The photo layer pixelates, adds a scanline and applies a cool grade in the shader, all tunable.

Not committed yet: the folder is not a git repository.
