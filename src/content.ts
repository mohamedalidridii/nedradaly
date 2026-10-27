// Single source of copy for the site, distilled from Nedra Daly's public LinkedIn profile.

export const LINKEDIN = 'https://www.linkedin.com/in/nedra-daly/';
export const ACTIVITY = 'https://www.linkedin.com/in/nedra-daly/recent-activity/all/';
export const FASTERCAPITAL = 'https://fastercapital.com/mentor/nedra-daly.html';

export const profile = {
  name: ['Nedra', 'Daly'],
  role: 'SDGs Trainer & Consultant',
  roles: ['Speaker', 'Environmental Activist', 'Startup Mentor', 'CSR'],
  city: 'Tunis, Tunisia',
  timeZone: 'Africa/Tunis',
  signature: '#thinkGreen',
  tagline: 'Turning sustainability from a promise into a practice.',
};

export const manifesto = {
  kicker: 'Manifesto',
  text:
    'I help people reveal their potential and highlight their skills — grounded in neuroscience — ' +
    'so that every idea can grow into a project that lasts. Change starts with a mindset; ' +
    'a greener economy starts with the people brave enough to build it.',
  stats: [
    { value: '02', label: 'UN Climate Conferences as a Tunisian delegate — COP27 & COP28' },
    { value: '5+', label: 'Years training founders, students and changemakers' },
    { value: '2030', label: 'The agenda every workshop is built around' },
  ],
};

export type Milestone = {
  year: string;
  title: string;
  place: string;
  text: string;
  image: string;
};

export const milestones: Milestone[] = [
  {
    year: '2023',
    title: 'COP28 UAE',
    place: 'Dubai — Tunisian Delegate',
    text: 'Inside the Green Zone, between loss-and-damage debates and climate-finance corridors, making a Tunisian voice heard.',
    image: '/images/cop28-greenzone-1.webp',
  },
  {
    year: '2023',
    title: 'Austrian Leadership Program',
    place: 'Vienna & Vorarlberg',
    text: 'A week with the Diplomatic Academy of Vienna, visiting energy providers and clean-tech startups across Austria.',
    image: '/images/alps-1.webp',
  },
  {
    year: '2023',
    title: 'UNO City',
    place: 'Vienna — United Nations',
    text: 'Standing before the seventeen goals that shape her work, and the 2030 Agenda that ties them together.',
    image: '/images/unocity-3.webp',
  },
  {
    year: '2024',
    title: 'CSR, Politics & the SDGs',
    place: 'AIESEC Career Fair — Tunis',
    text: 'A panel on why corporate social responsibility is no longer optional — in Tunisia and everywhere else.',
    image: '/images/aiesec-2.webp',
  },
  {
    year: '2024',
    title: 'Sustainable Minds',
    place: 'World Engineering Day — ESPRIT',
    text: 'On the jury of a hackathon where young engineers pitched green solutions with real-world bite.',
    image: '/images/hackathon-1.webp',
  },
  {
    year: '2024',
    title: 'Youth Leadership Program',
    place: 'Toastmasters × MUST University',
    text: 'Eight weeks coordinating and mentoring young leaders in public speaking — where leaders are forged.',
    image: '/images/ylp-1.webp',
  },
];

export type Story = {
  date: string;
  dateISO: string;
  place: string;
  title: string;
  lede: string;
  body: string;
  quote?: { text: string; lang: string };
  images: string[];
  tags: string[];
};

// Her three most recent original posts, rewritten as editorial features.
export const stories: Story[] = [
  {
    date: '06 Oct 2025',
    dateISO: '2025-10-06',
    place: 'Salalah, Oman',
    title: 'Find your passion through sustainability',
    lede: 'At the Arab Youth Climate Forum, a room full of young delegates was asked a simple question: what would you build for the planet?',
    body:
      'Invited by Madad for Development and supported by Oman’s Environment Authority, Nedra opened the forum’s initiation sessions with a ' +
      'hands-on workshop. Sustainability stopped being a headline and became a path — one where the green economy is a career, ' +
      'not a sacrifice, and where every idea on a sticky note is a first draft of real action.',
    quote: { text: 'يحوّلون أفكارهم إلى أعمال ملموسة', lang: 'ar' },
    images: ['/images/salalah-1.webp', '/images/salalah-3.webp'],
    tags: ['Arab Youth Climate Forum', 'Green Economy', 'Workshop'],
  },
  {
    date: '15 Jul 2025',
    dateISO: '2025-07-15',
    place: 'Tunis → Rabat',
    title: 'A dream, then an idea, then a reality',
    lede: 'One year as President of Tunis Toastmasters — and a club that finished the season with Distinguished status.',
    body:
      'From chairing the French speech contest for District 107 to taking the stage at the Spring Conference in Rabat, the year was a ' +
      'masterclass in teamwork and voice. Along the way: meeting the International President and the 2024 World Champion of Public ' +
      'Speaking. The through-line never changed — grow, transform, inspire.',
    images: ['/images/toastmasters-1.webp'],
    tags: ['Leadership', 'Public Speaking', 'District 107'],
  },
  {
    date: '19 Jun 2024',
    dateISO: '2024-06-19',
    place: 'IHEC Carthage',
    title: 'Sustainable goals, green jobs',
    lede: 'At the very first ECOFEST, the question wasn’t whether the green transition is coming — it was who gets hired to build it.',
    body:
      'Hosted by the 3ZERO Clubs of the North under the vaulted arches of IHEC Carthage, Nedra’s keynote traced a line from the SDGs to ' +
      'the job market: the skills, the sectors and the mindset that turn a degree into a climate career. A packed hall, an open circle ' +
      'afterwards, and a lot of new #think_Green converts.',
    images: ['/images/ecofest-1.webp'],
    tags: ['ECOFEST', 'Green Jobs', 'Keynote'],
  },
];

export type Role = {
  period: string;
  title: string;
  org: string;
  detail: string;
  image: string;
};

export const experience: Role[] = [
  {
    period: '2024 — Now',
    title: 'Startup Mentor',
    org: 'FasterCapital',
    detail: 'Mentoring founders to launch impactful startups through the SDGs — remote, UAE.',
    image: '/images/youthspeak-3.webp',
  },
  {
    period: '2021 — Now',
    title: 'Trainer & Consultant',
    org: 'Independent',
    detail: 'How to create a sustainable startup — green entrepreneurship management.',
    image: '/images/salalah-2.webp',
  },
  {
    period: '2021 — 2022',
    title: 'ESG Manager',
    org: 'HP',
    detail: 'Growth strategy and communication through an ESG lens.',
    image: '/images/alps-2.webp',
  },
  {
    period: '2019 — 2022',
    title: 'Training Manager',
    org: 'Creformme',
    detail: 'Events, action plans, digital strategy and crisis-communication training.',
    image: '/images/hackathon-3.webp',
  },
  {
    period: '2016 — 2018',
    title: 'Advisor',
    org: 'Direct Line',
    detail: 'Activity management, client interventions and digital documentation.',
    image: '/images/youthspeak-2.webp',
  },
];

export const services = [
  {
    title: 'Training',
    text: 'Workshops on green entrepreneurship, the SDGs and CSR — for universities, incubators and teams.',
  },
  {
    title: 'Career Coaching',
    text: 'Neuroscience-informed coaching to reveal strengths and turn them into a sustainable career path.',
  },
  {
    title: 'Interview Preparation',
    text: 'Speak with clarity and conviction — honed on Toastmasters stages and international panels.',
  },
  {
    title: 'Change Management',
    text: 'Guiding organisations through the mindset shift that real sustainability demands.',
  },
];

export const topics = [
  '#thinkGreen',
  'Green Entrepreneurship',
  '#SDGs2030',
  'Climate Action',
  'Women Entrepreneurship',
  'Pre-incubation',
  '#YouthEmpowerment',
  'Mindset',
  'CSR & ESG',
  'Green Jobs',
  'Mentoring',
  'Just Transition',
];

export type Goal = { n: number; name: string; color: string; note?: string };

// Official UN SDG colours; notes mark the goals her work touches most.
export const goals: Goal[] = [
  { n: 1, name: 'No Poverty', color: '#E5243B' },
  { n: 2, name: 'Zero Hunger', color: '#DDA63A' },
  { n: 3, name: 'Good Health & Well-being', color: '#4C9F38', note: 'Talks on mental health through the SDGs.' },
  { n: 4, name: 'Quality Education', color: '#C5192D', note: 'Every workshop, every classroom, every hackathon jury.' },
  { n: 5, name: 'Gender Equality', color: '#FF3A21', note: 'Championing women entrepreneurs.' },
  { n: 6, name: 'Clean Water & Sanitation', color: '#26BDE2' },
  { n: 7, name: 'Affordable & Clean Energy', color: '#FCC30B', note: 'Renewables and the just transition.' },
  { n: 8, name: 'Decent Work & Growth', color: '#A21942', note: 'Green jobs and sustainable startups.' },
  { n: 9, name: 'Industry & Innovation', color: '#FD6925' },
  { n: 10, name: 'Reduced Inequalities', color: '#DD1367' },
  { n: 11, name: 'Sustainable Cities', color: '#FD9D24' },
  { n: 12, name: 'Responsible Consumption', color: '#BF8B2E' },
  { n: 13, name: 'Climate Action', color: '#3F7E44', note: 'Tunisian delegate at COP27 & COP28.' },
  { n: 14, name: 'Life Below Water', color: '#0A97D9' },
  { n: 15, name: 'Life on Land', color: '#56C02B' },
  { n: 16, name: 'Peace & Justice', color: '#00689D' },
  { n: 17, name: 'Partnerships', color: '#19486A', note: 'Building bridges — Tunisia, Austria, the UN.' },
];
