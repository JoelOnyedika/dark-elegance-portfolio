import { Wrench, Rocket, Zap, Code2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const About = () => {
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

  const services = [
    {
      icon: Wrench,
      title: "Code Cleanup",
      description: "Inherited a nightmare? Or a Security flawed Vibe-Coded app? I refactor spaghetti into clean architecture, add tests, and document everything.",
      color: "from-primary/20 to-primary/5",
    },
    {
      icon: Rocket,
      title: "SaaS Development", 
      description: "I build production-ready apps. Auth, payments, databases, deployment—you get a product that works.",
      color: "from-secondary/20 to-secondary/5",
    },
    {
      icon: Zap,
      title: "Fast Fixes",
      description: "Critical bug? Performance issues? I debug fast, fix it right, and deploy without breaking anything.",
      color: "from-primary/20 to-primary/5",
    },
  ];

  return (
    <section ref={sectionRef} id="about" className="section-padding relative bg-dots">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      
      <div className="container mx-auto container-padding relative z-10">
        <div className={`max-w-4xl mx-auto mb-12 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-heading mb-4 sm:mb-6 text-center">
            Why Hire <span className="text-gradient">Me</span>
          </h2>
          
          <div className="glass-strong rounded-xl card-padding space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg leading-relaxed relative overflow-hidden group">
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
            
            <p className="text-foreground relative z-10">
              I'm a <span className="text-primary font-semibold">full-stack developer</span> who's seen it all—legacy codebases held together by hope, half-finished features nobody understands, and production bugs that somehow made it past staging.
            </p>
            
            <p className="text-muted-foreground relative z-10">
              My specialty? <span className="text-foreground font-medium">Cleaning up the mess</span>. I refactor spaghetti code into maintainable architecture. I write tests that catch bugs. I document my work so the next developer doesn't curse your name.
            </p>
            
            <p className="text-muted-foreground relative z-10">
              I also build SaaS from scratch. React, Next.js, Node.js, Python—whatever fits. Frontend, backend, database design, API integrations, deployment, monitoring. You get a product that works.
            </p>

            {/* <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-4 border-t border-border/50 relative z-10">
              <div className="flex items-center gap-2 text-primary">
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-xs sm:text-sm">Stack:</span>
              </div>
              <p className="text-foreground text-xs sm:text-sm font-medium">
                TypeScript • React • Next.js • Node.js • Python • PostgreSQL • Docker • AWS
              </p>
            </div> */}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-12">
          {services.map((item, index) => (
            <div
              key={item.title}
              className={`glass rounded-xl card-padding card-hover border-glow group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 rounded-lg bg-gradient-to-br ${item.color} border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA with animation */}
        <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Need someone who ships? Let's talk.
          </p>
          <a 
            href="#contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover-glow transition-all duration-300 hover:scale-105 text-sm sm:text-base relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative z-10">Get in Touch</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;