export const EMAIL = "joelonyedikaepic@gmail.com";
export const GITHUB = "https://github.com/joelonyedika";
export const TWITTER = "https://twitter.com/highoctane0000";

export type Project = {
  slug: string; title: string; line: string; body: string; tech: string[];
  status: "Live" | "In progress"; url?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "collecto", title: "Collecto", status: "Live", url: "https://collecto-one.vercel.app/",
    line: "Invoicing for freelancers who want to get paid on time.",
    body: "A full-stack invoicing platform with Stripe payments, automated reminders, payment tracking and PDF generation.",
    tech: ["React", "TypeScript", "FastAPI", "Stripe", "PostgreSQL"],
  },
  {
    slug: "figma-clone", title: "Real-time Figma clone", status: "Live", url: "https://fig-pro-clone.vercel.app/",
    line: "A multiplayer design canvas.",
    body: "A collaborative canvas with live cursors and shared editing, built on a Supabase real-time backend.",
    tech: ["React", "TypeScript", "Supabase", "Framer Motion"],
  },
  {
    slug: "life-sim", title: "Life simulation game", status: "In progress",
    line: "A real-life simulation game.",
    body: "A simulation game about everyday life, currently in development.",
    tech: [],
  },
];

export const STACK = [
  { group: "Web", items: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind"] },
  { group: "AI", items: ["RAG pipelines", "LLM agents", "LangChain", "OpenAI", "PyTorch"] },
  { group: "Backend", items: ["Python", "FastAPI", "PostgreSQL", "Supabase", "Docker", "AWS"] },
];
