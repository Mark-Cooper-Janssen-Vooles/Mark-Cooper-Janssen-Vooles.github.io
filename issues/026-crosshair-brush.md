---
id: 026
title: Crosshair-shaped dispersion and scratch brush
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [025]
created: 2026-10-30
---

# 026: Crosshair-shaped dispersion and scratch brush

**What to build:** The hover and scratch effects match the crosshair cursor instead of a circle:
- hover dispersion opens a plus-shaped gap, with dashes pushed away from each arm;
- the scratch brush is a plus shape with jagged edges;
- dispersion fades out while the button is held, so scratching isn't fighting the hover.

**Supersedes:** the circular dispersion in 005 and circular brush in 006.

**Status:** done

- [x] Dispersion pushes dashes perpendicular to the horizontal and vertical arms through the pointer, with tunable arm length, arm width and strength
- [x] The hover photo peek follows the same plus shape
- [x] The scratch brush is a plus shape; its edges are jagged with deterministic per-cell noise and a tunable amount
- [x] Dispersion and peek fade out while the pointer is pressed, and come back on release
- [x] Unit tests: the brush reveals cells along both arms and leaves diagonal cells inside the radius untouched; the jagged edge is deterministic

## Resolution

A shared GLSL `crosshair()` gives per-arm weights; the dash vertex shader pushes dashes perpendicular to each arm, and the photo peek uses the same shape. The mask brush is a plus (`scratch.armWidth` 0.3 of the radius) with deterministic per-cell hash noise jagging arm length and width (`scratch.jagged` 0.6). Hover fades out while the pointer is pressed.

Not committed yet: the folder is not a git repository.
