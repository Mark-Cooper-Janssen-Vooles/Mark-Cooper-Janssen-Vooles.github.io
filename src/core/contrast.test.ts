import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { tuning } from '../config';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
  });

  it('keeps the name at 3:1 or better against the background', () => {
    expect(contrastRatio(tuning.palette.name, tuning.palette.background)).toBeGreaterThanOrEqual(3);
  });

  it('keeps the tagline at 4.5:1 or better against the background', () => {
    expect(contrastRatio(tuning.palette.icon, tuning.palette.background)).toBeGreaterThanOrEqual(4.5);
  });
});
