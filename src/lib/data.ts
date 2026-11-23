export const NAME = "Joel Onyedika";
export const EMAIL = "joelonyedikaepic@gmail.com";
export const GITHUB = "https://github.com/joelonyedika";
export const TWITTER = "https://twitter.com/highoctane0000";

export const mailto = (subject = "Let's work together") =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  description: string;
  tech: string[];
  cover: string;
  live?: string;
  status: "Live" | "In development";
};

export const PROJECTS: Project[] = [
  {
    slug: "collecto",
    title: "Collecto",
    kind: "SaaS · Payments",
    year: "2025",
    status: "Live",
    description:
      "A full-stack invoicing platform for freelancers: Stripe payments, automated reminders, payment tracking and PDF generation in one place.",
    tech: ["React", "TypeScript", "FastAPI", "Stripe", "PostgreSQL"],
    cover: "/projects/collecto.webp",
    live: "https://collecto-one.vercel.app/",
  },
  {
    slug: "velga",
    title: "Velga Store",
    kind: "Concept storefront · Client work",
    year: "2026",
    status: "Live",
    description:
      "A cinematic concept storefront for a performance-apparel brand: a full-bleed campaign hero, an editorial product rail and an interactive \u201cRunway\u201d outfit builder with a saved styling bag.",
    tech: ["Concept", "E-commerce UI", "Interactive", "Responsive"],
    cover: "/projects/velga.webp",
    live: "https://ilovenike-ofxl.vercel.app/",
  },
  {
    slug: "figma-clone",
    title: "Real-time design canvas",
    kind: "Real-time · Collaboration",
    year: "2025",
    status: "Live",
    description:
      "A Figma-style multiplayer canvas with live cursors and shared editing, built on a Supabase real-time backend.",
    tech: ["React", "TypeScript", "Supabase", "Framer Motion"],
    cover: "/projects/figma-clone.webp",
    live: "https://fig-pro-clone.vercel.app/",
  },
  {
    slug: "life-sim",
    title: "Life simulation game",
    kind: "Game · In development",
    year: "2026",
    status: "In development",
    description: "A simulation game about everyday life, currently in development.",
    tech: ["Game design", "Simulation"],
    cover: "/projects/life-sim.webp",
  },
];

export const COVERS = PROJECTS.map((p) => p.cover).concat("/projects/your-project.webp");

export const SERVICES = [
  {
    n: "01",
    title: "Web Design",
    text: "Cinematic, conversion-focused websites and 3D experiences. Scroll stories, motion-rich interfaces and pages that make people stop, look and get in touch.",
    chips: ["Landing pages", "Brand sites", "3D & motion", "Design systems"],
  },
  {
    n: "02",
    title: "Development",
    text: "Complete products from first screen to database. Dashboards, SaaS platforms, marketplaces and real-time tools that are fast, tested and built to last.",
    chips: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
  },
  {
    n: "03",
    title: "Growth",
    text: "Payments, billing and the plumbing that turns a good idea into a working business. Stripe, webhooks, analytics and performance work that moves the numbers.",
    chips: ["Stripe", "Invoicing", "Webhooks", "Performance", "SEO"],
  },
  {
    n: "04",
    title: "AI Integration",
    text: "RAG apps that answer from your own documents, and LLM agents that use your tools and clear the repetitive work off your team's plate.",
    chips: ["RAG", "LangChain", "OpenAI", "LLM agents"],
  },
];

export const DELIVERABLES = [
  "Landing pages", "Marketing websites", "Web apps & dashboards", "SaaS platforms", "3D experiences",
  "Stripe payments", "AI assistants", "RAG apps", "AI agents", "Custom platforms",
];

export const STEPS = [
  { n: "01", title: "Strategy", text: "We define the goal, the audience and the scope. You get a clear plan and an honest timeline before a line of code." },
  { n: "02", title: "Build", text: "Architecture, interface and code, built in the open with regular previews so nothing surprises you." },
  { n: "03", title: "Launch", text: "Tested, fast and deployed. Analytics, payments and the details that make launch day boring in the best way." },
  { n: "04", title: "Grow", text: "I stay close after launch: iterating on what the data says and shipping the next improvement." },
];

export const STACK = [
  "React", "TypeScript", "Next.js", "Three.js", "GSAP", "Python", "FastAPI", "Node.js", "PostgreSQL",
  "Supabase", "Stripe", "LangChain", "OpenAI", "RAG", "LLM agents", "PyTorch", "Docker", "AWS",
];

export const REASONS = [
  { title: "One person, whole product", text: "Design, front-end, back-end and AI under one roof. No hand-offs, no lost context, no agency overhead." },
  { title: "Fast by default", text: "Performance is designed in from the first commit, not patched on at the end." },
  { title: "Built to last", text: "Readable, tested code with clear structure, so it's easy to extend and hand over." },
  { title: "Direct line", text: "You talk to the person writing the code. Questions get answers, not ticket numbers." },
];

export const STATS = [
  { value: 2, suffix: "+", label: "Live products shipped" },
  { value: 4, suffix: "", label: "Disciplines, one developer" },
  { value: 100, suffix: "%", label: "Hands-on, start to finish" },
];

export const NAV = [
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
];
