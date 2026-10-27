// DOM-synced image planes: perspective bend from scroll velocity and a cylindrical curve for the gallery.
uniform vec2 uViewport;
uniform float uVelocity;
uniform float uCurve;
uniform float uTime;

varying vec2 vUv;

const float PI = 3.141592653589793;

void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec2 ndc = world.xy / (uViewport * 0.5);

  world.z -= ndc.x * ndc.x * uCurve * uViewport.x * 0.12;
  world.z += sin(uv.y * PI) * sin(uv.x * PI) * uVelocity * 3.5;
  world.y += sin(uv.x * PI) * uVelocity * (1.0 - uCurve) * 0.9;
  world.x += sin(uv.y * PI) * uVelocity * uCurve * 1.1;

  gl_Position = projectionMatrix * viewMatrix * world;
}
