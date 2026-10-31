import { describe, expect, it } from 'vitest';
import { stampBrush } from './brush';
import { RevealMask } from './revealMask';

const heal = { delay: 1, duration: 8, ease: (t: number) => t, stagger: 1, timeWeight: 1, depthWeight: 1 };
const brush = { armWidth: 0.22, jagged: 0.6 };

describe('stampBrush', () => {
  it('stamps exactly the shape of a single full-strength scratch', () => {
    const mask = new RevealMask(60, 40, heal, brush);
    mask.scratch(30.3, 20.7, 12, 1, 0);
    const hover = new Float32Array(60 * 40);
    stampBrush(hover, 60, 40, 30.3, 20.7, 12, brush);
    expect(Array.from(hover)).toEqual(Array.from(mask.values));
  });

  it('replaces the previous stamp', () => {
    const hover = new Float32Array(60 * 40);
    stampBrush(hover, 60, 40, 10, 10, 5, brush);
    stampBrush(hover, 60, 40, 50, 30, 5, brush);
    expect(hover[10 * 60 + 10]).toBe(0);
    expect(hover[30 * 60 + 50]).toBeGreaterThan(0);
  });
});
