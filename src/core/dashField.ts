export interface PixelBuffer {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface DashFieldOptions {
  cols: number;
  rows: number;
  edgeWeight: number;
  gamma: number;
}

export interface Dash {
  col: number;
  row: number;
  tone: number;
  dither: number;
  kept: boolean;
}

const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function bayerThreshold(col: number, row: number): number {
  return (BAYER_4[(row % 4) * 4 + (col % 4)] + 0.5) / 16;
}

function cellLuminance({ width, height, data }: PixelBuffer, cols: number, rows: number): Float32Array {
  const lum = new Float32Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    const y0 = Math.floor((row * height) / rows);
    const y1 = Math.max(y0 + 1, Math.floor(((row + 1) * height) / rows));
    for (let col = 0; col < cols; col++) {
      const x0 = Math.floor((col * width) / cols);
      const x1 = Math.max(x0 + 1, Math.floor(((col + 1) * width) / cols));
      let sum = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * width + x) * 4;
          sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        }
      }
      lum[row * cols + col] = sum / ((y1 - y0) * (x1 - x0) * 255);
    }
  }
  return lum;
}

export function generateDashField(pixels: PixelBuffer, { cols, rows, edgeWeight, gamma }: DashFieldOptions): Dash[] {
  const lum = cellLuminance(pixels, cols, rows);
  const at = (col: number, row: number) =>
    lum[Math.min(Math.max(row, 0), rows - 1) * cols + Math.min(Math.max(col, 0), cols - 1)];

  const dashes: Dash[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const centre = at(col, row);
      const edge = Math.max(
        Math.abs(centre - at(col - 1, row)),
        Math.abs(centre - at(col + 1, row)),
        Math.abs(centre - at(col, row - 1)),
        Math.abs(centre - at(col, row + 1)),
      );
      const tone = Math.min(1, Math.pow(centre, gamma) + edgeWeight * edge);
      const dither = bayerThreshold(col, row);
      dashes.push({ col, row, tone, dither, kept: tone > dither });
    }
  }
  return dashes;
}
