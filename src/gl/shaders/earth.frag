uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uAlpha;
uniform float uIntro;

varying float vRand;
varying float vGlow;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.05, d);
  vec3 c = mix(uColorA, uColorB, smoothstep(0.2, 0.9, vRand));
  c = mix(c, uColorC, step(0.94, vRand));
  gl_FragColor = vec4(c, a * vGlow * uAlpha * uIntro);
}
