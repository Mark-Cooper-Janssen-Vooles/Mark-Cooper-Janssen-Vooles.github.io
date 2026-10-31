---
id: 004
title: Static dash field with dither-in intro
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [003]
created: 2026-10-30
---

# 004: Static dash field with dither-in intro

**What to build:** The photo is replaced on screen by the dash field: short horizontal dashes ramping from deep navy to pale blue on warm charcoal, with outlines emphasised. On load, the dashes dither in from blank charcoal.

**Blocked by:** 003

**Status:** done

- [x] A pure dash-field generator turns pixel data plus grid size into dash instances (position, tone, kept or dropped); tone combines luminance with an edge term; an ordered dither picks the kept cells
- [x] Unit tests cover the generator: uniform input gives uniform tone, brighter gives higher tone, hard edges score higher, output matches the grid size, and the dither keep-ratio is predictable
- [x] Dashes render as one instanced mesh; the fragment shader maps tone to the navy-to-pale-blue ramp
- [x] The dash field stays cover-fit and anchored on the focal point, and rebuilds when the window is resized or the aspect ratio changes significantly
- [x] Intro: blank charcoal, then the dashes resolve in through the dither pattern over about 800ms; a faint dash-style pulse shows if preparation takes longer than about 300ms
- [x] The figure, chair, monitors, lamp and window are clearly readable (checked by eye)
- [x] Grid density, palette and intro duration are tuning values

## Resolution

`src/core/dashField.ts` scores cells by luminance (with a gamma) plus a neighbour edge term and keeps cells with a 4x4 Bayer dither. Dashes render as one instanced geometry; intro resolves them in by dither threshold over 800ms with a pulse after 300ms. The field is rebuilt on any debounced resize. Readability was checked by eye from headless screenshots.

Not committed yet: the folder is not a git repository.
