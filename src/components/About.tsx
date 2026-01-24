import { Wrench, Rocket, Code2, Zap } from "lucide-react";

const About = () => {
  const services = [
    {
      icon: Wrench,
      title: "Code Cleanup",
      description: "Inherited a nightmare codebase? I'll restructure it, fix the bugs, add tests, and document everything so your team can actually work with it.",
    },
    {
      icon: Rocket,
      title: "SaaS Development",
      description: "I build production-ready SaaS apps from scratch. Authentication, payments, databases, deployment—handled. You focus on customers, I handle the tech.",
    },
    {
      icon: Zap,
      title: "Fast Fixes",
      description: "Critical bug blocking your launch? Performance issues killing conversions? I debug fast, fix it right, and deploy without breaking anything else.",
    },
  ];

  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            Why Hire <span className="text-gradient">Me</span>
          </h2>
          
          <div className="glass-strong rounded-2xl p-8 md:p-12 space-y-6 text-lg leading-relaxed">
            <p className="text-foreground">
              I'm a <span className="text-primary font-semibold">full-stack developer</span> who's seen it all—legacy codebases held together by hope, half-finished features no one understands, and production bugs that somehow made it past staging.
            </p>
            
            <p className="text-muted-foreground">
              My specialty? <span className="text-foreground font-medium">Cleaning up the mess</span>. I refactor spaghetti code into clean, maintainable architecture. I write tests that actually catch bugs. I document my work so the next developer doesn't curse your name.
            </p>
            
            <p className="text-muted-foreground">
              I also build SaaS applications from scratch. React, Next.js, Node.js, Python—whatever fits the job. I handle the entire stack: frontend, backend, database design, API integrations, deployment, monitoring. You get a product that works, not a half-built prototype.
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <Code2 className="w-5 h-5 text-primary" />
              <p className="text-foreground font-medium">
                Tech Stack: TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Docker, AWS
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((item, index) => (
            <div
              key={item.title}
              className="glass rounded-xl p-8 card-hover border-glow animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
            >
              <div className="w-14 h-14 mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need someone who can actually ship? Let's talk.
          </p>
          <a 
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover-glow transition-all duration-300 hover:scale-105"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
