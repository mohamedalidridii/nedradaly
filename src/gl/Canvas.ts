import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Earth } from './Earth';
import { Media } from './Media';

/** One fixed renderer: a perspective hero scene for the particles and a pixel-mapped scene for DOM images. */
export class GL {
  renderer: WebGLRenderer;
  earth: Earth;
  media: Media;
  private heroScene = new Scene();
  private heroCamera = new PerspectiveCamera(40, 1, 0.1, 50);
  private mediaScene = new Scene();
  private mediaCamera = new PerspectiveCamera(45, 1, 10, 4000);

  constructor(canvas: HTMLCanvasElement, mobile: boolean) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: 'high-performance' });
    const dpr = Math.min(devicePixelRatio, mobile ? 1.5 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.autoClear = false;

    this.heroCamera.position.set(0, 0, 6);
    this.earth = new Earth(mobile ? 12000 : 38000, dpr);
    this.heroScene.add(this.earth.points);

    this.media = new Media(this.renderer);
    this.mediaScene.add(this.media.group);

    this.resize();
    addEventListener('resize', () => this.resize());
  }

  resize() {
    const w = innerWidth;
    const h = innerHeight;
    this.renderer.setSize(w, h, false);
    this.heroCamera.aspect = w / h;
    this.heroCamera.updateProjectionMatrix();

    // Place the camera so one world unit equals one CSS pixel at z = 0.
    const dist = 1200;
    this.mediaCamera.position.z = dist;
    this.mediaCamera.fov = (2 * Math.atan(h / 2 / dist) * 180) / Math.PI;
    this.mediaCamera.aspect = w / h;
    this.mediaCamera.updateProjectionMatrix();

    this.earth.resize(w, h);
    this.media.resize(w, h);
  }

  render(time: number, velocity: number) {
    this.earth.update(time);
    this.media.update(time, velocity);
    this.renderer.clear();
    if (this.earth.points.visible) this.renderer.render(this.heroScene, this.heroCamera);
    this.renderer.render(this.mediaScene, this.mediaCamera);
  }
}
