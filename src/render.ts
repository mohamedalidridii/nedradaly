import {
  ACTIVITY,
  FASTERCAPITAL,
  LINKEDIN,
  experience,
  goals,
  manifesto,
  milestones,
  profile,
  services,
  stories,
  topics,
} from './content';

const pad = (n: number) => String(n).padStart(2, '0');

const arrow = `<svg class="icon-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" /></svg>`;

function hero() {
  return `
  <section class="hero" data-theme="dark" id="home">
    <p class="hero__eyebrow" data-reveal>
      <span>${profile.role}</span><span class="hero__sep"></span><span>${profile.city}</span>
    </p>
    <h1 class="hero__title" aria-label="${profile.name.join(' ')}">
      <span class="hero__word" data-hero-word>${profile.name[0]}</span>
      <span class="hero__word hero__word--italic" data-hero-word>${profile.name[1]}</span>
    </h1>
    <div class="hero__foot">
      <p class="hero__tagline" data-split>${profile.tagline}</p>
      <ul class="hero__roles">${profile.roles.map((r) => `<li data-reveal>${r}</li>`).join('')}</ul>
      <p class="hero__scroll" data-reveal><span>Scroll</span><i></i></p>
    </div>
    <p class="hero__sig" data-scroll data-scroll-speed="-0.15">${profile.signature}</p>
  </section>`;
}

function manifestoSection() {
  return `
  <section class="manifesto" data-theme="light" id="about">
    <div class="manifesto__grid">
      <p class="kicker" data-reveal><span>01</span>${manifesto.kicker}</p>
      <p class="manifesto__text" data-words>${manifesto.text}</p>
      <figure class="manifesto__portrait" data-gl="displace" data-cursor="Hello">
        <img src="/images/cop28-1.webp" alt="Nedra Daly at COP28 UAE in Dubai, wearing a traditional Tunisian dress" width="800" height="600" />
        <figcaption>COP28 UAE — Dubai, 2023</figcaption>
      </figure>
      <ul class="manifesto__stats">
        ${manifesto.stats
          .map(
            (s) => `<li data-reveal><strong class="stat__value">${s.value}</strong><span class="stat__label">${s.label}</span></li>`,
          )
          .join('')}
      </ul>
    </div>
  </section>`;
}

function world() {
  return `
  <section class="world" data-theme="dark" id="world">
    <div class="world__pin">
      <header class="world__head">
        <p class="kicker" data-reveal><span>02</span>Milestones</p>
        <h2 class="display" data-split>On the <em>world</em> stage</h2>
      </header>
      <div class="world__track" data-cursor="Drag">
        ${milestones
          .map(
            (m, i) => `
          <article class="mile">
            <span class="mile__num">${pad(i + 1)}</span>
            <figure class="mile__media" data-gl="bend">
              <img src="${m.image}" alt="${m.title} — ${m.place}" loading="lazy" />
            </figure>
            <div class="mile__body">
              <p class="mile__meta">${m.year} · ${m.place}</p>
              <h3 class="mile__title">${m.title}</h3>
              <p class="mile__text">${m.text}</p>
            </div>
          </article>`,
          )
          .join('')}
        <div class="world__end"><p class="display">And the<br /><em>journey</em><br />continues.</p></div>
      </div>
      <div class="world__progress"><span></span></div>
    </div>
  </section>`;
}

function sdg() {
  const r = 210;
  const c = 2 * Math.PI * r;
  const seg = c / goals.length;
  const gap = 6;
  const arcs = goals
    .map(
      (g, i) => `
      <circle class="sdg__arc${g.note ? ' is-focus' : ''}" data-goal="${i}" cx="250" cy="250" r="${r}"
        stroke="${g.color}" stroke-dasharray="${seg - gap} ${c - seg + gap}"
        stroke-dashoffset="${-i * seg}" pathLength="${c}" tabindex="0" role="button"
        aria-label="Goal ${g.n}: ${g.name}" />`,
    )
    .join('');
  return `
  <section class="sdg" data-theme="dark" id="goals">
    <div class="sdg__grid">
      <div class="sdg__copy">
        <p class="kicker" data-reveal><span>03</span>The 2030 Agenda</p>
        <h2 class="display" data-split>Seventeen goals.<br /><em>One</em> agenda.</h2>
        <p class="sdg__lede" data-reveal>Every training, talk and mentoring session maps back to the UN Sustainable Development Goals. Hover the ring — the highlighted goals are where her work lives.</p>
      </div>
      <div class="sdg__ring">
        <svg viewBox="0 0 500 500" class="sdg__svg">${arcs}</svg>
        <div class="sdg__center" aria-live="polite">
          <p class="sdg__n">SDG</p>
          <p class="sdg__name">Hover a goal</p>
          <p class="sdg__note"></p>
        </div>
      </div>
    </div>
  </section>`;
}

function storiesSection() {
  return `
  <section class="stories" data-theme="light" id="stories">
    <header class="stories__head">
      <p class="kicker" data-reveal><span>04</span>Latest stories</p>
      <h2 class="display" data-split>Notes from <em>the field</em></h2>
    </header>
    <div class="stories__stack">
      ${stories
        .map(
          (s, i) => `
        <article class="story" style="--i:${i}">
          <div class="story__media">
            <figure class="story__img story__img--main" data-ink>
              <img src="${s.images[0]}" alt="${s.title} — ${s.place}" loading="lazy" />
            </figure>
            ${s.images[1] ? `<figure class="story__img story__img--inset" data-ink><img src="${s.images[1]}" alt="" loading="lazy" /></figure>` : ''}
          </div>
          <div class="story__body">
            <p class="story__meta"><span>${pad(i + 1)}</span><time datetime="${s.dateISO}">${s.date}</time><span>${s.place}</span></p>
            <h3 class="story__title">${s.title}</h3>
            <p class="story__lede">${s.lede}</p>
            <p class="story__text">${s.body}</p>
            ${s.quote ? `<blockquote class="story__quote" lang="${s.quote.lang}" dir="rtl">“${s.quote.text}”</blockquote>` : ''}
            <div class="story__foot">
              <ul class="story__tags">${s.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
              <a class="link-arrow" href="${ACTIVITY}" target="_blank" rel="noopener" data-cursor="Read">Read on LinkedIn ${arrow}</a>
            </div>
          </div>
        </article>`,
        )
        .join('')}
    </div>
  </section>`;
}

function experienceSection() {
  return `
  <section class="experience" data-theme="light" id="experience">
    <header class="experience__head">
      <p class="kicker" data-reveal><span>05</span>Experience</p>
      <h2 class="display" data-split>A career built<br />on <em>impact</em></h2>
    </header>
    <ul class="roles">
      ${experience
        .map(
          (r) => `
        <li class="role" data-preview="${r.image}">
          <span class="role__period">${r.period}</span>
          <span class="role__title">${r.title}</span>
          <span class="role__org">${r.org}</span>
          <span class="role__detail">${r.detail}</span>
        </li>`,
        )
        .join('')}
    </ul>
    <p class="experience__edu" data-reveal>Education — <strong>ISBST</strong>, Tunisia</p>
  </section>`;
}

function servicesSection() {
  return `
  <section class="services" data-theme="dark" id="services">
    <header class="services__head">
      <p class="kicker" data-reveal><span>06</span>Services</p>
      <h2 class="display" data-split>How we can<br /><em>work together</em></h2>
    </header>
    <ol class="svc">
      ${services
        .map(
          (s, i) => `
        <li class="svc__item">
          <button class="svc__btn" aria-expanded="false">
            <span class="svc__n">${pad(i + 1)}</span>
            <span class="svc__title">${s.title}</span>
            <span class="svc__plus" aria-hidden="true"><i></i><i></i></span>
          </button>
          <div class="svc__panel"><div class="svc__panel-inner">
            <p>${s.text}</p>
            <a class="link-arrow" href="${LINKEDIN}" target="_blank" rel="noopener">Request this service ${arrow}</a>
          </div></div>
        </li>`,
        )
        .join('')}
    </ol>
  </section>`;
}

function marquee() {
  const row = (items: string[]) =>
    `<div class="marquee__inner">${[...items, ...items]
      .map((t) => `<span class="marquee__item">${t}</span><span class="marquee__leaf" aria-hidden="true">✦</span>`)
      .join('')}</div>`;
  const half = Math.ceil(topics.length / 2);
  return `
  <section class="marquee" data-theme="dark" aria-label="Topics">
    <div class="marquee__row" data-dir="1">${row(topics.slice(0, half))}</div>
    <div class="marquee__row marquee__row--outline" data-dir="-1">${row(topics.slice(half))}</div>
  </section>`;
}

function contact() {
  return `
  <section class="contact" data-theme="dark" id="contact">
    <p class="kicker" data-reveal><span>07</span>Contact</p>
    <div class="contact__main">
      <h2 class="contact__title" data-split>Let’s build something <em>sustainable.</em></h2>
      <figure class="contact__portrait" data-gl="displace" data-cursor="Say hi">
        <img src="/images/headshot.webp" alt="Portrait of Nedra Daly" width="462" height="577" loading="lazy" />
      </figure>
    </div>
    <div class="contact__ctas">
      <a class="pill pill--solid" href="${LINKEDIN}" target="_blank" rel="noopener" data-magnetic>
        <span>Message on LinkedIn</span>${arrow}
      </a>
      <a class="pill" href="${FASTERCAPITAL}" target="_blank" rel="noopener" data-magnetic>
        <span>Book a mentoring session</span>${arrow}
      </a>
    </div>
    <footer class="footer">
      <p>© ${new Date().getFullYear()} Nedra Daly</p>
      <p class="footer__sig">${profile.signature}</p>
      <a href="#top" data-scroll-to class="footer__top" data-magnetic>Back to top ↑</a>
    </footer>
  </section>`;
}

export const menuLinks = [
  ['About', '#about'],
  ['Milestones', '#world'],
  ['The Goals', '#goals'],
  ['Stories', '#stories'],
  ['Experience', '#experience'],
  ['Contact', '#contact'],
] as const;

export function render() {
  const main = document.querySelector('main')!;
  main.innerHTML = [
    hero(),
    manifestoSection(),
    world(),
    sdg(),
    storiesSection(),
    experienceSection(),
    servicesSection(),
    marquee(),
    contact(),
  ].join('');

  document.querySelector('.menu__list')!.innerHTML = menuLinks
    .map(
      ([label, href], i) =>
        `<li><a href="${href}" class="menu__link"><span class="menu__n">${pad(i + 1)}</span><span class="menu__label">${label}</span></a></li>`,
    )
    .join('');
}
