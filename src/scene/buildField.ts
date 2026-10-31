import { tuning } from '../config';
import { coverCrop, type Rect } from '../core/coverCrop';
import { generateDashField } from '../core/dashField';
import { RevealMask } from '../core/revealMask';
import photoMeta from '../photo.json';

export interface Field {
  cols: number;
  rows: number;
  crop: Rect;
  mask: RevealMask;
  count: number;
  cells: Float32Array;
  tones: Float32Array;
  dithers: Float32Array;
  seeds: Float32Array;
}

export function loadPhoto(): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = `${import.meta.env.BASE_URL}photo.webp`;
  return image.decode().then(() => image);
}

export function buildField(image: HTMLImageElement, width: number, height: number): Field {
  const { columns, edgeWeight, gamma, samplesPerCell } = tuning.grid;
  const cols = columns;
  const rows = Math.max(1, Math.round((height / width) * cols));
  const crop = coverCrop(image.width / image.height, width / height, photoMeta.focal);

  const canvas = document.createElement('canvas');
  canvas.width = cols * samplesPerCell;
  canvas.height = rows * samplesPerCell;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(
    image,
    crop.x * image.width,
    crop.y * image.height,
    crop.w * image.width,
    crop.h * image.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const kept = generateDashField(pixels, { cols, rows, edgeWeight, gamma }).filter((d) => d.kept);

  const count = kept.length;
  const cells = new Float32Array(count * 2);
  const tones = new Float32Array(count);
  const dithers = new Float32Array(count);
  const seeds = new Float32Array(count);
  kept.forEach((dash, i) => {
    cells[i * 2] = (dash.col + 0.5) / cols;
    cells[i * 2 + 1] = (dash.row + 0.5) / rows;
    tones[i] = dash.tone;
    dithers[i] = dash.dither;
    seeds[i] = Math.random();
  });

  const { delayMs, durationMs, ease, stagger, timeWeight, depthWeight } = tuning.heal;
  const heal = { delay: delayMs / 1000, duration: durationMs / 1000, ease, stagger, timeWeight, depthWeight };
  return { cols, rows, crop, mask: new RevealMask(cols, rows, heal, tuning.scratch), count, cells, tones, dithers, seeds };
}
