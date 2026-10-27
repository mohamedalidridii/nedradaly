import { Camera, Color, Mesh, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';
import vertexShader from './shaders/fullscreen.vert';
import fragmentShader from './shaders/curtain.frag';

/** Short-lived renderer for the preloader's noise-dissolve exit. */
export class Curtain {
  uniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uResolution: { value: new Vector2(innerWidth, innerHeight) },
    uColor: { value: new Color('#0e1a14') },
    uRim: { value: new Color('#d9a441') },
  };
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new Camera();

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.setSize(innerWidth, innerHeight, false);
    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms: this.uniforms, transparent: true });
    this.scene.add(new Mesh(new PlaneGeometry(2, 2), material));
  }

  render(time: number) {
    this.uniforms.uTime.value = time;
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
