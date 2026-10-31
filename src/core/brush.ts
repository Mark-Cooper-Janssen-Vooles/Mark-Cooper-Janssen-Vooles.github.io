export interface BrushOptions {
  armWidth: number;
  jagged: number;
}

function cellNoise(x: number, y: number, seed: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function arm(along: number, across: number, length: number, width: number): number {
  return Math.max(0, 1 - (along / length) ** 2) * Math.max(0, 1 - (across / width) ** 2);
}

export function forEachBrushCell(
  cols: number,
  rows: number,
  x: number,
  y: number,
  radius: number,
  { armWidth, jagged }: BrushOptions,
  visit: (index: number, falloff: number) => void,
) {
  if (!(radius > 0 && Number.isFinite(radius))) return;
  const reach = radius * (1 + jagged / 2);
  const minX = Math.max(0, Math.floor(x - reach));
  const maxX = Math.min(cols - 1, Math.floor(x + reach));
  const minY = Math.max(0, Math.floor(y - reach));
  const maxY = Math.min(rows - 1, Math.floor(y + reach));
  for (let cy = minY; cy <= maxY; cy++) {
    for (let cx = minX; cx <= maxX; cx++) {
      const length = radius * (1 + jagged * (cellNoise(cx, cy, 1) - 0.5));
      const width = radius * armWidth * (1 + 2 * jagged * (cellNoise(cx, cy, 2) - 0.5));
      const dx = Math.abs(cx + 0.5 - x);
      const dy = Math.abs(cy + 0.5 - y);
      const falloff = Math.max(arm(dx, dy, length, width), arm(dy, dx, length, width));
      if (falloff > 0) visit(cy * cols + cx, falloff);
    }
  }
}

export function stampBrush(
  target: Float32Array,
  cols: number,
  rows: number,
  x: number,
  y: number,
  radius: number,
  brush: BrushOptions,
) {
  target.fill(0);
  forEachBrushCell(cols, rows, x, y, radius, brush, (i, falloff) => (target[i] = Math.min(1, falloff)));
}
