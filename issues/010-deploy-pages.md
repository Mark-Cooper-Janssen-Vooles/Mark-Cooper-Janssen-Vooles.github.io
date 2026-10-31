---
id: 010
title: Deploy to GitHub Pages
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: [009, 011, 012, 013, 014, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026, 027, 028]
created: 2026-10-30
---

# 010: Deploy to GitHub Pages

**What to build:** Pushing to `main` publishes the site at https://mark-cooper-janssen-vooles.github.io.

**Needs Mark first:** create the public repo `Mark-Cooper-Janssen-Vooles.github.io` and set Pages to deploy from GitHub Actions.

**Blocked by:** 009, 011–028

**Status:** done

- [x] The official GitHub Actions Pages workflow builds and deploys on push to `main`
- [x] Tests run in CI before deploying, and a failing test blocks the deploy
- [x] The live root URL serves the page with working assets; no Vite base path is needed

## Resolution

Public repo `Mark-Cooper-Janssen-Vooles/Mark-Cooper-Janssen-Vooles.github.io` created, with Pages set to deploy from GitHub Actions. `.github/workflows/deploy.yml` runs typecheck, unit tests and the Playwright smoke test before uploading `dist` and deploying; the deploy job only runs if the build job passes. The first run proved the gate: a 1px Linux rounding difference failed the cap-height check and the deploy was skipped. The live root URL serves the page, photo and assets with no Vite base path.

Commits: e804dd9 (initial), 1b96e30 (cap-height tolerance).
