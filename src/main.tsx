import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/700.css';
import './styles.css';
import { tuning } from './config';
import { App } from './App';

const root = document.documentElement.style;
root.setProperty('--background', tuning.palette.background);
root.setProperty('--name', tuning.palette.name);
root.setProperty('--icon', tuning.palette.icon);
root.setProperty('--icon-hover', tuning.palette.iconHover);
root.setProperty('--dash', tuning.palette.dashHighlight);
const { layout, name } = tuning;
const nameFill = `(100vw - ${2 * layout.insetPx}px) / ${name.widthEm}`;
root.setProperty('--name-size', `min(calc(${nameFill}), ${name.maxCapHeightPx / name.capHeightEm}px)`);
root.setProperty('--name-spacing', `${name.letterSpacingEm}em`);
root.setProperty('--name-line', String(name.capHeightEm));
root.setProperty('--flip-duration', `${name.flipMs}ms`);
root.setProperty('--inset', `${layout.insetPx}px`);
root.setProperty('--icon-size', `${layout.iconSizePx}px`);
root.setProperty('--tagline-size', `${layout.taglineSizePx}px`);
root.setProperty('--intro-fade', `${tuning.intro.reducedMotionFadeMs}ms`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
