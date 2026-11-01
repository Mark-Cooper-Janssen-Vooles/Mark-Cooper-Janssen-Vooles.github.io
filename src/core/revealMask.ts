import { forEachBrushCell, type BrushOptions } from './brush';

export interface HealOptions {
  delay: number;
  duration: number;
  ease: (t: number) => number;
}

export class RevealMask {
  readonly values: Float32Array;
  private readonly peak: Float32Array;
  private readonly scratchedAt: Float32Array;
  version = 0;
  private revealed = false;
  private nextHeal: number | null = null;

  constructor(
    readonly cols: number,
    readonly rows: number,
    private readonly heal: HealOptions,
    private readonly brush: BrushOptions = { armWidth: 0.3, jagged: 0 },
  ) {
    this.values = new Float32Array(cols * rows);
    this.peak = new Float32Array(cols * rows);
    this.scratchedAt = new Float32Array(cols * rows);
  }

  get isRevealed() {
    return this.revealed;
  }

  get healStartsAt(): number | null {
    return this.nextHeal;
  }

  scratch(x: number, y: number, radius: number, strength: number, now: number) {
    let touched = false;
    forEachBrushCell(this.cols, this.rows, x, y, radius, this.brush, (i, falloff) => {
      const next = Math.fround(Math.min(1, this.values[i] + strength * falloff));
      if (next === this.values[i]) return;
      this.values[i] = this.peak[i] = next;
      this.scratchedAt[i] = now;
      touched = true;
    });
    if (!touched) return;
    this.revealed = true;
    const healAt = now + this.heal.delay;
    this.nextHeal = this.nextHeal === null ? healAt : Math.min(this.nextHeal, healAt);
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
    if (!this.revealed) return false;
    const { delay, duration, ease } = this.heal;
    let changed = false;
    let revealed = false;
    let nextHeal: number | null = null;
    for (let i = 0; i < this.values.length; i++) {
      if (this.peak[i] === 0) continue;
      const healAt = this.scratchedAt[i] + delay;
      const progress = (now - healAt) / duration;
      if (progress <= 0) {
        revealed = true;
        nextHeal = nextHeal === null ? healAt : Math.min(nextHeal, healAt);
        continue;
      }
      const value = progress >= 1 ? 0 : Math.fround(this.peak[i] * (1 - ease(progress)));
      if (value === 0) this.peak[i] = 0;
      else revealed = true;
      if (value !== this.values[i]) {
        this.values[i] = value;
        changed = true;
      }
    }
    this.revealed = revealed;
    this.nextHeal = nextHeal;
    if (changed) this.version++;
    return changed;
  }
}
