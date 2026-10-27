import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const themes = {
  dark: { '--bg': '#0e1a14', '--fg': '#ece7dc', '--accent': '#d9a441' },
  light: { '--bg': '#ece7dc', '--fg': '#0e1a14', '--accent': '#9b6a1d' },
} as const;

/** Body colour follows whichever section owns the middle of the viewport. */
export function initThemes() {
  const root = document.documentElement;
  document.querySelectorAll<HTMLElement>('[data-theme]').forEach((section) => {
    const theme = themes[section.dataset.theme as keyof typeof themes];
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return;
        gsap.to(root, { ...theme, duration: 0.9, ease: 'power2.inOut', overwrite: 'auto' });
        root.dataset.theme = section.dataset.theme;
      },
    });
  });
}

/** Headline line reveals, generic fade-ups and the manifesto's word-by-word scrub. */
export function initTextReveals() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (el.closest('.hero')) return;
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          rotate: 2.5,
          duration: 1.4,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        }),
    });
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from(el, {
      y: 32,
      autoAlpha: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'word' });
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true },
      },
    );
  });
}
