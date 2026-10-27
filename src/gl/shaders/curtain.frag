// Preloader curtain: the forest dissolves through noise, revealing the page.
#include "./noise.glsl"

uniform float uProgress;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uRim;

varying vec2 vUv;

void main() {
  vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0);
  float n = snoise(vec3(p * 1.6, uTime * 0.15)) * 0.5 + 0.5;
  n += snoise(vec3(p * 5.0, uTime * 0.2)) * 0.12;
  float radial = length(vUv - 0.5) * 1.1;
  float field = radial * 0.55 + n * 0.45;
  float t = uProgress * 1.3;
  float hole = smoothstep(t - 0.04, t, field);
  float rim = smoothstep(t - 0.1, t - 0.04, field) - smoothstep(t - 0.04, t, field);
  vec3 c = mix(uColor, uRim, clamp(rim * 1.4, 0.0, 1.0));
  gl_FragColor = vec4(c, max(hole, rim * 0.9));
}
