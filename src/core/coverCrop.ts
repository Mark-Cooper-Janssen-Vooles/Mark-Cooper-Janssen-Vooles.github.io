export interface Point {
  x: number;
  y: number;
}

/** Normalised image-space rectangle, y measured from the top. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), max);

export function coverCrop(imageAspect: number, areaAspect: number, focal: Point): Rect {
  if (areaAspect > imageAspect) {
    const h = imageAspect / areaAspect;
    return { x: 0, y: clamp(focal.y - h / 2, 1 - h), w: 1, h };
  }
  const w = areaAspect / imageAspect;
  return { x: clamp(focal.x - w / 2, 1 - w), y: 0, w, h: 1 };
}
