import './styles/base.css';
import './styles/sections.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { render } from './render';
import { initScroll, startScroll, velocity } from './scroll';
import { GL } from './gl/Canvas';
import { Curtain } from './gl/Curtain';
import { initThemes, initTextReveals } from './anim/text';
import {
  heroIntro,
  initHeroScroll,
  initMarquee,
  initMediaReveals,
  initRolePreview,
  initSdg,
  initServices,
  initStories,
  initWorld,
} from './anim/sections';
import { initClock, initCursor, initMagnetic, initMenu } from './anim/ui';

gsap.registerPlugin(ScrollTrigger);

const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 900px), (pointer: coarse)').matches;

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// The intro always starts at the top; restoring a mid-page position would also make
// already-passed `once` triggers kill themselves inside ScrollTrigger's first refresh.
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

render();
initScroll(motion);

const gl = motion && webglAvailable() ? new GL(document.querySelector<HTMLCanvasElement>('.webgl')!, mobile) : null;
if (gl) {
  document.documentElement.classList.add('gl-ready');
  gsap.ticker.add((time) => gl.render(time, velocity()));
} else {
  document.querySelector('.webgl')?.remove();
}

initClock();
initCursor();
initMagnetic();
initMenu(motion);
initServices();
initSdg(motion);

if (motion) runPreloader();
else finishStatic();

function initScrollScenes() {
  // Pinned scenes first, so every later trigger measures positions with the pin spacing in place.
  initWorld();
  initStories();
  initThemes();
  initTextReveals();
  initHeroScroll(gl);
  initMediaReveals(gl);
  initRolePreview();
  initMarquee(true);
  ScrollTrigger.refresh();
}

function finishStatic() {
  document.documentElement.classList.add('is-static');
  document.querySelector('.preloader')?.remove();
  document.body.classList.remove('is-loading');
  initThemes();
  initRolePreview();
}

async function runPreloader() {
  const pre = document.querySelector<HTMLElement>('.preloader')!;
  const num = pre.querySelector<HTMLElement>('.preloader__num')!;
  const bar = pre.querySelector<HTMLElement>('.preloader__line span')!;
  let curtain: Curtain | null = null;
  try {
    curtain = new Curtain(pre.querySelector<HTMLCanvasElement>('.preloader__gl')!);
  } catch {
    curtain = null;
  }
  const curtainTick = (time: number) => curtain?.render(time);
  gsap.ticker.add(curtainTick);

  gsap.from('.preloader__name > *', { yPercent: 120, autoAlpha: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out' });

  // Progress blends real asset loading with a minimum, so the intro always breathes.
  const progress = { real: 0, shown: 0 };
  const minTime = gsap.to({}, { duration: 1.8 });
  const assets = Promise.all([
    document.fonts.ready,
    gl ? gl.media.load((l, t) => (progress.real = l / t)) : Promise.resolve().then(() => (progress.real = 1)),
  ]);
  const counter = (_: number, delta: number) => {
    const elapsed = Math.min(minTime.time() / 1.8, 1);
    const target = Math.min(progress.real, elapsed) * 100;
    progress.shown += (target - progress.shown) * Math.min(delta / 140, 1);
    num.textContent = String(Math.round(progress.shown));
    bar.style.transform = `scaleX(${progress.shown / 100})`;
  };
  gsap.ticker.add(counter);
  await assets;
  await new Promise<void>((resolve) => {
    const check = () => (progress.shown > 99.4 ? resolve() : requestAnimationFrame(check));
    check();
  });
  gsap.ticker.remove(counter);
  num.textContent = '100';

  initScrollScenes();

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.ticker.remove(curtainTick);
      curtain?.dispose();
      pre.remove();
      document.body.classList.remove('is-loading');
      startScroll();
      ScrollTrigger.refresh();
    },
  });
  tl.to('.preloader__inner, .preloader__sig', { yPercent: -30, autoAlpha: 0, duration: 0.9, ease: 'expo.in' });
  if (curtain) {
    tl.set(pre, { backgroundColor: 'transparent' }).to(curtain.uniforms.uProgress, { value: 1, duration: 1.9, ease: 'power2.inOut' });
  } else {
    tl.to(pre, { autoAlpha: 0, duration: 1 });
  }
  tl.add(heroIntro(gl), '-=1.5');
}
