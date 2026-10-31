---
id: 025
title: Full-opacity photo under a 20% black layer
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 025: Full-opacity photo under a 20% black layer

**What to build:** The photo is drawn at full opacity in both the hover peek and scratched areas, darkened by a 20% black layer, so hovering and scratching look identical.

**Supersedes:** the 45% `photo.opacity` from 022.

**Status:** done

- [x] The peek and scratched areas share one alpha curve, at full strength where fully revealed
- [x] A `photo.darken` tuning value (0.2) mixes the photo towards black in the shader

## Resolution

The peek and scratched areas share one full-strength alpha curve, and `photo.darken` (0.2) multiplies the photo colour by 0.8.

Not committed yet: the folder is not a git repository.
