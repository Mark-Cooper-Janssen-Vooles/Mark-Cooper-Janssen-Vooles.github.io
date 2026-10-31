import { describe, expect, it } from 'vitest';
import { coverCrop } from './coverCrop';

describe('coverCrop', () => {
  it('crops the sides of a wide image in a tall area, centred on the focal point', () => {
    expect(coverCrop(2, 1, { x: 0.5, y: 0.5 })).toEqual({ x: 0.25, y: 0, w: 0.5, h: 1 });
  });

  it('crops top and bottom of an image in a wider area', () => {
    const crop = coverCrop(1, 2, { x: 0.5, y: 0.5 });
    expect(crop).toEqual({ x: 0, y: 0.25, w: 1, h: 0.5 });
  });

  it('keeps the crop inside the image when the focal point is near an edge', () => {
    expect(coverCrop(2, 1, { x: 0.9, y: 0.5 }).x).toBe(0.5);
  });
});
