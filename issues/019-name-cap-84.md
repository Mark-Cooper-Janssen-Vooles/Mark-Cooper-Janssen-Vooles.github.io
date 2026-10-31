---
id: 019
title: Lower the name cap to 84px letter height
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 019: Lower the name cap to 84px letter height

**What to build:** The name's maximum capital height drops by 25%, from 112px to 84px. It still fills the width between the insets below the cap, and stays left-aligned above it.

**Supersedes:** the 112px value in 015.

**Status:** done

- [x] `name.maxCapHeightPx` is 84
- [x] The Playwright wide-window check expects 84px capitals

## Resolution

`name.maxCapHeightPx` is 84; capitals now cap at about 1400px wide. The wide-window smoke test expects 84px.

Not committed yet: the folder is not a git repository.
