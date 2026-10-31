export const dashVertex = /* glsl */ `
uniform vec2 uArea;
uniform vec2 uCell;
uniform vec2 uDash;
uniform vec2 uPointer;
uniform float uHover;
uniform float uDispersalStrength;
uniform sampler2D uHoverMask;
uniform float uGlowRadius;
uniform float uIntro;
uniform float uDrift;
uniform sampler2D uMask;

attribute vec2 aCell;
attribute float aTone;
attribute float aDither;
attribute float aSeed;

varying float vTone;
varying float vGlow;

void main() {
  vec2 rest = aCell * uArea;
  float reveal = texture2D(uMask, aCell).r;

  vec2 fromPointer = rest - uPointer;
  float dist = length(fromPointer);
  float onHorizontalArm = step(abs(fromPointer.y), abs(fromPointer.x));
  vec2 away = mix(vec2(sign(fromPointer.x), 0.0), vec2(0.0, sign(fromPointer.y)), onHorizontalArm);
  vec2 push = away * uHover * uDispersalStrength * texture2D(uHoverMask, aCell).r;
  float angle = aSeed * 6.2831853;
  vec2 drift = vec2(cos(angle), sin(angle)) * uDrift * reveal;
  vec2 pos = rest + push + drift;

  float visible = step(aDither, uIntro * aTone) * (1.0 - smoothstep(0.25, 0.55, reveal));
  vec2 local = position.xy * uCell * uDash * visible;
  vec2 world = vec2(pos.x - uArea.x * 0.5, uArea.y * 0.5 - pos.y) + local;

  vTone = aTone;
  vGlow = uHover * (1.0 - smoothstep(0.0, uGlowRadius, dist));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 0.0, 1.0);
}
`;

export const dashFragment = /* glsl */ `
uniform vec3 uShadow;
uniform vec3 uHighlight;
uniform float uGlowStrength;

varying float vTone;
varying float vGlow;

void main() {
  vec3 colour = mix(uShadow, uHighlight, vTone);
  gl_FragColor = vec4(mix(colour, vec3(1.0), vGlow * uGlowStrength), 1.0);
}
`;

export const photoVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const photoFragment = /* glsl */ `
uniform sampler2D uPhoto;
uniform sampler2D uMask;
uniform vec4 uCrop;
uniform vec2 uArea;
uniform float uBlock;
uniform float uScanline;
uniform float uScanlinePeriod;
uniform float uGrade;
uniform vec3 uShadow;
uniform vec2 uPointer;
uniform float uHover;
uniform sampler2D uHoverMask;
uniform float uScratchStrength;
uniform float uDarken;

varying vec2 vUv;

void main() {
  vec2 area = vec2(vUv.x, 1.0 - vUv.y);
  vec2 px = area * uArea;
  float scratched = texture2D(uMask, area).r;
  float peek = uHover * uScratchStrength * texture2D(uHoverMask, area).r;
  float reveal = smoothstep(0.05, 0.5, max(scratched, peek));
  if (reveal < 0.01) discard;

  vec2 block = (floor(px / uBlock) + 0.5) * uBlock / uArea;
  vec2 image = uCrop.xy + block * uCrop.zw;
  vec3 colour = texture2D(uPhoto, vec2(image.x, 1.0 - image.y)).rgb;

  float luma = dot(colour, vec3(0.2126, 0.7152, 0.0722));
  vec3 desaturated = mix(colour, vec3(luma), 0.55);
  vec3 cooled = mix(uShadow + desaturated * 0.7, desaturated, smoothstep(0.0, 0.7, luma));
  colour = mix(colour, cooled, uGrade);
  colour *= 1.0 - uScanline * step(0.5, fract(px.y / uScanlinePeriod));
  colour *= 1.0 - uDarken;

  gl_FragColor = vec4(colour, reveal);
}
`;
