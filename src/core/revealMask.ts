import { forEachBrushCell, type BrushOptions } from './brush';

export interface HealOptions {
  delay: number;
  duration: number;
  ease: (t: number) => number;
  stagger: number;
  timeWeight: number;
  depthWeight: number;
}

export class RevealMask {
  readonly values: Float32Array;
  private readonly scratchedAt: Float32Array;
  private readonly healOrder: Float32Array;
  version = 0;
  private scratching = false;
  private lastActivity = -Infinity;
  private healFrom: Float32Array | null = null;
  private revealed = false;

  constructor(
    readonly cols: number,
    readonly rows: number,
    private readonly heal: HealOptions,
    private readonly brush: BrushOptions = { armWidth: 0.3, jagged: 0 },
  ) {
    this.values = new Float32Array(cols * rows);
    this.scratchedAt = new Float32Array(cols * rows);
    this.healOrder = new Float32Array(cols * rows);
  }

  get isRevealed() {
    return this.revealed;
  }

  get healStartsAt(): number | null {
    return this.scratching || !this.revealed || this.healFrom ? null : this.lastActivity + this.heal.delay;
  }

  beginScratch(now: number) {
    this.scratching = true;
    this.touch(now);
  }

  endScratch(now: number) {
    this.scratching = false;
    this.touch(now);
  }

  scratch(x: number, y: number, radius: number, strength: number, now: number) {
    this.touch(now);
    let touched = false;
    forEachBrushCell(this.cols, this.rows, x, y, radius, this.brush, (i, falloff) => {
      const next = Math.fround(Math.min(1, this.values[i] + strength * falloff));
      if (next === this.values[i]) return;
      this.values[i] = next;
      this.scratchedAt[i] = now;
      touched = true;
    });
    if (!touched) return;
    this.revealed = true;
    this.version++;
  }

  scratchStroke(x0: number, y0: number, x1: number, y1: number, radius: number, strength: number, now: number) {
    if (!(radius > 0 && Number.isFinite(radius))) return;
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / (radius * 0.25)));
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      this.scratch(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, radius, strength, now);
    }
  }

  step(now: number): boolean {
    if (this.scratching || !this.revealed) return false;
    const elapsed = now - this.lastActivity - this.heal.delay;
    if (elapsed <= 0) return false;

    const healFrom = (this.healFrom ??= this.startHeal());
    const { duration, ease, stagger } = this.heal;
    const progress = Math.min(1, elapsed / duration);
    for (let i = 0; i < this.values.length; i++) {
      if (healFrom[i] === 0) continue;
      const cellProgress = Math.min(1, Math.max(0, progress * (1 + stagger) - stagger * this.healOrder[i]));
      this.values[i] = progress === 1 ? 0 : healFrom[i] * (1 - ease(cellProgress));
    }

    if (progress === 1) {
      this.healFrom = null;
      this.revealed = false;
    }
    this.version++;
    return true;
  }

  private startHeal(): Float32Array {
    const depth = this.depthWithinArea();
    let first = Infinity;
    let last = -Infinity;
    let depthVaries = false;
    this.values.forEach((v, i) => {
      if (v === 0) return;
      first = Math.min(first, this.scratchedAt[i]);
      last = Math.max(last, this.scratchedAt[i]);
      depthVaries ||= depth[i] > 0;
    });

    const timeWeight = last > first ? this.heal.timeWeight : 0;
    const depthWeight = depthVaries ? this.heal.depthWeight : 0;
    const totalWeight = timeWeight + depthWeight;
    this.values.forEach((v, i) => {
      const byTime = timeWeight ? (this.scratchedAt[i] - first) / (last - first) : 0;
      const byDepth = depthWeight * depth[i];
      this.healOrder[i] = v > 0 && totalWeight > 0 ? (timeWeight * byTime + byDepth) / totalWeight : 0;
    });
    return this.values.slice();
  }

  private depthWithinArea(): Float32Array {
    const { cols, rows, values } = this;
    const distance = this.distanceToUnscratched();
    const depth = new Float32Array(values.length);
    const seen = new Uint8Array(values.length);
    for (let start = 0; start < values.length; start++) {
      if (values[start] === 0 || seen[start]) continue;
      const area = [start];
      seen[start] = 1;
      for (let k = 0; k < area.length; k++) {
        const x = area[k] % cols;
        const y = (area[k] - x) / cols;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            const j = ny * cols + nx;
            if (values[j] === 0 || seen[j]) continue;
            seen[j] = 1;
            area.push(j);
          }
        }
      }
      let shallowest = Infinity;
      let deepest = -Infinity;
      for (const i of area) {
        shallowest = Math.min(shallowest, distance[i]);
        deepest = Math.max(deepest, distance[i]);
      }
      if (deepest > shallowest) for (const i of area) depth[i] = (distance[i] - shallowest) / (deepest - shallowest);
    }
    return depth;
  }

  // Two-pass chamfer distance; cells beyond the grid count as unscratched so a fully cleared grid fills from its edges.
  private distanceToUnscratched(): Float32Array {
    const { cols, rows } = this;
    const depth = this.values.map((v) => (v > 0 ? Infinity : 0));
    const at = (x: number, y: number) => (x < 0 || y < 0 || x >= cols || y >= rows ? 0 : depth[y * cols + x]);
    const relax = (x: number, y: number, neighbours: [number, number, number][]) => {
      const i = y * cols + x;
      if (depth[i] === 0) return;
      for (const [dx, dy, cost] of neighbours) depth[i] = Math.min(depth[i], at(x + dx, y + dy) + cost);
    };
    const forward: [number, number, number][] = [[-1, 0, 1], [0, -1, 1], [-1, -1, Math.SQRT2], [1, -1, Math.SQRT2]];
    const backward: [number, number, number][] = [[1, 0, 1], [0, 1, 1], [1, 1, Math.SQRT2], [-1, 1, Math.SQRT2]];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) relax(x, y, forward);
    for (let y = rows - 1; y >= 0; y--) for (let x = cols - 1; x >= 0; x--) relax(x, y, backward);
    return depth;
  }

  private touch(now: number) {
    this.lastActivity = now;
    this.healFrom = null;
  }
}
