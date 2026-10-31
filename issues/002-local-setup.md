---
id: 002
title: Local project setup
status: done
labels: [ready-for-agent]
parent: 001
blocked_by: []
created: 2026-10-30
---

# 002: Local project setup

**What to build:** A fresh clone can be installed, run, tested and built locally by following the README. The dev server shows an empty full-viewport R3F canvas on warm charcoal. No photo or effects yet.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Vite, React, TypeScript and React Three Fiber are scaffolded; the dev server renders an empty full-viewport canvas on warm charcoal with no vertical scroll
- [x] A root `README.md` lists the prerequisites (Node LTS version, pinned via `.nvmrc` or `engines`) and the commands to install, run the dev server, run unit tests, run the Playwright test (including the one-off browser install), build and preview the production build
- [x] The `package.json` scripts match the README commands
- [x] Vitest is set up with one passing test; Playwright is set up with one smoke test (the page loads with no console errors)
- [x] Running the README commands in order on a fresh clone works, with no other setup

## Resolution

Vite 8, React 19, TypeScript and React Three Fiber 9 scaffolded, with Vitest unit tests and a Playwright smoke test against the production build. Node 22 is pinned in `.nvmrc` and `engines`. A project `.npmrc` points at the public npm registry so the lockfile stays free of private registry URLs. README lists every command.

Not committed yet: the folder is not a git repository.
