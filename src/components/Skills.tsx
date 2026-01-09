const skills = [
  "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "MongoDB",
  "GraphQL", "REST APIs", "Docker", "AWS", "Git", "Tailwind CSS",
  "Next.js", "Express.js", "Redis", "Linux", "CI/CD", "Figma",
  "Vue.js", "Firebase", "Supabase", "Jest", "Prisma", "tRPC"
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            My <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Technologies and tools I use to bring ideas to life.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <span
              key={skill}
              className="px-5 py-2.5 glass rounded-full text-sm font-medium border-glow hover:bg-primary/10 transition-all duration-300 cursor-default animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 30}ms`, animationFillMode: "forwards" }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
