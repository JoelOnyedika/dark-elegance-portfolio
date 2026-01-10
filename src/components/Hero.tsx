import { ArrowDown } from "lucide-react";

const Hero = () => {
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
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          Hi, I'm <span className="text-gradient glow-text">Joel</span> —
          <br />
          <span className="text-foreground">Full-Stack & Software Developer</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          I build real products that solve real problems. From concept to deployment, 
          I create software that people actually use.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-float"
      >
        <ArrowDown className="w-6 h-6" />
      </a>
    </section>
  );
};

export default Hero;
