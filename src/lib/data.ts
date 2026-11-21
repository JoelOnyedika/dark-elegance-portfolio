export const TITLE = "FULL-STACK SOFTWARE DEVELOPER";

export const EMAIL = "joelonyedikaepic@gmail.com";
export const GITHUB = "https://github.com/joelonyedika";
export const TWITTER = "https://twitter.com/highoctane0000";
/** PLACEHOLDER: paste your LinkedIn profile URL here and the contact link switches on. */
export const LINKEDIN = "";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  status: "Live" | "In progress" | "Next";
  description: string;
  tech: string[];
  /** Abstract cover art in /public/projects. Replace with your own artwork any time. */
  cover: string;
  /** Optional real screenshot (e.g. "/projects/collecto-shot.jpg"). Shown instead of the cover when set. */
  screenshot?: string;
  live?: string;
  source?: string;
  /** Marks the closing "your project" card, which links to the contact section instead. */
  cta?: boolean;
  placeholderCopy?: boolean;
};

/** Add as many projects as you like: the 3D showcase and the grid view both scale to any number. */
export const PROJECTS: Project[] = [
  {
    slug: "collecto",
    title: "Collecto",
    kind: "SaaS · Payments",
    status: "Live",
    description:
      "A full-stack invoicing platform for freelancers: Stripe payments, automated reminders, payment tracking and PDF generation, all in one place.",
    tech: ["React", "TypeScript", "FastAPI", "Stripe", "PostgreSQL"],
    cover: "/projects/collecto.webp",
    live: "https://collecto-one.vercel.app/",
  },
  {
    slug: "figma-clone",
    title: "Real-time design canvas",
    kind: "Real-time · Collaboration",
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
    status: "In progress",
    description: "A simulation game about everyday life, currently in development. Placeholder copy: replace with the real description.",
    tech: [],
    cover: "/projects/life-sim.webp",
    placeholderCopy: true,
  },
  {
    slug: "your-project",
    title: "Your project here",
    kind: "Let's build it",
    status: "Next",
    description: "Got an idea, a product to ship or a problem that needs solving? This slot is waiting for it.",
    tech: ["Web", "AI", "Payments", "Real-time"],
    cover: "/projects/your-project.webp",
    cta: true,
  },
];

export const SERVICES = [
  {
    tag: "Front-end",
    title: "Websites & 3D experiences",
    text: "Full-blown, beautiful websites and web apps: cinematic scroll stories, interactive 3D scenes and motion-rich interfaces that make people stop and look.",
    chips: ["React", "Three.js", "GSAP"],
  },
  {
    tag: "Full-stack",
    title: "Web apps & SaaS",
    text: "Complete products from first screen to database: dashboards, platforms, marketplaces and real-time tools people actually enjoy using.",
    chips: ["React", "Python", "PostgreSQL"],
  },
  {
    tag: "AI",
    title: "RAG applications",
    text: "Chat with your documents, search your knowledge base and get answers with sources. Retrieval-augmented systems built on your own data.",
    chips: ["RAG", "LangChain", "OpenAI"],
  },
  {
    tag: "Automation",
    title: "AI agents & workflows",
    text: "LLM-powered agents that use your tools, take actions and clear the repetitive work off your team's plate.",
    chips: ["LLM agents", "Python", "APIs"],
  },
  {
    tag: "Business",
    title: "Payments & integrations",
    text: "Stripe billing, invoicing, webhooks and third-party APIs: the plumbing that turns a good idea into a working business.",
    chips: ["Stripe", "FastAPI", "Webhooks"],
  },
];

export const STEPS = [
  { n: "01", title: "Tell me what you're building", text: "Share the idea, the problem and the deadline. I'll ask the right questions and come back with a clear plan, scope and an honest timeline." },
  { n: "02", title: "I design the system", text: "Architecture, data model and interface decided up front, so the build is fast and nothing surprises you later." },
  { n: "03", title: "Build, launch, improve", text: "Clean, tested, fast code on the right stack for the job. It ships, and I stay close to keep making it better." },
];

export const STACK = [
  "React", "TypeScript", "Next.js", "Three.js", "GSAP", "Python", "FastAPI", "Node.js", "PostgreSQL", "Supabase", "Stripe",
  "LangChain", "OpenAI", "RAG pipelines", "LLM agents", "PyTorch", "Docker", "AWS",
];

export const CRAFT = [
  { title: "Fast by default", text: "Performance is designed in from the first commit, not patched on at the end." },
  { title: "Built to last", text: "Readable, tested code with clear structure, so it's easy to extend and hand over." },
  { title: "Secure & scalable", text: "Sensible auth, data handling and architecture that grows with your users." },
];

export const TESTIMONIALS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  quote: "Placeholder testimonial. Replace this with a real quote from a client or collaborator.",
  name: "Name Surname",
  role: "Role, Company",
  /** PLACEHOLDER portrait: drop a real photo into /public/avatars and point to it here. */
  avatar: `/avatars/p${i + 1}.webp`,
}));

export const NAV = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Kind words" },
  { id: "contact", label: "Contact" },
];
