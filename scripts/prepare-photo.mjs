import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'reference/source-photo-clean.jpg';
const OUTPUT = 'public/photo.webp';
const META = 'src/photo.json';
const FOCAL_PX = { x: 1980, y: 900 };
const CROP_WIDTH = 3600;
const OUTPUT_WIDTH = 2400;

const { width, height } = await sharp(SOURCE).metadata();
const cropHeight = Math.round((CROP_WIDTH * height) / width);
const clamp = (v, max) => Math.min(Math.max(v, 0), max);
const left = clamp(Math.round(FOCAL_PX.x - CROP_WIDTH / 2), width - CROP_WIDTH);
const top = clamp(Math.round(FOCAL_PX.y - cropHeight / 2), height - cropHeight);

// sharp drops all metadata unless withMetadata() is called.
const info = await sharp(SOURCE)
  .extract({ left, top, width: CROP_WIDTH, height: cropHeight })
  .resize({ width: OUTPUT_WIDTH })
  .webp({ quality: 82 })
  .toFile(OUTPUT);

const meta = {
  width: info.width,
  height: info.height,
  focal: {
    x: +((FOCAL_PX.x - left) / CROP_WIDTH).toFixed(4),
    y: +((FOCAL_PX.y - top) / cropHeight).toFixed(4),
  },
};
await writeFile(META, `${JSON.stringify(meta, null, 2)}\n`);
console.log(`${OUTPUT} ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KiB`, meta.focal);
