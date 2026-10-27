# Nedra Daly — #thinkGreen

Portfolio site for Nedra Daly, SDGs trainer & consultant (Tunis).
Vite + TypeScript, Three.js (particle earth, DOM-synced image planes, preloader curtain),
GSAP (ScrollTrigger, SplitText) and Locomotive Scroll v5 (Lenis) on a single GSAP ticker.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production build in dist/
npm run preview
```

## Content
All copy lives in `src/content.ts` (profile, milestones, latest stories, experience, services, SDGs).

## Images
Source photos come from her public LinkedIn posts and are capped at ~800px by LinkedIn.
To swap in high-resolution originals, drop JPEGs with the same names into `assets-src/raw/`
and run `npm run images` to regenerate the WebP files in `public/images/`.
