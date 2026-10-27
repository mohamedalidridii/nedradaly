import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type { GL } from '../gl/Canvas';
import { goals } from '../content';
import { pointer } from '../pointer';
import { velocity } from '../scroll';

gsap.registerPlugin(ScrollTrigger, SplitText);

const DESKTOP = '(min-width: 901px)';

/** The intro once the curtain lifts: letters rise, the earth fades in. */
export function heroIntro(gl: GL | null) {
  const words = gsap.utils.toArray<HTMLElement>('[data-hero-word]');
  const chars = words.flatMap((w) => SplitText.create(w, { type: 'chars', charsClass: 'char' }).chars);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from(chars, { yPercent: 115, rotate: 6, duration: 1.8, stagger: 0.045 }, 0)
    .from('.hero [data-reveal], .hero__tagline', { y: 24, autoAlpha: 0, duration: 1.4, stagger: 0.06 }, 0.5)
    .from('.nav', { yPercent: -100, autoAlpha: 0, duration: 1.2 }, 0.7);
  if (gl) tl.to(gl.earth.uniforms.uIntro, { value: 1, duration: 2.4, ease: 'power2.out' }, 0.1);
  return tl;
}

/** The earth unfurls into a field as the hero leaves, and returns as a globe behind the contact section. */
export function initHeroScroll(gl: GL | null) {
  gsap.to('.hero__title', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  if (!gl) return;
  const u = gl.earth.uniforms;
  gsap
    .timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: 1 } })
    .fromTo(u.uMorph, { value: 0 }, { value: 1, ease: 'none', immediateRender: false }, 0)
    .fromTo(u.uAlpha, { value: 1 }, { value: 0, ease: 'power1.in', duration: 0.5, immediateRender: false }, 0.5);

  gsap
    .timeline({ scrollTrigger: { trigger: '.contact', start: 'top 70%', end: 'bottom bottom', scrub: 1 } })
    .fromTo(u.uMorph, { value: 1 }, { value: 0, ease: 'none', immediateRender: false }, 0)
    .fromTo(u.uAlpha, { value: 0 }, { value: 0.7, ease: 'none', immediateRender: false }, 0);
}

/** Reveal each GL plane with its ink shader when it scrolls into view. */
export function initMediaReveals(gl: GL | null) {
  document.querySelectorAll('[data-gl]').forEach((el) => {
    const u = gl?.media.uniformsFor(el);
    if (!u) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      // The horizontal gallery moves sideways, so reveal those once the section arrives.
      ...(el.closest('.world') && matchMedia(DESKTOP).matches ? { trigger: '.world', start: 'top 60%' } : {}),
      once: true,
      onEnter: () => gsap.to(u.uReveal, { value: 1, duration: 2.2, ease: 'power2.out', delay: Math.random() * 0.25 }),
    });
  });
}

/** Pinned horizontal gallery on desktop; a plain vertical stack on mobile. */
export function initWorld() {
  const mm = gsap.matchMedia();
  mm.add(DESKTOP, () => {
    const track = document.querySelector<HTMLElement>('.world__track')!;
    const distance = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.world',
        pin: '.world__pin',
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set('.world__progress span', { scaleX: self.progress }),
      },
    });
    gsap.utils.toArray<HTMLElement>('.mile__num').forEach((n) => {
      gsap.to(n, {
        xPercent: -60,
        ease: 'none',
        scrollTrigger: { trigger: '.world', start: 'top top', end: () => `+=${distance()}`, scrub: true },
      });
    });
  });
}

/** SDG ring: arcs bloom in, the wheel turns with scroll, and hovering reveals each goal. */
export function initSdg(motion: boolean) {
  const arcs = gsap.utils.toArray<SVGCircleElement>('.sdg__arc');
  const n = document.querySelector('.sdg__n')!;
  const name = document.querySelector('.sdg__name')!;
  const note = document.querySelector('.sdg__note')!;

  const show = (i: number | null) => {
    arcs.forEach((a, j) => a.classList.toggle('is-active', j === i));
    if (i === null) {
      n.textContent = 'SDG';
      name.textContent = 'Hover a goal';
      note.textContent = '';
      return;
    }
    const g = goals[i];
    n.textContent = String(g.n).padStart(2, '0');
    name.textContent = g.name;
    note.textContent = g.note ?? '';
    if (motion) gsap.fromTo([n, name, note], { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.6, ease: 'expo.out' });
  };
  arcs.forEach((a, i) => {
    a.addEventListener('pointerenter', () => show(i));
    a.addEventListener('focus', () => show(i));
  });
  document.querySelector('.sdg__svg')!.addEventListener('pointerleave', () => show(null));

  if (!motion) return;
  gsap.from(arcs, {
    opacity: 0,
    strokeWidth: 0,
    duration: 1.4,
    stagger: { each: 0.05, from: 'start' },
    ease: 'expo.out',
    clearProps: 'opacity,strokeWidth',
    scrollTrigger: { trigger: '.sdg__ring', start: 'top 75%', once: true },
  });
  gsap.fromTo(
    '.sdg__svg',
    { rotate: -150 },
    { rotate: -30, ease: 'none', scrollTrigger: { trigger: '.sdg', start: 'top bottom', end: 'bottom top', scrub: 1 } },
  );
}

/** Stacked story cards: each one sinks back as the next arrives; images ink in on entry. */
export function initStories() {
  const cards = gsap.utils.toArray<HTMLElement>('.story');
  const mm = gsap.matchMedia();
  mm.add(DESKTOP, () => {
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.fromTo(
        card,
        { scale: 1, filter: 'brightness(1)' },
        {
          scale: 0.92,
          filter: 'brightness(0.86)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
        },
      );
    });
  });
  gsap.utils.toArray<HTMLElement>('[data-ink]').forEach((fig, i) => {
    const img = fig.querySelector('img');
    gsap
      .timeline({ scrollTrigger: { trigger: fig, start: 'top 85%', once: true } })
      .fromTo(
        fig,
        { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.6, ease: 'expo.inOut', delay: (i % 2) * 0.2 },
      )
      .to(img, { scale: 1, duration: 2, ease: 'expo.out' }, '-=1.1');
  });
}

/** Floating image that trails the cursor over the experience list. */
export function initRolePreview() {
  const preview = document.querySelector<HTMLElement>('.preview')!;
  const inner = preview.querySelector<HTMLElement>('.preview__inner')!;
  const pos = { x: pointer.x, y: pointer.y, r: 0 };
  let active = false;

  document.querySelectorAll<HTMLElement>('.role').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      inner.style.backgroundImage = `url(${row.dataset.preview})`;
      preview.classList.add('is-on');
      active = true;
    });
    row.addEventListener('pointerleave', () => {
      preview.classList.remove('is-on');
      active = false;
    });
  });

  // Scrolling away leaves the pointer still, so pointerleave never fires — hide on section exit too.
  ScrollTrigger.create({
    trigger: '.roles',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      if (self.isActive) return;
      preview.classList.remove('is-on');
      active = false;
    },
  });

  gsap.ticker.add(() => {
    if (!active && !preview.classList.contains('is-on')) return;
    const dx = pointer.x - pos.x;
    pos.x += dx * 0.12;
    pos.y += (pointer.y - pos.y) * 0.12;
    pos.r += (gsap.utils.clamp(-14, 14, dx * 0.08) - pos.r) * 0.1;
    preview.style.transform = `translate3d(${pos.x + 24}px, ${pos.y - preview.offsetHeight / 2}px, 0) rotate(${pos.r}deg)`;
  });
}

/** Two marquee rows whose speed and direction react to scroll velocity. */
export function initMarquee(motion: boolean) {
  const rows = gsap.utils.toArray<HTMLElement>('.marquee__row');
  if (!motion) return;
  const state = rows.map((row) => ({ inner: row.querySelector<HTMLElement>('.marquee__inner')!, dir: Number(row.dataset.dir), x: 0 }));
  let boost = 0;
  let flip = 1;
  gsap.ticker.add((_, delta) => {
    const v = velocity();
    if (Math.abs(v) > 0.5) flip = Math.sign(v);
    boost += (Math.min(Math.abs(v), 60) * 0.25 - boost) * 0.08;
    for (const s of state) {
      const half = s.inner.scrollWidth / 2;
      s.x -= s.dir * flip * (0.045 + boost * 0.02) * delta;
      if (s.x <= -half) s.x += half;
      if (s.x > 0) s.x -= half;
      s.inner.style.transform = `translate3d(${s.x}px, 0, 0)`;
    }
  });
}

/** Accordion for the services list. */
export function initServices() {
  document.querySelectorAll<HTMLButtonElement>('.svc__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.svc__btn').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!open));
      setTimeout(() => ScrollTrigger.refresh(), 850);
    });
  });
}
