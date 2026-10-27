import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let loco: LocomotiveScroll | null = null;
let nativeLast = 0;
let nativeVelocity = 0;

/**
 * Locomotive Scroll v5 (Lenis inside) driven by GSAP's ticker, so smooth scroll,
 * ScrollTrigger and the WebGL loop all advance on the same frame.
 */
export function initScroll(smooth: boolean) {
  gsap.ticker.lagSmoothing(0);
  if (!smooth) {
    gsap.ticker.add(() => {
      nativeVelocity += (scrollY - nativeLast - nativeVelocity) * 0.2;
      nativeLast = scrollY;
    });
    return;
  }
  loco = new LocomotiveScroll({
    autoStart: false,
    lenisOptions: { lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4, anchors: false },
    scrollCallback: () => ScrollTrigger.update(),
    initCustomTicker: (render) => gsap.ticker.add(render),
    destroyCustomTicker: (render) => gsap.ticker.remove(render),
  });
  loco.lenisInstance?.stop();
}

export function startScroll() {
  loco?.start();
  loco?.lenisInstance?.start();
}

export function lockScroll(locked: boolean) {
  if (locked) loco?.lenisInstance?.stop();
  else loco?.lenisInstance?.start();
}

export function velocity() {
  return loco?.lenisInstance?.velocity ?? nativeVelocity;
}

export function scrollTo(target: string | HTMLElement | number) {
  if (loco) {
    loco.scrollTo(target, { duration: 1.8, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (typeof el === 'number') window.scrollTo({ top: el });
  else el?.scrollIntoView({ behavior: 'auto' });
}
