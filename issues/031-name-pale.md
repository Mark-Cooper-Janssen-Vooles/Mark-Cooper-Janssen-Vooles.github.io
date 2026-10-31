---
id: 031
title: Name in the same pale colour as the tagline and icons
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-11-01
---

# 031: Name in the same pale colour as the tagline and icons

**What to build:** The name at the bottom uses the same pale blue as the tagline and icons, so all the text reads as one layer over the artwork. The link-preview image is recaptured to show the current layout.

**Supersedes:** the navy name colour in spec 001 and 003.

**Status:** done

- [x] `palette.name` and `palette.icon` share one pale value (#9fb0f0, 8.0:1 against the background)
- [x] `public/og.png` is recaptured from the current build

## Resolution

The palette defines the pale value once and uses it for both the name and the icons. The contrast tests still pass. `public/og.png` was recaptured with `npm run capture-og` against a fresh production preview.
