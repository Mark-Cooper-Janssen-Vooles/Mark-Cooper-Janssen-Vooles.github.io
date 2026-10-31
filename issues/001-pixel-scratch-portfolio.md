---
id: 001
title: Pixel-scratch portfolio art piece (desktop MVP)
status: open
labels: [spec, ready-for-agent]
created: 2026-10-30
---

## Problem Statement

Mark is a software engineer with an architecture background. His current portfolio is a 2023 vanilla three.js intro page with no projects, and it no longer shows what he can do as a web developer. He wants a portfolio that speaks for itself: a stand-alone, artistic, interactive piece that visitors remember, which also shows modern front-end and WebGL skills. It needs links to his LinkedIn and GitHub and nothing else to get in the way.

## Solution

A single, full-viewport, non-scrolling desktop web page:

- The page opens on a **photo of Mark at his desk, seen from behind and facing his monitors, rendered as a field of short horizontal dashes**. The dashes ramp from deep navy to pale blue on a warm charcoal background.
- **Moving the cursor** pushes the dashes outward around it, with a lighter glow directly under the cursor.
- **Click-dragging** rubs the dashes off like a lotto scratchie. Underneath is the real photo in colour, given a light digital treatment: mild pixelation and a faint scanline.
- Scratched areas **heal**: a few seconds after scratching stops, the dashes drift back into place.
- A strip along the bottom shows **"MARK JANSSEN-VOOLES"** in a large navy sans-serif spanning the full width. Each letter does a single 3D flip when hovered.
- Small **LinkedIn and GitHub icons** sit at the top-right.

## User Stories

1. As a visitor, I want the page to fill my desktop browser window with no scrolling, so that the piece feels like one composed artwork.
2. As a visitor, I want to see a dash-rendered image of a person at a desk when the page loads, so that I'm immediately drawn into something unusual.
3. As a visitor, I want the dash image to read clearly as a figure, chair, monitors, lamp and window, so that I understand what I'm looking at before I interact.
4. As a visitor, I want darker areas of the photo to appear as deep navy dashes and brighter areas as pale blue dashes, so that the image has depth and tone.
5. As a visitor, I want outlines (silhouette, desk edge, window frame) to be emphasised in the dash field, so that the composition stays legible in a single colour family.
6. As a visitor, I want a warm charcoal background behind the dashes, so that the blue palette feels considered rather than cold.
7. As a visitor, I want the dashes near my cursor to push away from it, so that the image feels alive and responsive.
8. As a visitor, I want a soft lighter circle directly under my cursor, so that I can see where I'm "touching" the image.
9. As a visitor, I want the dashes to settle back into place smoothly when my cursor moves away, so that the image never stays broken by hovering alone.
10. As a visitor, I want hovering *not* to reveal the underlying photo, so that discovering the photo by scratching feels rewarding.
11. As a visitor, I want to click and drag to rub dashes away like a scratchie ticket, so that I can uncover what's underneath.
12. As a visitor, I want the scratch to follow my cursor path with a soft-edged brush, so that it feels like physically rubbing a surface.
13. As a visitor, I want the revealed area to show the real photo with a subtle cool grey/blue grade, so that it reads as a photo while sharing the dashes' palette.
14. As a visitor, I want the revealed photo to look slightly digital (mild pixelation and a faint scanline), so that it belongs to the same visual world as the dashes.
15. As a visitor, I want to be able to scratch the entire image away, so that I can see the whole photo if I persist.
16. As a visitor, I want scratched areas to start healing a few seconds after I stop scratching, so that the piece resets itself for the next play.
17. As a visitor, I want healing dashes to drift back into position rather than pop in, so that healing feels like part of the same physical system as the dispersal.
18. As a visitor, I want healing to pause while I'm actively scratching, so that I'm not fighting the effect.
19. As a visitor, I want to see "MARK JANSSEN-VOOLES" in large navy letters across the bottom of the page, so that I know whose site this is.
20. As a visitor, I want the name to span the full width of the window, so that it reads as a bold design element.
21. As a visitor, I want the name strip to sit below the image on the same background, not over it, so that the name never hides part of the artwork.
22. As a visitor, I want each letter of the name to flip once around its vertical axis when I hover it, so that the name is playful too.
23. As a visitor, I want a letter that is mid-flip to finish its flip before it can be triggered again, so that sweeping across the name looks smooth rather than jittery.
24. As a visitor, I want small LinkedIn and GitHub icons at the top-right, so that I can find Mark professionally.
25. As a visitor, I want the icons to brighten when I hover them, so that I know they're clickable.
26. As a visitor, I want the icon links to open in a new tab, so that I don't lose the art piece.
27. As a keyboard user, I want to tab to the LinkedIn and GitHub links with a visible focus indicator, so that I can reach them without a mouse.
28. As a screen reader user, I want the icon links to have accessible names ("LinkedIn", "GitHub"), so that I know where they lead.
29. As a screen reader user, I want the page to expose Mark's name as the main heading and describe the artwork, so that I understand the page without seeing it.
30. As a visitor with reduced motion enabled, I want dash dispersal and letter flipping turned off, so that the page doesn't trigger discomfort.
31. As a visitor with reduced motion enabled, I want to still be able to scratch and see the photo, so that I don't miss the core experience.
32. As a touch or mobile visitor, I want to see the static dash image, the name and the icons, so that the page still looks intentional on my device.
33. As a visitor, I want the dashes to resolve in through a dither pattern when the page loads, so that loading feels like part of the artwork rather than a spinner.
34. As a visitor on a typical desktop, I want the animation to run smoothly at around 60fps, so that the interaction feels polished.
35. As a visitor resizing the window, I want the image to keep filling the area above the name strip without distortion, staying centred on the figure, so that the composition holds at any desktop size.
36. As a visitor with a widescreen or unusually shaped window, I want the image cropped at the edges rather than letterboxed, so that the dash field always fills the space.
37. As someone sharing the link on LinkedIn, I want a preview image of the dash render and the title "Mark Janssen-Vooles", so that the link looks good in feeds.
38. As Mark, I want the screen contents in the photo blurred, so that no work-related information is published.
39. As Mark, I want location and EXIF metadata stripped from the published photo, so that my home location isn't exposed.
40. As Mark, I want the site deployed automatically to GitHub Pages when I push to the main branch, so that publishing takes no effort.
41. As Mark, I want the site served at the root of my GitHub Pages user site, so that the URL is clean and needs no base-path configuration.
42. As Mark, I want the palette, timings and effect strengths kept as named tuning values in one place, so that I can tweak the art direction without digging through shader code.
43. As a recruiter or engineer viewing the public repository, I want clean, typed, well-structured code, so that the repo itself shows Mark's engineering skill.

## Implementation Decisions

**Stack**
- Vite, React, TypeScript, React Three Fiber, three.js, and drei where it helps.
- No GSAP, Zustand, Rapier or postprocessing libraries.
- The letter flip is plain CSS on letters split into individual spans.

**Photo preparation (one-off script, not runtime)**
- **Source:** Photo 1 (Mark from behind, facing his monitors). It's 4000×2252 JPG, with the screen contents **already replaced** with generic content, the cords removed and EXIF already stripped.
- **Steps:**
  1. Crop around a focal point on the head and chair.
  2. Strip any remaining metadata.
  3. Export a WebP around 2400px wide.
- The prepared WebP is what the site loads. The cleaned sources in `reference/` are committed too. The untouched original photo is **never committed** (unblurred screens and GPS data), and isn't in the repo.

**Core module (pure, framework-free, unit-tested)**
- **Dash-field generator.** Input is the photo's pixel data plus a target grid size; output is a list of dash instances (cell position, tone 0–1, kept or dropped).
  - The photo is sampled into a coarse cell grid, roughly 250–350 cells across, to be tuned.
  - Each cell's score combines luminance with an edge term (local colour or luminance difference), so outlines stand out.
  - An ordered dither decides which cells keep a dash, giving texture rather than solid fill.
  - It runs once at load on the CPU.
- **Scratch/heal mask model.**
  - A grid of reveal values from 0 (dashes intact) to 1 (fully scratched).
  - Scratch operations apply a soft circular brush at a point and radius.
  - A time step heals reveal values back towards 0, starting about 4s after the last scratch and taking about 15s, with an eased curve.
  - While scratching is active, healing pauses.
  - Time is passed in explicitly, so behaviour is deterministic and testable.

**Rendering**
- A single orthographic R3F scene fills the image area above the name strip.
- Dashes are one **instanced mesh** of short horizontal segments. Each instance carries a base position and tone.
- The vertex shader:
  - pushes instances away from the cursor with a smooth falloff (dispersal);
  - offsets instances in proportion to the healing progress, so healing dashes drift back into place;
  - hides instances where the scratch mask is revealed.
- The fragment shader maps tone to a navy → pale-blue colour ramp and adds the light glow under the cursor.
- The photo layer sits beneath the dashes, visible only where the scratch mask is revealed. It shows the photo with:
  - mild pixelation (about 4–6px blocks);
  - a faint scanline;
  - a **subtle cool grade**: partly desaturated, shadows pushed towards navy, highlights left neutral.
  
  The grade is applied in the shader with a tunable strength, not baked into the image.
- **Intro / loading state:** the page starts on blank charcoal. Once the dash field is ready, the dashes resolve in through the dither pattern over about 800ms. Hover and scratching turn on once the intro finishes. If preparation takes longer than about 300ms, a faint dash-style pulse shows in the centre until it's ready. Under reduced motion, the intro is a plain short fade.
- The scratch mask is uploaded to the GPU as a data texture each frame it changes.
- **Image fit is "cover".** It fills the area and crops the edges, anchored on the focal point. It's recomputed on resize, and the dash field is rebuilt when the aspect ratio changes meaningfully.

**Palette and type (initial values; tune by eye)**
- Background: warm charcoal, about `#1f1c19`. The name strip uses the same colour.
- Dash ramp: deep navy (shadows) → pale blue/periwinkle (highlights).
- Name: Inter, bold, sized in viewport-width units so all 19 characters fill the width (about 8–9vw), tight letter-spacing, no wrapping. Colour is a mid-bright navy (about `#3a5bbf`), which must meet at least 3:1 contrast against the background.
- Letter flip: a single `rotateY` 360°, about 600ms, ease-out. Hovering again mid-flip is ignored.

**Layout**
- The page is exactly one viewport tall, with no scrolling.
- The image area takes the remaining height above the name strip. The strip's height follows the name's font size.
- Icons sit top-right over the image area, about 20px, using the official simple-icons SVGs. They're coloured in the pale ramp tone and brighten on hover.
  - LinkedIn: https://www.linkedin.com/in/mark-janssen-vooles-312a77187/
  - GitHub: https://github.com/Mark-Cooper-Janssen-Vooles/

**Input and environment handling**
- Pointer move drives dispersal. Pointer down plus move drives scratching.
- On touch or coarse-pointer devices, the page renders the static dash field with no interaction.
- When `prefers-reduced-motion` is set, dispersal strength and the letter flip are disabled. Scratching and healing stay on.

**Tuning**
All art-direction values live in one typed configuration object: palette, grid density, dispersal radius and strength, glow radius, brush radius, heal delay and duration, pixelation size, scanline strength, photo grade strength and intro duration.

**Hosting**
- Public repository `Mark-Cooper-Janssen-Vooles.github.io`, created by Mark.
- Deployed with the official GitHub Actions Pages workflow on push to `main`, served at the root URL.
- An Open Graph image (a screenshot of the dash render) and the title "Mark Janssen-Vooles" go in the page head.

## Testing Decisions

- **What makes a good test:** it checks external behaviour through the public interface of a seam, not internal implementation, and it's deterministic.
  - No pixel-snapshot tests of WebGL output: they're flaky across GPUs and drivers.
  - The visual feel (palette, dispersal, glow, heal motion) is judged by eye in the browser.
- **Seam 1: the core module (Vitest unit tests).**
  - Dash-field generator, given small synthetic pixel buffers:
    - A uniform image produces uniform tones.
    - Higher luminance produces a higher tone.
    - A hard edge produces higher scores along the edge.
    - Output size matches the grid.
    - The dither drops a predictable proportion of cells for a given tone.
  - Scratch/heal mask:
    - A scratch raises reveal values within the brush radius and leaves cells outside it untouched.
    - Repeated scratches saturate at 1.
    - No healing happens before the delay.
    - The mask returns fully to 0 after delay plus duration.
    - Healing pauses while scratching is active.
- **Seam 2: one Playwright smoke test against the production build.** It checks that:
  - the page loads with no console errors, and the canvas is present;
  - the document doesn't scroll vertically;
  - the name strip contains "MARK JANSSEN-VOOLES";
  - both icon links have the correct URLs and accessible names, and open in a new tab;
  - hovering a letter starts its flip, and doesn't when reduced motion is emulated;
  - a touch-emulated viewport renders the static fallback.
- **Prior art:** none. The repository is new.

## Out of Scope

- The earlier portfolio content: architecture projects, an about section, a 2D content view, an email link, and a "How this was built" section. These go to the backlog.
- A full mobile or touch experience, including touch scratching. Touch devices get the static fallback only.
- Hover peek of the photo, as in the reference site.
- A reset control. Healing replaces it.
- A custom domain, analytics, CMS, routing or extra pages.
- GSAP, Zustand, physics and postprocessing libraries.
- Retiring the old Netlify site (`portfolio-guides-3d`). Do that manually once this is live.

## Further Notes

- **Inspiration, not copying:**
  - The dash rendering and cursor dispersal are inspired by https://eddy-naboulet.dev/projet/sidaction-cher-ami. It uses three.js with custom shaders, samples the image on the CPU into a cell grid scored by luminance and edges, then applies an ordered dither and a palette ramp.
  - The full-width name with per-letter flips is inspired by https://www.dibjick-mediapuls.de/. It uses Inter at 10vw with a per-letter `rotateY` 360° flip.
  - Implement independently. Don't copy their code or assets.
- **Reference folder (committed):** the `reference/` folder at the repo root holds:
  - `source-photo-clean.jpg`: **the input to the photo-prep script.** Photo 1 with generic "on" screen content (code editors and a browser) and the cords removed.
  - `source-photo.jpg`: an earlier version of Photo 1, with the screens blurred and the cords still in. Kept for reference only.
  - `ref-dash-field.png`: the eddy-naboulet dash rendering, showing the look of the dash field and the palette ramp to emulate in navy.
  - `ref-hover-glow.png`: the eddy-naboulet cursor dispersal and glow. Its colour-image peek is deliberately **not** being copied.
  - `ref-name-strip.png`: the dibjick footer, showing the full-width name strip.
- **Tooling:** built with Claude Code on a personal Claude Pro plan. Use Sonnet by default, and Opus for shader, dispersal and healing work. Don't set an Anthropic API key environment variable: it would override the subscription and bill at API rates.
- **Code style:** keep code minimal and typed, with comments only for genuinely non-obvious *why*.
- **Suggested breakdown into child issues:**
  1. Scaffold and Pages deploy.
  2. Photo-prep script.
  3. Dash-field generator with tests.
  4. Instanced dash render with palette.
  5. Hover dispersal and glow.
  6. Scratch/heal mask with tests, wired to rendering.
  7. Revealed photo treatment.
  8. Name strip and letter flip.
  9. Icons, metadata and OG image.
  10. Reduced motion and touch fallback.
  11. Playwright smoke test.
