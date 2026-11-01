import { describe, expect, it } from 'vitest';
import { tuning } from '../config';
import { RevealMask } from './revealMask';

const DASHES_REAPPEAR_BELOW = 0.55;

describe('heal timing with the real tuning', () => {
  it('visibly starts healing a fully scratched spot between 0.5s and 1s', () => {
    const { delayMs, durationMs, ease } = tuning.heal;
    const mask = new RevealMask(20, 20, { delay: delayMs / 1000, duration: durationMs / 1000, ease });
    for (let i = 0; i < 5; i++) mask.scratch(10, 10, 6, 1, 0);
    expect(mask.values[10 * 20 + 10]).toBe(1);

    mask.step(0.5);
    expect(mask.values[10 * 20 + 10]).toBeGreaterThan(DASHES_REAPPEAR_BELOW);
    mask.step(1);
    expect(mask.values[10 * 20 + 10]).toBeLessThan(DASHES_REAPPEAR_BELOW);
  });
});
