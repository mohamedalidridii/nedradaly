import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, Vector2 } from 'three';
import type { IUniform } from 'three';
import vertexShader from './shaders/earth.vert';
import fragmentShader from './shaders/earth.frag';
import { pointer } from '../pointer';

export class Earth {
  points: Points;
  uniforms: Record<string, IUniform>;
  private mouse = new Vector2();
  private target = new Vector2();
  private strength = 0;

  constructor(count: number, pixelRatio: number) {
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const rands = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const cols = Math.ceil(Math.sqrt(count * 2.2));
    const rows = Math.ceil(count / cols);

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere with a little shell thickness.
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const radius = 1.55 + (Math.random() - 0.5) * 0.08;
      positions.set([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius], i * 3);

      // Wide grid that becomes a rolling field.
      const cx = i % cols;
      const cz = Math.floor(i / cols);
      targets.set(
        [(cx / cols - 0.5) * 9 + (Math.random() - 0.5) * 0.04, -0.9, (cz / rows - 0.5) * 4.5 + (Math.random() - 0.5) * 0.04],
        i * 3,
      );
      rands[i] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aTarget', new BufferAttribute(targets, 3));
    geometry.setAttribute('aRand', new BufferAttribute(rands, 1));

    this.uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: pixelRatio },
      uAspect: { value: innerWidth / innerHeight },
      uMouse: { value: this.mouse },
      uMouseStrength: { value: 0 },
      uAlpha: { value: 1 },
      uIntro: { value: 0 },
      uColorA: { value: new Color('#5c7a4e') },
      uColorB: { value: new Color('#cfe3b4') },
      uColorC: { value: new Color('#d9a441') },
    };

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    this.points = new Points(geometry, material);
    this.points.frustumCulled = false;
  }

  resize(width: number, height: number) {
    this.uniforms.uAspect.value = width / height;
    const s = width < 700 ? 0.72 : 1;
    this.points.scale.setScalar(s);
  }

  update(time: number) {
    const u = this.uniforms;
    u.uTime.value = time;
    this.mouse.lerp(this.target.set(pointer.nx, pointer.ny), 0.08);
    this.strength += ((pointer.active ? 1 : 0) - this.strength) * 0.05;
    u.uMouseStrength.value = this.strength;

    const morph = u.uMorph.value as number;
    this.points.rotation.y = time * 0.06 * (1 - morph);
    this.points.rotation.x = morph * 0.35 + this.mouse.y * 0.12;
    this.points.rotation.z = this.mouse.x * -0.06;
    this.points.visible = (u.uAlpha.value as number) * (u.uIntro.value as number) > 0.001;
  }
}
