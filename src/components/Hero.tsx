import { ArrowDown, Wrench, Zap, Code2 } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const phrases = [
    "I fix broken code.",
    "I build SaaS apps.",
    "I clean up codebases.",
    "I ship fast.",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1200); // Pause for 2 seconds before deleting
      return () => clearTimeout(pauseTimeout);
    }

    const typingSpeed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          // Finished typing, pause before deleting
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          // Finished deleting, move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isPaused, currentPhraseIndex]);

  return (
    <section 
      id="home" 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-hero"
    >
      <div className="container mx-auto container-padding relative z-10 text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/30 rounded-full mb-6 sm:mb-8 animate-fade-up opacity-0 hover:bg-primary/20 transition-all cursor-default" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-border" />
          <span className="text-xs sm:text-sm font-medium text-primary">Available for Work</span>
        </div>
        
        {/* Main Heading with Typewriter */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none">
            <span className="block text-foreground mb-3 sm:mb-4 animate-fade-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              Joel Onyedika
            </span>
            <span className="block min-h-[1.2em] animate-fade-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
              <span className="text-gradient glow-text">{displayText}</span>
              <span className={`text-primary ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
            </span>
          </h1>
        </div>
        
        <div className="max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-up opacity-0" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
          <p className="text-lg sm:text-xl md:text-2xl text-foreground mb-3 sm:mb-4 font-semibold">
            Your codebase is a mess. I clean it up.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-4 sm:px-0">
            Full-stack developer who turns spaghetti code into clean architecture. I build SaaS apps and rescue legacy systems—fast.
          </p>
        </div>

        {/* Stats Grid with Hover Effects */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto mb-8 sm:mb-10">
          {[
            { label: "Years Exp", value: "3+", delay: "700ms" },
            { label: "Projects", value: "15+", delay: "850ms" },
            { label: "Clean", value: "100%", delay: "1000ms" }
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="glass card-padding rounded-lg border-glow animate-fade-up opacity-0 hover:scale-105 transition-transform cursor-default group"
              style={{ animationDelay: stat.delay, animationFillMode: "forwards" }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs with Better Animations */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 animate-fade-up opacity-0" style={{ animationDelay: "1100ms", animationFillMode: "forwards" }}>
          <a 
            href="#projects" 
            className="group px-6 py-3 sm:px-8 sm:py-4 bg-primary text-primary-foreground rounded-lg font-medium hover-glow transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform relative z-10" />
            <span className="relative z-10">View Projects</span>
          </a>
          <a 
            href="#contact" 
            className="group px-6 py-3 sm:px-8 sm:py-4 glass border-glow rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
            Hire Me
          </a>
        </div>

        {/* Tech Stack - Cleaner Design */}
        <div className="text-xs sm:text-sm text-muted-foreground animate-fade-up opacity-0" style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Code2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["React", "Next.js", "Node.js", "Django", "Flask", "Git", "TypeScript", "Python", "PostgreSQL", "Docker"].map((tech, i) => (
              <span 
                key={tech} 
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-muted/50 border border-border rounded-full font-medium hover:bg-muted hover:border-primary/30 hover:scale-105 transition-all cursor-default"
                style={{ 
                  animationDelay: `${1300 + i * 50}ms`,
                  animationFillMode: "forwards"
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <a 
        href="#about"
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-all animate-float group"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">Scroll</span>
          <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </a>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-primary/10 rounded-lg rotate-12 animate-float opacity-20 pointer-events-none hidden md:block" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-40 right-20 w-16 h-16 border border-secondary/10 rounded-lg -rotate-12 animate-float opacity-20 pointer-events-none hidden md:block" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/3 right-10 w-12 h-12 border border-primary/10 rounded-full animate-float opacity-20 pointer-events-none hidden lg:block" style={{ animationDelay: "2s" }} />
    </section>
  );
};

export default Hero;