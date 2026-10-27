import { Color, Group, LinearFilter, MathUtils, Mesh, PlaneGeometry, SRGBColorSpace, ShaderMaterial, TextureLoader, Vector2, WebGLRenderer } from 'three';
import vertexShader from './shaders/media.vert';
import fragmentShader from './shaders/media.frag';
import { pointer } from '../pointer';

type Item = {
  el: HTMLElement;
  img: HTMLImageElement;
  mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  hover: number;
  hoverTarget: number;
  mouse: Vector2;
  ready: boolean;
};

export class Media {
  group = new Group();
  items: Item[] = [];
  private geometry = new PlaneGeometry(1, 1, 32, 32);
  private loader = new TextureLoader();
  private viewport = new Vector2(innerWidth, innerHeight);
  private tmp = new Vector2();

  constructor(private renderer: WebGLRenderer) {}

  /** Creates a plane for every [data-gl] figure; resolves as textures arrive. */
  load(onProgress: (loaded: number, total: number) => void) {
    const els = [...document.querySelectorAll<HTMLElement>('[data-gl]')];
    let loaded = 0;
    return Promise.all(
      els.map(
        (el) =>
          new Promise<void>((resolve) => {
            const img = el.querySelector('img')!;
            const material = new ShaderMaterial({
              vertexShader,
              fragmentShader,
              transparent: true,
              uniforms: {
                uTexture: { value: null },
                uImage: { value: new Vector2(1, 1) },
                uPlane: { value: new Vector2(1, 1) },
                uMouse: { value: new Vector2(0.5, 0.5) },
                uHover: { value: 0 },
                uVelocity: { value: 0 },
                uReveal: { value: 0 },
                uTime: { value: 0 },
                uCurve: { value: el.dataset.gl === 'bend' ? 1 : 0 },
                uViewport: { value: this.viewport },
                uRim: { value: new Color('#d9a441') },
              },
            });
            const mesh = new Mesh(this.geometry, material);
            mesh.visible = false;
            this.group.add(mesh);
            const item: Item = { el, img, mesh, hover: 0, hoverTarget: 0, mouse: new Vector2(0.5, 0.5), ready: false };
            this.items.push(item);

            el.addEventListener('pointerenter', () => (item.hoverTarget = 1));
            el.addEventListener('pointerleave', () => (item.hoverTarget = 0));

            const done = () => {
              onProgress(++loaded, els.length);
              resolve();
            };
            this.loader.load(
              img.currentSrc || img.src,
              (texture) => {
                texture.colorSpace = SRGBColorSpace;
                texture.minFilter = LinearFilter;
                texture.generateMipmaps = false;
                material.uniforms.uTexture.value = texture;
                material.uniforms.uImage.value.set(texture.image.width, texture.image.height);
                this.renderer.initTexture(texture);
                item.ready = true;
                el.classList.add('is-gl');
                done();
              },
              undefined,
              done,
            );
          }),
      ),
    );
  }

  /** Reveal progress (0–1) for a figure, driven by ScrollTrigger. */
  uniformsFor(el: Element) {
    return this.items.find((i) => i.el === el)?.mesh.material.uniforms;
  }

  resize(width: number, height: number) {
    this.viewport.set(width, height);
  }

  update(time: number, velocity: number) {
    const vw = this.viewport.x;
    const vh = this.viewport.y;
    for (const item of this.items) {
      if (!item.ready) continue;
      const r = item.el.getBoundingClientRect();
      const onScreen = r.bottom > -100 && r.top < vh + 100 && r.right > -100 && r.left < vw + 100;
      item.mesh.visible = onScreen;
      if (!onScreen) continue;

      item.mesh.scale.set(r.width, r.height, 1);
      item.mesh.position.set(r.left + r.width / 2 - vw / 2, vh / 2 - r.top - r.height / 2, 0);

      const u = item.mesh.material.uniforms;
      item.hover += (item.hoverTarget - item.hover) * 0.07;
      item.mouse.lerp(this.tmp.set((pointer.x - r.left) / r.width, 1 - (pointer.y - r.top) / r.height), 0.12);
      u.uHover.value = item.hover;
      u.uMouse.value.copy(item.mouse);
      u.uPlane.value.set(r.width, r.height);
      u.uVelocity.value += (MathUtils.clamp(velocity, -24, 24) - u.uVelocity.value) * 0.12;
      u.uTime.value = time;
    }
  }
}
