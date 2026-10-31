---
id: 003
title: Photo page with name strip and icons
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [002]
created: 2026-10-30
---

# 003: Photo page with name strip and icons

**What to build:** The dev server shows a single, non-scrolling page:
- The prepared photo fills the image area, cover-fit and anchored on the head and chair.
- A name strip below it reads "MARK JANSSEN-VOOLES" in Inter, on the same warm charcoal, with no flip yet.
- Small LinkedIn and GitHub icons sit top-right.

This proves the path from photo prep to rendering before any effects are built.

**Blocked by:** 002

**Status:** done

- [x] A photo-prep script turns the clean source photo in the reference folder into a WebP around 2400px wide with no metadata, and records the focal point
- [x] The photo renders through an orthographic R3F scene
- [x] The page is exactly one viewport tall with no vertical scroll; the image area plus the name strip fill it
- [x] The name fills the full width (about 8–9vw, no wrapping) in mid-bright navy, at least 3:1 contrast against the background
- [x] The LinkedIn and GitHub icons (simple-icons) link to the URLs in the spec, open in a new tab, have accessible names and are keyboard-focusable
- [x] There is a single typed tuning-config object holding the palette and layout values
- [x] The Playwright smoke test is extended: no scroll, the name is shown, and the links are correct

## Resolution

`scripts/prepare-photo.mjs` crops the clean source on the head/chair focal point and writes `public/photo.webp` (2400x1351, no EXIF/ICC/XMP) plus `src/photo.json`. The page is one viewport tall; the name and profile links come from the single `tuning` object in `src/config.ts`. Deviation: the spec name colour `#3a5bbf` is only 2.8:1 on the background, so it is `#4467cc` (3.3:1), enforced by a unit test. simple-icons is pinned to 13.21.0 because later versions dropped LinkedIn.

Not committed yet: the folder is not a git repository.
