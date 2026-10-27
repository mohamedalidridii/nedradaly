// Living-earth particles: a breathing sphere that unfurls into a wave field on scroll.
#include "./noise.glsl"

uniform float uTime;
uniform float uMorph;
uniform float uSize;
uniform float uPixelRatio;
uniform float uAspect;
uniform vec2 uMouse;
uniform float uMouseStrength;

attribute vec3 aTarget;
attribute float aRand;

varying float vRand;
varying float vGlow;

void main() {
  vec3 sphere = position;
  float n = snoise(sphere * 1.1 + vec3(0.0, uTime * 0.12, 0.0));
  sphere += normalize(sphere) * n * 0.14;

  vec3 field = aTarget;
  field.y += sin(field.x * 1.4 + uTime * 0.7) * 0.22 + cos(field.z * 1.9 + uTime * 0.5) * 0.18;
  field.y += snoise(vec3(field.xz * 0.6, uTime * 0.1)) * 0.25;

  float t = smoothstep(0.0, 1.0, clamp(uMorph * 1.5 - aRand * 0.5, 0.0, 1.0));
  vec3 pos = mix(sphere, field, t);
  // Particles drift off their path mid-morph, like seeds on the wind.
  float drift = sin(t * 3.14159);
  pos += vec3(snoise(pos * 0.8 + 3.1), snoise(pos * 0.8 + 7.7), snoise(pos * 0.8 + 11.3)) * drift * 0.6 * aRand;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vec4 clip = projectionMatrix * mv;
  vec2 ndc = clip.xy / clip.w;
  vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
  float f = smoothstep(0.35, 0.0, length(d)) * uMouseStrength;
  mv.xy += normalize(d + 1e-5) * f * 0.35;

  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.45 + aRand * 0.9) / -mv.z;

  vRand = aRand;
  vGlow = 0.35 + 0.65 * smoothstep(-0.6, 0.8, n) + f * 0.8;
}
