const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export const tuning = {
  palette: {
    background: '#1f1c19',
    dashShadow: '#1a2a6b',
    dashHighlight: '#c3cdff',
    // #3a5bbf from the spec is 2.8:1 on the background; brightened to clear 3:1.
    name: '#4467cc',
    icon: '#9fb0f0',
    iconHover: '#e4e9ff',
  },
  grid: {
    columns: 300,
    edgeWeight: 1.6,
    gamma: 1.6,
    samplesPerCell: 2,
  },
  dash: {
    length: 0.8,
    thickness: 0.3,
  },
  intro: {
    durationMs: 3200,
    pulseDelayMs: 300,
    reducedMotionFadeMs: 300,
  },
  dispersal: {
    strengthPx: 16,
    pointerSmoothing: 12,
    hoverFadePerSecond: 4,
  },
  glow: {
    radiusPx: 90,
    strength: 0.55,
  },
  scratch: {
    brushRadiusPx: 63,
    armWidth: 0.22,
    jagged: 0.6,
    strength: 0.5,
  },
  heal: {
    delayMs: 1000,
    durationMs: 8000,
    ease: easeOutCubic,
    stagger: 1,
    timeWeight: 1,
    depthWeight: 1,
    driftPx: 18,
  },
  photo: {
    pixelBlockPx: 3.75,
    darken: 0.2,
    scanlineStrength: 0.08,
    scanlinePeriodPx: 3,
    gradeStrength: 0.6,
  },
  layout: {
    insetPx: 20,
    iconSizePx: 20,
    taglineSizePx: 16,
  },
  name: {
    letterSpacingEm: -0.04,
    // Measured for Inter Bold: rendered width of the full name, and capital height, in ems.
    widthEm: 11.9,
    capHeightEm: 0.727,
    maxCapHeightPx: 84,
    flipMs: 840,
  },
  links: {
    linkedIn: 'https://www.linkedin.com/in/mark-janssen-vooles-312a77187/',
    gitHub: 'https://github.com/Mark-Cooper-Janssen-Vooles/',
  },
} as const;

export type Tuning = typeof tuning;
