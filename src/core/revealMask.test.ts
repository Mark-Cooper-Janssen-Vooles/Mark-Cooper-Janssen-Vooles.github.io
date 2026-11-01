import { describe, expect, it } from 'vitest';
import { RevealMask } from './revealMask';

const heal = { delay: 2, duration: 8, ease: (t: number) => t };
const total = (mask: RevealMask) => mask.values.reduce((sum, v) => sum + v, 0);
const at = (mask: RevealMask, x: number, y: number) => mask.values[y * mask.cols + x];

function scratched(now = 0) {
  const mask = new RevealMask(20, 20, heal);
  mask.scratch(10, 10, 4, 0.5, now);
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

  it('does not heal a spot before its delay', () => {
    const mask = scratched();
    const before = total(mask);
    expect(mask.step(1.9)).toBe(false);
    expect(total(mask)).toBe(before);
  });

  it('heals a spot fully after its delay plus the duration', () => {
    const mask = scratched();
    mask.step(6);
    expect(total(mask)).toBeGreaterThan(0);
    mask.step(10);
    expect(total(mask)).toBe(0);
    expect(mask.isRevealed).toBe(false);
  });

  it('heals each spot on its own timer, even while scratching continues', () => {
    const mask = new RevealMask(40, 10, heal);
    mask.scratch(5, 5, 2, 1, 0);
    const earlier = at(mask, 5, 5);
    mask.scratch(30, 5, 2, 1, 1.5);
    const later = at(mask, 30, 5);
    mask.scratch(30, 5, 2, 1, 2.5);
    mask.step(3);
    expect(at(mask, 5, 5)).toBeLessThan(earlier);
    expect(at(mask, 30, 5)).toBeGreaterThanOrEqual(later);
  });

  it('restarts a spot timer when it is scratched again', () => {
    const mask = scratched();
    mask.step(6);
    mask.scratch(10, 10, 4, 0.5, 6);
    const rescratched = at(mask, 10, 10);
    mask.step(7.9);
    expect(at(mask, 10, 10)).toBe(rescratched);
    mask.step(6 + 2 + 8);
    expect(total(mask)).toBe(0);
  });

  it('reports when the next pending spot starts healing', () => {
    const mask = new RevealMask(40, 10, heal);
    expect(mask.healStartsAt).toBeNull();
    mask.scratch(5, 5, 2, 1, 1);
    mask.scratch(30, 5, 2, 1, 3);
    mask.step(1);
    expect(mask.healStartsAt).toBe(3);
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
    mask.step(3);
    expect(mask.version).toBeGreaterThan(version);
  });
});
