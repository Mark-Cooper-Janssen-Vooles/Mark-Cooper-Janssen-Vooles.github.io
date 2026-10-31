import { describe, expect, it } from 'vitest';
import { generateDashField, type PixelBuffer } from './dashField';

function image(width: number, height: number, grey: (x: number, y: number) => number): PixelBuffer {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const v = grey(x, y);
      data.set([v, v, v, 255], i);
    }
  }
  return { width, height, data };
}

const options = { cols: 8, rows: 8, edgeWeight: 1, gamma: 1 };

describe('generateDashField', () => {
  it('outputs one dash per grid cell', () => {
    const dashes = generateDashField(image(32, 16, () => 128), { ...options, cols: 8, rows: 4 });
    expect(dashes).toHaveLength(32);
    expect(dashes[9]).toMatchObject({ col: 1, row: 1 });
  });

  it('gives a uniform image uniform tones', () => {
    const tones = generateDashField(image(16, 16, () => 100), options).map((d) => d.tone);
    expect(new Set(tones).size).toBe(1);
  });

  it('gives brighter images higher tones', () => {
    const [dark] = generateDashField(image(16, 16, () => 60), options);
    const [bright] = generateDashField(image(16, 16, () => 200), options);
    expect(bright.tone).toBeGreaterThan(dark.tone);
  });

  it('scores cells along a hard edge higher than flat cells of the same brightness', () => {
    const dashes = generateDashField(image(16, 16, (x) => (x < 8 ? 0 : 255)), options);
    const at = (col: number) => dashes.find((d) => d.row === 4 && d.col === col)!.tone;
    expect(at(3)).toBeGreaterThan(at(0));
  });

  it('keeps a predictable proportion of cells for a given tone', () => {
    const kept = (grey: number) =>
      generateDashField(image(16, 16, () => grey), { ...options, edgeWeight: 0 }).filter((d) => d.kept).length;
    expect(kept(0)).toBe(0);
    expect(kept(255)).toBe(64);
    expect(kept(128)).toBe(32);
  });
});
