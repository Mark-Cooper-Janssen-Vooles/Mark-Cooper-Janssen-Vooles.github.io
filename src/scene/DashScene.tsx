import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { tuning } from '../config';
import { stampBrush } from '../core/brush';
import type { Field } from './buildField';
import { dashFragment, dashVertex, photoFragment, photoVertex } from './shaders';

export interface Pointer {
  x: number;
  y: number;
  inside: boolean;
  pressed: boolean;
  wake: () => void;
}

interface Props {
  field: Field;
  photo: THREE.Texture;
  pointer: Pointer;
  introStart: number;
  reducedMotion: boolean;
  onIntroDone: () => void;
}

// The canvas renders with `linear`, so palette values go to the shaders as raw sRGB.
const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

function useMaskTexture(field: Field) {
  const texture = useMemo(() => {
    const t = new THREE.DataTexture(new Uint8Array(field.cols * field.rows), field.cols, field.rows, THREE.RedFormat);
    t.magFilter = t.minFilter = THREE.LinearFilter;
    t.unpackAlignment = 1;
    t.needsUpdate = true;
    return t;
  }, [field]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function useDashGeometry(field: Field) {
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = plane.index;
    g.setAttribute('position', plane.getAttribute('position'));
    g.setAttribute('aCell', new THREE.InstancedBufferAttribute(field.cells, 2));
    g.setAttribute('aTone', new THREE.InstancedBufferAttribute(field.tones, 1));
    g.setAttribute('aDither', new THREE.InstancedBufferAttribute(field.dithers, 1));
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(field.seeds, 1));
    g.instanceCount = field.count;
    return g;
  }, [field]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

const { palette, dash, dispersal, glow, heal, scratch, photo: treatment, intro } = tuning;

export function DashScene({ field, photo, pointer, introStart, reducedMotion, onIntroDone }: Props) {
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const mask = useMaskTexture(field);
  const hoverMask = useMaskTexture(field);
  const hoverValues = useMemo(() => new Float32Array(field.cols * field.rows), [field]);
  const stamped = useRef({ x: NaN, y: NaN, field });
  const geometry = useDashGeometry(field);

  const dashUniforms = useMemo(
    () => ({
      uArea: { value: new THREE.Vector2() },
      uCell: { value: new THREE.Vector2() },
      uDash: { value: new THREE.Vector2(dash.length, dash.thickness) },
      uPointer: { value: new THREE.Vector2() },
      uHover: { value: 0 },
      uHoverMask: { value: hoverMask },
      uDispersalStrength: { value: 0 },
      uGlowRadius: { value: glow.radiusPx },
      uGlowStrength: { value: glow.strength },
      uIntro: { value: 0 },
      uDrift: { value: heal.driftPx as number },
      uMask: { value: mask },
      uShadow: { value: rgb(palette.dashShadow) },
      uHighlight: { value: rgb(palette.dashHighlight) },
    }),
    [],
  );
  const photoUniforms = useMemo(
    () => ({
      uPhoto: { value: photo },
      uMask: { value: mask },
      uCrop: { value: new THREE.Vector4() },
      uArea: { value: new THREE.Vector2() },
      uBlock: { value: treatment.pixelBlockPx },
      uScanline: { value: treatment.scanlineStrength },
      uScanlinePeriod: { value: treatment.scanlinePeriodPx },
      uGrade: { value: treatment.gradeStrength },
      uShadow: { value: rgb(palette.dashShadow) },
      uPointer: { value: dashUniforms.uPointer.value },
      uHover: { value: 0 },
      uHoverMask: { value: hoverMask },
      uScratchStrength: { value: scratch.strength },
      uDarken: { value: treatment.darken },
    }),
    [dashUniforms],
  );

  // Owned outright because R3F's uniforms prop loses identity; both transparent so renderOrder layers them.
  const dashMaterial = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: dashVertex, fragmentShader: dashFragment, uniforms: dashUniforms, transparent: true, depthTest: false }),
    [dashUniforms],
  );
  const photoMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: photoVertex,
        fragmentShader: photoFragment,
        uniforms: photoUniforms,
        transparent: true,
        depthTest: false,
      }),
    [photoUniforms],
  );
  useEffect(
    () => () => {
      dashMaterial.dispose();
      photoMaterial.dispose();
    },
    [dashMaterial, photoMaterial],
  );

  dashUniforms.uMask.value = photoUniforms.uMask.value = mask;
  dashUniforms.uHoverMask.value = photoUniforms.uHoverMask.value = hoverMask;
  photoUniforms.uPhoto.value = photo;
  dashUniforms.uArea.value.set(size.width, size.height);
  dashUniforms.uCell.value.set(size.width / field.cols, size.height / field.rows);
  dashUniforms.uDispersalStrength.value = reducedMotion ? 0 : dispersal.strengthPx;
  dashUniforms.uDrift.value = reducedMotion ? 0 : heal.driftPx;
  photoUniforms.uArea.value.set(size.width, size.height);
  photoUniforms.uCrop.value.set(field.crop.x, field.crop.y, field.crop.w, field.crop.h);

  const target = useMemo(() => new THREE.Vector2(), []);
  const uploaded = useRef({ mask: field.mask, version: -1 });
  const introReported = useRef(false);
  const healTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(healTimer.current), []);

  useEffect(() => {
    pointer.wake = invalidate;
    invalidate();
  }, [pointer, invalidate, field]);

  useFrame((_, frameDelta) => {
    const delta = Math.min(frameDelta, 1 / 30);
    const now = performance.now();
    const progress = reducedMotion ? 1 : Math.min(1, (now - introStart) / intro.durationMs);
    dashUniforms.uIntro.value = progress;
    if (progress === 1 && !introReported.current) {
      introReported.current = true;
      onIntroDone();
    }

    const smoothed = dashUniforms.uPointer.value.lerp(target.set(pointer.x, pointer.y), 1 - Math.exp(-dispersal.pointerSmoothing * delta));
    const hoverTarget = pointer.inside && !pointer.pressed && introReported.current ? 1 : 0;
    const hover = dashUniforms.uHover.value;
    const fade = dispersal.hoverFadePerSecond * delta;
    dashUniforms.uHover.value = photoUniforms.uHover.value = hover + Math.max(-fade, Math.min(fade, hoverTarget - hover));

    const { x: px, y: py } = smoothed;
    if (dashUniforms.uHover.value > 0 && (stamped.current.x !== px || stamped.current.y !== py || stamped.current.field !== field)) {
      stamped.current = { x: px, y: py, field };
      const cellPx = size.width / field.cols;
      stampBrush(hoverValues, field.cols, field.rows, px / cellPx, py / cellPx, scratch.brushRadiusPx / cellPx, scratch);
      const data = hoverMask.image.data as Uint8Array;
      hoverValues.forEach((v, i) => (data[i] = Math.round(v * 255)));
      hoverMask.needsUpdate = true;
    }

    const healed = field.mask.step(now / 1000);
    if (uploaded.current.mask !== field.mask || uploaded.current.version !== field.mask.version) {
      uploaded.current = { mask: field.mask, version: field.mask.version };
      const data = mask.image.data as Uint8Array;
      field.mask.values.forEach((v, i) => (data[i] = Math.round(v * 255)));
      mask.needsUpdate = true;
    }

    const settling = smoothed.distanceTo(target) > 0.5 || dashUniforms.uHover.value !== hoverTarget;
    if (progress < 1 || settling || healed) return invalidate();
    const healAt = field.mask.healStartsAt;
    clearTimeout(healTimer.current);
    if (healAt !== null) healTimer.current = window.setTimeout(invalidate, Math.max(0, healAt * 1000 - now));
  });

  return (
    <>
      <mesh material={photoMaterial} renderOrder={0}>
        <planeGeometry args={[size.width, size.height]} />
      </mesh>
      <mesh geometry={geometry} material={dashMaterial} renderOrder={1} frustumCulled={false} />
    </>
  );
}
