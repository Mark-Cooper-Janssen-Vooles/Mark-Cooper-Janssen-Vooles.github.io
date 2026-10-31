import { useState } from 'react';

const NAME = 'MARK JANSSEN-VOOLES';

function Letter({ char, animate }: { char: string; animate: boolean }) {
  const [flipping, setFlipping] = useState(false);
  return (
    <span
      className={flipping ? 'letter letter--flipping' : 'letter'}
      onPointerEnter={() => animate && setFlipping(true)}
      onAnimationEnd={() => setFlipping(false)}
    >
      {char}
    </span>
  );
}

export function NameStrip({ animate }: { animate: boolean }) {
  return (
    <h1 className="name">
      <span className="visually-hidden">Mark Janssen-Vooles</span>
      <span className="name__letters" aria-hidden="true" data-testid="name-strip">
        {[...NAME].map((char, i) =>
          char === ' ' ? <span key={i}> </span> : <Letter key={i} char={char} animate={animate} />,
        )}
      </span>
    </h1>
  );
}
