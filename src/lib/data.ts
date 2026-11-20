export const NAME = "JOEL ONYEDIKA";
export const TITLE = "FULL-STACK SOFTWARE DEVELOPER";

export const EMAIL = "joelonyedikaepic@gmail.com";
export const GITHUB = "https://github.com/joelonyedika";
export const TWITTER = "https://twitter.com/highoctane0000";
/** PLACEHOLDER: paste your LinkedIn profile URL here and the contact link switches on. */
export const LINKEDIN = "";

export type Project = {
  slug: string;
  title: string;
  status: "Live" | "In progress";
  description: string;
  tech: string[];
  /** Real screenshot path, e.g. "/projects/collecto.jpg" (file in public/projects/). Omit to show the placeholder. */
  screenshot?: string;
  live?: string;
  source?: string;
  placeholderCopy?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "collecto",
    title: "Collecto",
    status: "Live",
    description:
      "A full-stack invoicing platform for freelancers, with Stripe payments, automated reminders, payment tracking and PDF generation.",
    tech: ["React", "TypeScript", "FastAPI", "Stripe", "PostgreSQL"],
    live: "https://collecto-one.vercel.app/",
  },
  {
    slug: "figma-clone",
    title: "Real-time Figma clone",
    status: "Live",
    description:
      "A multiplayer design canvas with live cursors and shared editing, built on a Supabase real-time backend.",
    tech: ["React", "TypeScript", "Supabase", "Framer Motion"],
    live: "https://fig-pro-clone.vercel.app/",
  },
  {
    slug: "life-sim",
    title: "Life simulation game",
    status: "In progress",
    description:
      "A simulation game about everyday life, currently in development. Placeholder copy: replace with the real description.",
    tech: [],
    placeholderCopy: true,
  },
];

export const ABOUT_DISCIPLINES = [
  { name: "Frontend", text: "Responsive, accessible interfaces built with JavaScript and React.", tags: ["JavaScript", "React"] },
  { name: "Backend", text: "APIs, data models and integrations, written mostly in Python.", tags: ["Python"] },
  { name: "Full-stack", text: "Interface, API and database designed together as one product.", tags: ["End to end"] },
];

export const SKILLS = [
  { group: "Programming languages", items: ["Python", "JavaScript", "TypeScript"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { group: "Backend", items: ["FastAPI", "Node.js", "PostgreSQL", "Supabase"] },
  { group: "Tools and technologies", items: ["Docker", "AWS", "Stripe", "RAG pipelines", "LLM agents", "LangChain", "OpenAI", "PyTorch"] },
];

export const TESTIMONIALS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  quote: "Placeholder testimonial. Replace this with a real quote from a client or collaborator.",
  name: "Name Surname",
  role: "Role, Company",
}));

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];
