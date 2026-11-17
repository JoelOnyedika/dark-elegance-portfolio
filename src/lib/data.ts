import {
  SiTypescript, SiJavascript, SiReact, SiNodedotjs, SiPython, SiDocker, SiAmazonwebservices, SiPostgresql,
  SiMongodb, SiGraphql, SiTailwindcss, SiNextdotjs, SiGit, SiRedis, SiLinux, SiFigma, SiFirebase,
  SiSupabase, SiPrisma, SiExpress, SiJest, SiFlask, SiDjango, SiFastapi,
} from "react-icons/si";
import { Wrench, Rocket, Zap } from "lucide-react";

export const EMAIL = "joelonyedikaepic@gmail.com";

export const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "voices", label: "Reviews" },
  { id: "contact", label: "Contact" },
];

export const PHRASES = ["I fix broken code.", "I build SaaS apps.", "I clean up codebases.", "I ship fast."];

export const SERVICES = [
  { icon: Wrench, title: "Code cleanup", text: "Inherited a nightmare? Or a security-flawed vibe-coded app? I refactor spaghetti into clean architecture, add tests, and document everything." },
  { icon: Rocket, title: "SaaS development", text: "I build production-ready apps. Auth, payments, databases, deployment. You get a product that works." },
  { icon: Zap, title: "Fast fixes", text: "Critical bug? Performance issues? I debug fast, fix it right, and deploy without breaking anything." },
];

export const SKILLS_1 = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" }, { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", icon: SiReact, color: "#61DAFB" }, { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Python", icon: SiPython, color: "#4B8BBE" }, { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" }, { name: "PostgreSQL", icon: SiPostgresql, color: "#5B87D6" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" }, { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" }, { name: "FastAPI", icon: SiFastapi, color: "#05998B" },
];
export const SKILLS_2 = [
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" }, { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "Redis", icon: SiRedis, color: "#DC382D" }, { name: "Linux", icon: SiLinux, color: "#FCC624" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" }, { name: "Django", icon: SiDjango, color: "#44B78B" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" }, { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
  { name: "Prisma", icon: SiPrisma, color: "#7C8DB5" }, { name: "Express.js", icon: SiExpress, color: "#ffffff" },
  { name: "Jest", icon: SiJest, color: "#C21325" }, { name: "Flask", icon: SiFlask, color: "#ffffff" },
];

export const PROJECTS = [
  {
    title: "Collecto", tagline: "Invoice management SaaS",
    description: "Full-stack invoice platform helping freelancers get paid. Stripe integration, automated reminders, payment tracking, PDF generation. Used by real clients managing $50k+ in invoices.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&q=80",
    tech: ["React", "TypeScript", "FastAPI", "Stripe", "PostgreSQL"], liveUrl: "https://collecto-one.vercel.app/", githubUrl: "#",
    highlight: "Live product", metrics: "Active clients, real revenue",
  },
  {
    title: "Real-Time Figma Clone", tagline: "Collaborative design tool",
    description: "Multiplayer canvas with live cursors and real-time collaboration. Built the entire real-time infrastructure with Supabase. Optimized rendering for 60fps with multiple users.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1000&q=80",
    tech: ["React", "TypeScript", "Supabase", "Framer Motion"], liveUrl: "https://fig-pro-clone.vercel.app/", githubUrl: "#",
    highlight: "Real-time sync", metrics: "Sub-100ms latency",
  },
  {
    title: "E-Commerce Platform", tagline: "Multi-vendor marketplace",
    description: "Custom marketplace with product management, order processing, payment handling. Admin dashboard, inventory tracking, automated emails. Deployed on AWS with Docker.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&q=80",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Docker"], liveUrl: "#", githubUrl: "#",
    highlight: "Production ready", metrics: "Handles 1000+ products",
  },
  {
    title: "Analytics Dashboard", tagline: "Data visualization tool",
    description: "Real-time analytics for tracking user behavior and revenue metrics. Custom chart components, optimized database queries, multiple data source integrations.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80",
    tech: ["React", "D3.js", "Python", "PostgreSQL", "Redis"], liveUrl: "#", githubUrl: "#",
    highlight: "Real-time data", metrics: "10k events/min",
  },
];

export const TESTIMONIALS = [
  { name: "Marcus Johnson", role: "Product Manager, Stripe", avatar: "MJ", content: "Working with Joel on our payment dashboard redesign was fantastic. He took the time to understand our users' pain points and delivered a solution that reduced support tickets by 40%. His React expertise really showed." },
  { name: "Alex Turner", role: "CTO, FinanceFlow", avatar: "AT", content: "Joel rebuilt our entire frontend in Next.js and the performance improvements were immediate. Page load times dropped from 4s to under 1s. He also documented everything thoroughly, which made handoff seamless." },
  { name: "Jordan Blake", role: "Founder, LocalEats", avatar: "JB", content: "I needed a mobile-first restaurant discovery app built quickly. Joel delivered in 6 weeks, handled all the API integrations, and even helped me prep for my investor demo. The app is still running smoothly two years later." },
  { name: "David Park", role: "Head of Engineering, HealthTrack", avatar: "DP", content: "Joel joined us for a 3-month contract to help migrate our legacy codebase to TypeScript. Not only did he complete the migration, but he also set up proper testing workflows and mentored our junior developers. We've tried to hire him full-time twice." },
  { name: "Amara Okafor", role: "Design Lead, CreativeHub", avatar: "AO", content: "As a designer, I'm picky about implementation details. Joel nailed every animation, every responsive breakpoint, and every micro-interaction. He pushed back when something wasn't feasible and always suggested better alternatives. True collaboration." },
  { name: "James Liu", role: "Solo Founder, TaskMaster", avatar: "JL", content: "Joel built my SaaS MVP for a fixed price and fixed timeline. He kept me updated weekly, caught several issues I hadn't thought of, and delivered early. Three months after launch, we hit $10k MRR. Best investment I made in the business." },
];
