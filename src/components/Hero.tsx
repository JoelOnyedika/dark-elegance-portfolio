import { ArrowDown, Wrench, Zap, Code2 } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "I fix broken code & build SaaS.";
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
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-hero"
    >
      <div className="container mx-auto container-padding relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/30 rounded-full mb-6 sm:mb-8 animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-border" />
          <span className="text-xs sm:text-sm font-medium text-primary">Available for Work</span>
        </div>
        
        {/* Main Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 leading-none">
            <span className="block text-foreground mb-2">Joel Onyedika</span>
            <span className="text-gradient glow-text">{displayText}</span>
            <span className={`text-primary ${showCursor && !isTypingComplete ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
          </h1>
        </div>
        
        <div className={`max-w-2xl mx-auto mb-8 sm:mb-10 transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-lg sm:text-xl md:text-2xl text-foreground mb-3 sm:mb-4 font-semibold">
            Your codebase is a mess. I clean it up.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-4 sm:px-0">
            Full-stack developer who turns spaghetti code into clean architecture. I build SaaS apps and rescue legacy systems—fast.
          </p>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto mb-8 sm:mb-10 transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <div className="glass card-padding rounded-lg border-glow">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">3+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Years Exp</div>
          </div>
          <div className="glass card-padding rounded-lg border-glow">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">15+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="glass card-padding rounded-lg border-glow">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Clean</div>
          </div>
        </div>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <a 
            href="#projects" 
            className="group px-6 py-3 sm:px-8 sm:py-4 bg-primary text-primary-foreground rounded-lg font-medium hover-glow transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
            View Projects
          </a>
          <a 
            href="#contact" 
            className="px-6 py-3 sm:px-8 sm:py-4 glass border-glow rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            Hire Me
          </a>
        </div>

        {/* Tech Stack */}
        <div className={`text-xs sm:text-sm text-muted-foreground transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Code2 className="w-4 h-4" />
            <span className="font-medium">Tech Stack</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["React", "Next.js", "Node.js", "TypeScript", "Python", "PostgreSQL", "Docker"].map((tech) => (
              <span key={tech} className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-muted/50 border border-border rounded-full font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a 
        href="#about"
        className={`absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-all animate-float ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}
      >
        <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
    </section>
  );
};

export default Hero;
