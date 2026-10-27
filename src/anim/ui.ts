import { gsap } from 'gsap';
import { pointer } from '../pointer';
import { lockScroll, scrollTo } from '../scroll';
import { profile } from '../content';

/** Dot + ring cursor; elements with data-cursor show a label, links grow the ring. */
export function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.documentElement.classList.add('has-cursor');
  const cursor = document.querySelector<HTMLElement>('.cursor')!;
  const dot = cursor.querySelector<HTMLElement>('.cursor__dot')!;
  const ring = cursor.querySelector<HTMLElement>('.cursor__ring')!;
  const label = cursor.querySelector<HTMLElement>('.cursor__label')!;
  const ringPos = { x: pointer.x, y: pointer.y };

  gsap.ticker.add(() => {
    ringPos.x += (pointer.x - ringPos.x) * 0.16;
    ringPos.y += (pointer.y - ringPos.y) * 0.16;
    dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
  });

  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement;
    const labelled = t.closest<HTMLElement>('[data-cursor]');
    const link = t.closest('a, button, [role="button"]');
    if (labelled && !(link && labelled.contains(link) && link !== labelled)) {
      label.textContent = labelled.dataset.cursor!;
      cursor.classList.add('is-label');
      cursor.classList.remove('is-link');
    } else {
      cursor.classList.remove('is-label');
      cursor.classList.toggle('is-link', !!link);
    }
  });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
}

/** Elements with data-magnetic lean toward the pointer. */
export function initMagnetic() {
  if (!matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/** Fullscreen menu with a clip-path wipe and staggered links. */
export function initMenu(motion: boolean) {
  const btn = document.querySelector<HTMLButtonElement>('.nav__menu')!;
  const label = btn.querySelector('.nav__menu-label')!;
  const menu = document.querySelector<HTMLElement>('.menu')!;
  const links = menu.querySelectorAll<HTMLElement>('.menu__label');
  const meta = menu.querySelectorAll<HTMLElement>('.menu__n, .menu__foot');
  const img = menu.querySelector<HTMLElement>('.menu__img')!;
  const d = motion ? 1 : 0.001;
  let open = false;

  const toggle = (state: boolean) => {
    open = state;
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close' : 'Menu';
    lockScroll(open);
    gsap.killTweensOf([menu, links, meta, img]);
    if (open) {
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 * d, ease: 'expo.inOut' });
      gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 1.2 * d, stagger: 0.06 * d, delay: 0.5 * d, ease: 'expo.out' });
      gsap.fromTo(meta, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 * d, delay: 0.7 * d });
      gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4 * d, delay: 0.55 * d, ease: 'expo.inOut' });
    } else {
      gsap.to(links, { yPercent: -110, duration: 0.6 * d, stagger: 0.03 * d, ease: 'expo.in' });
      gsap.to(menu, {
        clipPath: 'inset(0% 0% 0% 100%)',
        duration: 0.9 * d,
        delay: 0.3 * d,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
      });
    }
  };

  btn.addEventListener('click', () => toggle(!open));
  addEventListener('keydown', (e) => e.key === 'Escape' && open && toggle(false));
  menu.querySelectorAll<HTMLAnchorElement>('.menu__link').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      toggle(false);
      setTimeout(() => scrollTo(a.getAttribute('href')!), 350);
    }),
  );
}

/** Live local time in Tunis. */
export function initClock() {
  const el = document.querySelector('.nav__clock')!;
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: profile.timeZone });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 15000);
}
