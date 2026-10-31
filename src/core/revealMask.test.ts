import { describe, expect, it } from 'vitest';
import { RevealMask } from './revealMask';

const heal = { delay: 4, duration: 2, ease: (t: number) => t, stagger: 1, timeWeight: 1, depthWeight: 1 };
const total = (mask: RevealMask) => mask.values.reduce((sum, v) => sum + v, 0);
const at = (mask: RevealMask, x: number, y: number) => mask.values[y * mask.cols + x];

function scratched(now = 0) {
  const mask = new RevealMask(20, 20, heal);
  mask.beginScratch(now);
  mask.scratch(10, 10, 4, 0.5, now);
  mask.endScratch(now);
  return mask;
}

describe('RevealMask', () => {
  it('raises values inside the brush and leaves cells outside untouched', () => {
    const mask = scratched();
    expect(at(mask, 10, 10)).toBeGreaterThan(0);
    expect(at(mask, 15, 10)).toBe(0);
    expect(at(mask, 0, 0)).toBe(0);
  });

  it('scratches a plus shape: both arms, not the diagonals', () => {
    const mask = new RevealMask(40, 40, heal);
    mask.scratch(20, 20, 10, 1, 0);
    expect(at(mask, 27, 19)).toBeGreaterThan(0);
    expect(at(mask, 19, 12)).toBeGreaterThan(0);
    expect(at(mask, 25, 25)).toBe(0);
  });

  it('jags the brush edge the same way every time', () => {
    const jagged = () => {
      const mask = new RevealMask(40, 40, heal, { armWidth: 0.3, jagged: 0.6 });
      mask.scratch(20, 20, 10, 1, 0);
      return Array.from(mask.values);
    };
    const smooth = new RevealMask(40, 40, heal, { armWidth: 0.3, jagged: 0 });
    smooth.scratch(20, 20, 10, 1, 0);
    expect(jagged()).toEqual(jagged());
    expect(jagged()).not.toEqual(Array.from(smooth.values));
  });

  it('saturates at 1 under repeated scratches', () => {
    const mask = new RevealMask(20, 20, heal);
    for (let i = 0; i < 10; i++) mask.scratch(10, 10, 4, 0.5, 0);
    expect(at(mask, 10, 10)).toBe(1);
    expect(Math.max(...mask.values)).toBe(1);
  });

  it('fills the gaps between points of a fast stroke', () => {
    const mask = new RevealMask(40, 10, heal);
    mask.scratchStroke(2, 5, 37, 5, 2, 0.5, 0);
    for (let x = 2; x <= 37; x++) expect(at(mask, x, 5)).toBeGreaterThan(0);
  });

  it('does not heal before the delay', () => {
    const mask = scratched();
    const before = total(mask);
    expect(mask.step(3.9)).toBe(false);
    expect(total(mask)).toBe(before);
  });

  it('heals fully after the delay plus the duration', () => {
    const mask = scratched();
    mask.step(4.5);
    expect(total(mask)).toBeGreaterThan(0);
    mask.step(6);
    expect(total(mask)).toBe(0);
  });

  it('pauses healing while scratching and restarts the delay afterwards', () => {
    const mask = scratched();
    mask.step(4.5);
    const partlyHealed = total(mask);
    mask.beginScratch(4.5);
    expect(mask.step(30)).toBe(false);
    expect(total(mask)).toBe(partlyHealed);
    mask.endScratch(30);
    mask.step(33.9);
    expect(total(mask)).toBe(partlyHealed);
    mask.step(30 + 4 + 2);
    expect(total(mask)).toBe(0);
  });

  it('heals earlier-scratched cells before later ones', () => {
    const mask = new RevealMask(40, 10, heal);
    mask.beginScratch(0);
    mask.scratch(5, 5, 2, 1, 0);
    mask.scratch(30, 5, 2, 1, 1);
    mask.endScratch(1);
    const patch = (cx: number) => [-1, 0, 1].flatMap((dy) => [-1, 0, 1].map((dx) => at(mask, cx + dx, 5 + dy)));
    const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
    const earlier = sum(patch(5));
    const later = sum(patch(30));
    const centre = at(mask, 30, 5);
    mask.step(1 + 4 + 1);
    expect(sum(patch(5)) / earlier).toBeLessThan(sum(patch(30)) / later);
    expect(at(mask, 30, 5)).toBe(centre);
    mask.step(1 + 4 + 2);
    expect(total(mask)).toBe(0);
  });

  it('heals the edge of a scratched patch before its centre', () => {
    const mask = new RevealMask(30, 30, heal);
    mask.scratch(15, 15, 8, 1, 0);
    const edge = at(mask, 9, 16);
    const centre = at(mask, 15, 15);
    mask.step(4.5);
    expect(at(mask, 9, 16) / edge).toBeLessThan(at(mask, 15, 15) / centre);
  });

  it('fills a thin stroke from its own edges even beside a wide patch', () => {
    const mask = new RevealMask(60, 30, heal);
    mask.scratch(15, 15, 10, 1, 0);
    for (let x = 40; x < 58; x++) mask.scratch(x + 0.5, 15.5, 2.5, 1, 0);
    const edge = at(mask, 48, 13);
    const centre = at(mask, 48, 15);
    mask.step(4.5);
    expect(at(mask, 48, 13) / edge).toBeLessThan(at(mask, 48, 15) / centre);
  });

  it('fills a fully scratched grid inwards from the grid edges', () => {
    const mask = new RevealMask(10, 10, heal);
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) mask.scratch(x + 0.5, y + 0.5, 1, 1, 0);
    mask.step(4.5);
    expect(at(mask, 0, 5)).toBeLessThan(at(mask, 5, 5));
  });

  it('restarts healing from the current values after a scratch mid-heal', () => {
    const mask = scratched();
    mask.step(4.25);
    mask.beginScratch(4.25);
    mask.scratch(10, 10, 4, 1, 4.25);
    mask.endScratch(4.25);
    expect(at(mask, 10, 10)).toBe(1);
    mask.step(8);
    expect(at(mask, 10, 10)).toBe(1);
    mask.step(4.25 + 4 + 2);
    expect(total(mask)).toBe(0);
  });

  it('ignores scratches that touch no cells', () => {
    const mask = new RevealMask(20, 20, heal);
    mask.scratch(100, 100, 4, 1, 0);
    expect(mask.version).toBe(0);
    expect(mask.step(10)).toBe(false);
  });

  it('bumps its version only when values change', () => {
    const mask = scratched();
    const version = mask.version;
    mask.step(1);
    expect(mask.version).toBe(version);
    mask.step(5);
    expect(mask.version).toBeGreaterThan(version);
  });
});
