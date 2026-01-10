import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Hi, I'm Joel Onyedika";
  const subtitle = "Full-Stack & Software Developer";
  const [subtitleText, setSubtitleText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Start typing subtitle after main text
        let subtitleIndex = 0;
        const subtitleInterval = setInterval(() => {
          if (subtitleIndex <= subtitle.length) {
            setSubtitleText(subtitle.slice(0, subtitleIndex));
            subtitleIndex++;
          } else {
            clearInterval(subtitleInterval);
            setIsTypingComplete(true);
          }
        }, 50);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  // Blinking cursor effect
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
        <p className="text-primary font-medium mb-4 animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          Welcome to my portfolio
        </p>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-2 min-h-[1.2em]">
          <span className="text-gradient glow-text">{displayText}</span>
          <span className={`text-primary ${showCursor && !isTypingComplete ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </h1>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 min-h-[1.2em]">
          {subtitleText}
          <span className={`text-primary ${showCursor && displayText.length === fullText.length && !isTypingComplete ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </h2>
        
        <p className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          I build real products that solve real problems. From concept to deployment, 
          I create software that people actually use.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <a 
            href="#projects" 
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover-glow transition-all duration-300 hover:scale-105"
          >
            View My Work
          </a>
          <a 
            href="#contact" 
            className="px-8 py-4 glass border-glow rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            Get in Touch
          </a>
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
