import { ExternalLink, Github, Sparkles } from "lucide-react";

const projects = [
  {
    title: "Collecto",
    tagline: "Invoice Management SaaS",
    description: "Full-stack invoice management platform that actually helps freelancers get paid. Built the entire product—Stripe integration, automated reminders, payment tracking, PDF generation. Currently being used by real clients to manage $50k+ in invoices.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    tech: ["React", "TypeScript", "FastAPI", "Stripe", "PostgreSQL", "Prisma"],
    liveUrl: "https://collecto-one.vercel.app/",
    githubUrl: "#",
    highlight: "Live Product",
    metrics: "Active users tracking invoices",
  },
  {
    title: "Real-Time Figma Clone",
    tagline: "Collaborative Design Tool",
    description: "Multiplayer canvas application with live cursors, real-time collaboration, and smooth animations. Built the entire real-time infrastructure using Supabase and optimized rendering for 60fps even with multiple users.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
    tech: ["React", "TypeScript", "Supabase", "Framer Motion", "Tailwind"],
    liveUrl: "https://fig-pro-clone.vercel.app/",
    githubUrl: "#",
    highlight: "Real-time Sync",
    metrics: "Sub-100ms latency",
  },
  {
    title: "E-Commerce Platform",
    tagline: "Custom Store Builder",
    description: "Built a multi-vendor marketplace with product management, order processing, and payment handling. Includes admin dashboard, inventory tracking, and automated email notifications. Deployed on AWS with Docker.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Docker", "AWS"],
    liveUrl: "#",
    githubUrl: "#",
    highlight: "Production Ready",
    metrics: "Handles 1000+ products",
  },
  {
    title: "Analytics Dashboard",
    tagline: "Data Visualization Tool",
    description: "Real-time analytics platform for tracking user behavior, conversion funnels, and revenue metrics. Built custom chart components, optimized database queries for fast load times, and integrated with multiple data sources.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tech: ["React", "D3.js", "Python", "PostgreSQL", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    highlight: "Real-time Data",
    metrics: "Processes 10k events/min",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none opacity-30" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Projects I've <span className="text-gradient">Shipped</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real applications solving real problems. Not demos, not tutorials—production code that people actually use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="glass rounded-xl overflow-hidden card-hover border-glow animate-fade-up opacity-0 group"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {project.highlight}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
                  <p className="text-primary text-sm font-medium">{project.tagline}</p>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/30">
                  <p className="text-xs font-medium text-muted-foreground">{project.metrics}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover-glow transition-all hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>
                  )}
                  {project.githubUrl !== "#" && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm font-medium border-glow transition-all hover:scale-105"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  {project.liveUrl === "#" && project.githubUrl === "#" && (
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                      <span>Under NDA / Private Client Work</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Projects CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Want to see more or discuss a project?
          </p>
          <a 
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 glass border-glow rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            Let's Talk
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
