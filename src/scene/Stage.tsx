import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from 'react';
import * as THREE from 'three';
import { tuning } from '../config';
import { buildField, loadPhoto, type Field } from './buildField';
import { DashScene, type Pointer } from './DashScene';

const DESCRIPTION =
  'Artwork: Mark seen from behind at his desk, facing his monitors, beside a window and a floor lamp, drawn in short blue dashes. Drag across it to scratch the dashes away and reveal the photo underneath.';
const RESIZE_DEBOUNCE_MS = 150;

function useDebouncedSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  useEffect(() => {
    const el = ref.current!;
    let timer: number | undefined;
    const measure = () =>
      setSize((prev) =>
        prev?.width === el.clientWidth && prev.height === el.clientHeight
          ? prev
          : { width: el.clientWidth, height: el.clientHeight },
      );
    measure();
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(measure, RESIZE_DEBOUNCE_MS);
    });
    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [ref]);
  return size;
}

const now = () => performance.now() / 1000;

interface Props {
  reducedMotion: boolean;
  children: ReactNode;
}

export function Stage({ reducedMotion, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useDebouncedSize(ref);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [slow, setSlow] = useState(false);
  const [introStart, setIntroStart] = useState<number | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [scratching, setScratching] = useState(false);
  const pointer = useRef<Pointer>({ x: 0, y: 0, inside: false, pressed: false, wake: () => {} }).current;
  const lastCell = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    loadPhoto().then(setImage, (error) => console.error('Failed to load the photo', error));
    const timer = window.setTimeout(() => setSlow(true), tuning.intro.pulseDelayMs);
    return () => clearTimeout(timer);
  }, []);

  const photo = useMemo(() => {
    if (!image) return null;
    const texture = new THREE.Texture(image);
    texture.colorSpace = THREE.NoColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [image]);
  useEffect(() => () => photo?.dispose(), [photo]);

  const field = useMemo<Field | null>(
    () => (image && size && size.width > 0 && size.height > 0 ? buildField(image, size.width, size.height) : null),
    [image, size],
  );

  useEffect(() => {
    if (field && introStart === null) setIntroStart(performance.now());
  }, [field, introStart]);

  useEffect(() => {
    lastCell.current = null;
  }, [field]);

  const active = introDone && field !== null;

  const toCell = (e: PointerEvent, f: Field) => {
    const rect = ref.current!.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    return { x: (pointer.x / rect.width) * f.cols, y: (pointer.y / rect.height) * f.rows };
  };
  const brushCells = (f: Field) => (tuning.scratch.brushRadiusPx / ref.current!.clientWidth) * f.cols;
  const endScratch = () => {
    if (!field || !pointer.pressed) return;
    lastCell.current = null;
    pointer.pressed = false;
    setScratching(false);
    pointer.wake();
  };

  useEffect(() => {
    if (!active) endScratch();
  }, [active]);

  const handlers =
    active && field
      ? {
          onPointerMove: (e: PointerEvent) => {
            pointer.inside = e.pointerType !== 'touch';
            const cell = toCell(e, field);
            pointer.wake();
            const from = lastCell.current;
            if (!from) return;
            if (!(e.buttons & 1)) return endScratch();
            field.mask.scratchStroke(from.x, from.y, cell.x, cell.y, brushCells(field), tuning.scratch.strength, now());
            lastCell.current = cell;
          },
          onPointerDown: (e: PointerEvent) => {
            if (e.button !== 0 || (e.target as Element).closest('a')) return;
            // Touch stays uncaptured so the letters under a moving finger still get pointerenter.
            if (e.pointerType === 'touch') (e.target as Element).releasePointerCapture(e.pointerId);
            else e.currentTarget.setPointerCapture(e.pointerId);
            const cell = toCell(e, field);
            pointer.pressed = true;
            setScratching(true);
            field.mask.scratch(cell.x, cell.y, brushCells(field), tuning.scratch.strength, now());
            lastCell.current = cell;
            pointer.wake();
          },
          onPointerUp: endScratch,
          onPointerCancel: endScratch,
          onLostPointerCapture: (e: PointerEvent) => e.pointerType !== 'touch' && endScratch(),
          onPointerLeave: () => {
            pointer.inside = false;
            pointer.wake();
          },
        }
      : {};

  return (
    <div
      ref={ref}
      className="stage"
      data-interactive={active}
      data-scratching={scratching}
      data-ready={introStart !== null}
      data-fade={reducedMotion}
      {...handlers}
    >
      {children}
      <div className="stage__canvas" role="img" aria-label={DESCRIPTION}>
        <Canvas frameloop="demand" orthographic flat linear dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
          {field && photo && introStart !== null && (
            <DashScene
              field={field}
              photo={photo}
              pointer={pointer}
              introStart={introStart}
              reducedMotion={reducedMotion}
              onIntroDone={() => setIntroDone(true)}
            />
          )}
        </Canvas>
        {slow && !field && <div className="pulse" aria-hidden="true" />}
      </div>
    </div>
  );
}
