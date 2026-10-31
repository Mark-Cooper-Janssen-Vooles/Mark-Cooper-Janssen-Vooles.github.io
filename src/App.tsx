import { NameStrip } from './components/NameStrip';
import { SocialLinks } from './components/SocialLinks';
import { useMediaQuery } from './hooks/useMediaQuery';
import { Stage } from './scene/Stage';

export function App() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <main className="page">
      <Stage reducedMotion={reducedMotion}>
        <NameStrip animate={!reducedMotion} />
        <div className="top-bar">
          <p className="tagline">FULL STACK SOFTWARE ENGINEER</p>
          <SocialLinks />
        </div>
      </Stage>
    </main>
  );
}
