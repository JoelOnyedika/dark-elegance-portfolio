import { ExternalLink, Github, Sparkles, TrendingUp } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const projects = [
  {
    title: "Collecto",
    tagline: "Invoice Management SaaS",
    description: "Full-stack invoice platform helping freelancers get paid. Stripe integration, automated reminders, payment tracking, PDF generation. Used by real clients managing $50k+ in invoices.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    tech: ["React", "TypeScript", "FastAPI", "Stripe", "PostgreSQL"],
    liveUrl: "https://collecto-one.vercel.app/",
    githubUrl: "#",
    highlight: "Live Product",
    metrics: "Active clients • Real revenue",
  },
  {
    title: "Real-Time Figma Clone",
    tagline: "Collaborative Design Tool",
    description: "Multiplayer canvas with live cursors and real-time collaboration. Built entire real-time infrastructure with Supabase. Optimized rendering for 60fps with multiple users.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
    tech: ["React", "TypeScript", "Supabase", "Framer Motion"],
    liveUrl: "https://fig-pro-clone.vercel.app/",
    githubUrl: "#",
    highlight: "Real-time Sync",
    metrics: "Sub-100ms latency",
  },
  {
    title: "E-Commerce Platform",
    tagline: "Multi-Vendor Marketplace",
    description: "Custom marketplace with product management, order processing, payment handling. Admin dashboard, inventory tracking, automated emails. Deployed on AWS with Docker.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
    highlight: "Production Ready",
    metrics: "Handles 1000+ products",
  },
  {
    title: "Analytics Dashboard",
    tagline: "Data Visualization Tool",
    description: "Real-time analytics for tracking user behavior and revenue metrics. Custom chart components, optimized database queries, multiple data source integrations.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tech: ["React", "D3.js", "Python", "PostgreSQL", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    highlight: "Real-time Data",
    metrics: "10k events/min",
  },
];

const Projects = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="section-padding relative bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background pointer-events-none" />
      
      <div className="container mx-auto container-padding relative z-10">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-heading mb-3 sm:mb-4">
            Projects I've <span className="text-gradient">Shipped</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4 sm:px-0">
            Real applications solving real problems. Not demos—production code people actually use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`glass rounded-xl overflow-hidden card-hover border-glow group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="aspect-video overflow-hidden relative bg-muted/20">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Animated overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1 border border-primary/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3 h-3" />
                  {project.highlight}
                </div>
              </div>
              
              <div className="card-padding">
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-primary text-xs sm:text-sm font-semibold">{project.tagline}</p>
                </div>
                
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {project.description}
                </p>

                <div className="mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/50 flex items-center gap-2 group-hover:border-primary/30 transition-colors">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">{project.metrics}</p>
                </div>
                
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  {project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-primary text-primary-foreground rounded-lg text-xs sm:text-sm font-semibold hover-glow transition-all hover:scale-105 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
                      <span className="relative z-10">View Live</span>
                    </a>
                  )}
                  {project.githubUrl !== "#" && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 glass rounded-lg text-xs sm:text-sm font-semibold border-glow transition-all hover:scale-105"
                    >
                      <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Code
                    </a>
                  )}
                  {project.liveUrl === "#" && project.githubUrl === "#" && (
                    <div className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-muted-foreground">
                      <span>Under NDA</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-10 sm:mt-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Want to see more or discuss a project?
          </p>
          <a 
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 glass border-glow rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base group"
          >
            <span className="group-hover:text-primary transition-colors">Let's Talk</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;