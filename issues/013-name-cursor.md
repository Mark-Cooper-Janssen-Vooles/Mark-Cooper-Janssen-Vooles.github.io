---
id: 013
title: No text cursor over the name
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [012]
created: 2026-10-30
---

# 013: No text cursor over the name

**What to build:** Hovering the name keeps the same cursor as the image, instead of switching to the text I-beam.

**Status:** done

- [x] The cursor over the name and the tagline matches the cursor over the image
- [x] The name text cannot be selected by dragging
- [x] The Playwright smoke test checks the name's cursor matches the image's

## Resolution

The name and tagline inherit the stage cursor; the stage disables text selection. Smoke test compares the computed cursors.

Not committed yet: the folder is not a git repository.
