import { Code2, Rocket, Users } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "Clean Code",
      description: "Writing maintainable, scalable code that stands the test of time.",
    },
    {
      icon: Rocket,
      title: "Ship Fast",
      description: "Moving quickly from idea to production without sacrificing quality.",
    },
    {
      icon: Users,
      title: "User First",
      description: "Building products that solve real problems for real people.",
    },
  ];

  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            I'm a developer who takes projects seriously. I don't just write code—I build products that matter. 
            With years of experience across the full stack, I understand what it takes to turn ideas into 
            polished, production-ready applications that users love.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="glass rounded-xl p-8 text-center card-hover border-glow animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
