import { 
  SiTypescript, 
  SiJavascript, 
  SiReact, 
  SiNodedotjs, 
  SiPython, 
  SiDocker,
  SiAmazonwebservices,
  SiPostgresql,
  SiMongodb,
  SiGraphql,
  SiTailwindcss,
  SiNextdotjs,
  SiGit,
  SiRedis,
  SiLinux,
  SiFigma,
  SiVuedotjs,
  SiFirebase,
  SiSupabase,
  SiPrisma,
  SiExpress,
  SiJest,
  SiFlask,
  SiDjango
} from "react-icons/si";

const skillsRow1 = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
];

const skillsRow2 = [
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "Redis", icon: SiRedis, color: "#DC382D" },
  { name: "Linux", icon: SiLinux, color: "#FCC624" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "Django", icon: SiDjango, color: "#4FC08D" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
  { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
  { name: "Express.js", icon: SiExpress, color: "#ffffff" },
  { name: "Jest", icon: SiJest, color: "#C21325" },
  { name: "Flask", icon: SiFlask, color: "#000000" },
];

const MarqueeRow = ({ skills, reverse = false }: { skills: typeof skillsRow1; reverse?: boolean }) => {
  // Duplicate for seamless loop
  const duplicatedSkills = [...skills, ...skills, ...skills];
  
  return (
    <div className="relative overflow-hidden py-4">
      <div 
        className={`flex gap-6 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ width: 'max-content' }}
      >
        {duplicatedSkills.map((skill, index) => (
          <div
            key={`${skill.name}-${index}`}
            className="flex items-center gap-3 px-6 py-3 glass rounded-full border-glow hover:bg-primary/10 transition-all duration-300 group cursor-default"
          >
            <skill.icon 
              className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" 
              style={{ color: skill.color }}
            />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            My <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Technologies and tools I use to bring ideas to life.
          </p>
        </div>
      </div>

      {/* Full-width marquee container */}
      <div className="w-full">
        <MarqueeRow skills={skillsRow1} />
        <MarqueeRow skills={skillsRow2} reverse />
      </div>
    </section>
  );
};

export default Skills;
