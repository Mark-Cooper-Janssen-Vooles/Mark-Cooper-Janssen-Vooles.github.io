# Mark Janssen-Vooles

A single-page interactive portrait. A photo is rendered as a field of short navy-to-pale-blue dashes that scatter away from the cursor. Click and drag to scratch the dashes off and reveal the photo underneath; scratched areas heal a few seconds later.

Built with Vite, React, TypeScript and React Three Fiber.

## Prerequisites

- Node.js 22 LTS (pinned in `.nvmrc`; run `nvm use` if you use nvm)

Packages resolve from the public npm registry (set in the project `.npmrc`).

## Commands

Run these from the repo root, in order, on a fresh clone:

| Step | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Start the dev server | `npm run dev` |
| Type-check | `npm run typecheck` |
| Run unit tests | `npm test` |
| Install the Playwright browser (once per machine) | `npx playwright install chromium` |
| Run the Playwright smoke test against a production build | `npm run test:e2e` |
| Build for production | `npm run build` |
| Preview the production build | `npm run preview` |

## Assets

These are one-off steps; their outputs are committed.

- `npm run prepare-photo` turns `reference/source-photo-clean.jpg` into `public/photo.webp` (cropped on the focal point, about 2400px wide, metadata stripped) and writes the focal point to `src/photo.json`.
- `npm run capture-og` screenshots the running site into `public/og.png`, the link-preview image. Start `npm run preview` first, or pass a URL: `npm run capture-og -- http://localhost:5173/`.

## Tuning

Palette, grid density, dispersal, glow, brush, healing, photo treatment, intro timing and layout values all live in [`src/config.ts`](src/config.ts).

## Structure

- `src/core/`: pure, framework-free logic with unit tests: the dash-field generator, the scratch/heal mask, cover-fit cropping and contrast checks.
- `src/scene/`: the React Three Fiber stage, shaders and pointer handling.
- `src/components/`: the name strip and profile links.
- `e2e/`: the Playwright smoke test.
