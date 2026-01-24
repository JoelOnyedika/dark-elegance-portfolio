import { ArrowDown, Wrench, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "I'm Joel. I fix broken code & build SaaS.";
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section 
      id="home" 
      className="min-h-screen flex flex-col items-center justify-center relative px-6 pt-20 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Floating animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px] animate-gradient-shift pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-gradient-shift-reverse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial opacity-50 animate-pulse-soft pointer-events-none" />

      <div className="container mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <Wrench className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Code Janitor Available</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 min-h-[1.2em]">
          <span className="text-gradient glow-text">{displayText}</span>
          <span className={`text-primary ${showCursor && !isTypingComplete ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </h1>
        
        <div className={`max-w-3xl mx-auto mb-10 transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xl sm:text-2xl text-foreground mb-4 font-medium">
            Your codebase is a mess. I clean it up.
          </p>
          <p className="text-lg text-muted-foreground">
            Full-stack developer specializing in SaaS applications and legacy code rescue. 
            I turn spaghetti code into clean architecture, ship fast, and don't leave tech debt behind.
          </p>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10 transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <div className="glass rounded-lg p-4 border-glow">
            <div className="text-3xl font-bold text-primary mb-1">3+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="glass rounded-lg p-4 border-glow">
            <div className="text-3xl font-bold text-primary mb-1">15+</div>
            <div className="text-sm text-muted-foreground">Projects Shipped</div>
          </div>
          <div className="glass rounded-lg p-4 border-glow">
            <div className="text-3xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Clean Code</div>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <a 
            href="#projects" 
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover-glow transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            See What I've Built
          </a>
          <a 
            href="#contact" 
            className="px-8 py-4 glass border-glow rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            Hire Me to Clean Your Code
          </a>
        </div>

        {/* Tech Stack Highlight */}
        <div className={`mt-12 text-sm text-muted-foreground transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <p className="mb-3">Built with</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["React", "Next.js", "Node.js", "TypeScript", "Python", "PostgreSQL", "Docker"].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-muted/30 rounded-full text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a 
        href="#about"
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-all animate-float ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}
      >
        <ArrowDown className="w-6 h-6" />
      </a>
    </section>
  );
};

export default Hero;
