#include "./noise.glsl"

uniform sampler2D uTexture;
uniform vec2 uImage;
uniform vec2 uPlane;
uniform vec2 uMouse;
uniform float uHover;
uniform float uVelocity;
uniform float uReveal;
uniform float uTime;
uniform vec3 uRim;

varying vec2 vUv;

vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
  float rp = plane.x / plane.y;
  float ri = image.x / image.y;
  vec2 scale = rp > ri ? vec2(1.0, ri / rp) : vec2(rp / ri, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = coverUv(vUv, uPlane, uImage);

  // Liquid lens around the cursor on hover.
  vec2 d = vUv - uMouse;
  float lens = smoothstep(0.5, 0.0, length(d * vec2(uPlane.x / uPlane.y, 1.0))) * uHover;
  uv -= d * lens * 0.12;
  uv += vec2(snoise(vec3(uv * 3.5, uTime * 0.35)), snoise(vec3(uv * 3.5 + 9.0, uTime * 0.35))) * 0.012 * uHover;
  uv = (uv - 0.5) * (1.0 - 0.07 * uHover - 0.05 * (1.0 - uReveal)) + 0.5;

  float shift = clamp(abs(uVelocity) * 0.0006, 0.0, 0.012) + lens * 0.01;
  vec3 color = vec3(
    texture2D(uTexture, uv + vec2(shift, 0.0)).r,
    texture2D(uTexture, uv).g,
    texture2D(uTexture, uv - vec2(shift, 0.0)).b
  );

  float grey = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(grey), color, 0.82 + 0.18 * uHover);

  // Organic ink reveal rising from the bottom, with a warm rim on the leading edge.
  float n = snoise(vec3(vUv * 2.6, uTime * 0.08)) * 0.5 + 0.5;
  float edge = vUv.y * 0.65 + n * 0.35;
  float p = uReveal * 1.3 - 0.05;
  float mask = smoothstep(edge - 0.02, edge, p);
  float rim = smoothstep(edge - 0.06, edge - 0.02, p) - mask;
  color = mix(color, uRim, clamp(rim * 1.2, 0.0, 1.0));

  gl_FragColor = vec4(color, max(mask, rim));
}
