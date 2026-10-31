---
id: 010
title: Deploy to GitHub Pages
status: open
labels: [ready-for-agent, needs-human]
parent: 001
blocked_by: [009, 011, 012, 013, 014, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026, 027, 028]
created: 2026-10-30
---

# 010: Deploy to GitHub Pages

**What to build:** Pushing to `main` publishes the site at https://mark-cooper-janssen-vooles.github.io.

**Needs Mark first:** create the public repo `Mark-Cooper-Janssen-Vooles.github.io` and set Pages to deploy from GitHub Actions.

**Blocked by:** 009, 011–028

**Status:** ready-for-agent

- [ ] The official GitHub Actions Pages workflow builds and deploys on push to `main`
- [ ] Tests run in CI before deploying, and a failing test blocks the deploy
- [ ] The live root URL serves the page with working assets; no Vite base path is needed
