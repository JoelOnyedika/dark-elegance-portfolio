import { Quote } from "lucide-react";
import React from "react";


const testimonials = [
  {
    name: "Marcus Johnson",
    role: "Product Manager, Stripe",
    content: "Working with Joel on our payment dashboard redesign was fantastic. He took the time to understand our users' pain points and delivered a solution that reduced support tickets by 40%. His React expertise really showed.",
    avatar: "MJ",
  },
  {
    name: "Alex Turner",
    role: "CTO, FinanceFlow",
    content: "Joel rebuilt our entire frontend in Next.js and the performance improvements were immediate. Page load times dropped from 4s to under 1s. He also documented everything thoroughly, which made handoff seamless.",
    avatar: "AT",
  },
  {
    name: "Jordan Blake",
    role: "Founder, LocalEats",
    content: "I needed a mobile-first restaurant discovery app built quickly. Joel delivered in 6 weeks, handled all the API integrations, and even helped me prep for my investor demo. The app is still running smoothly two years later.",
    avatar: "JB",
  },
  {
    name: "David Park",
    role: "Head of Engineering, HealthTrack",
    content: "Joel joined us for a 3-month contract to help migrate our legacy codebase to TypeScript. Not only did he complete the migration, but he also set up proper testing workflows and mentored our junior developers. We've tried to hire him full-time twice.",
    avatar: "DP",
  },
  {
    name: "Amara Okafor",
    role: "Design Lead, CreativeHub",
    content: "As a designer, I'm picky about implementation details. Joel nailed every animation, every responsive breakpoint, and every micro-interaction. He pushed back when something wasn't feasible and always suggested better alternatives. True collaboration.",
    avatar: "AO",
  },
  {
    name: "James Liu",
    role: "Solo Founder, TaskMaster",
    content: "Joel built my SaaS MVP for a fixed price and fixed timeline. He kept me updated weekly, caught several issues I hadn't thought of, and delivered early. Three months after launch, we hit $10k MRR. Best investment I made in the business.",
    avatar: "JL",
  },
];

const Testimonials = () => {
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval;
    let isPaused = false;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && scrollContainer) {
          scrollContainer.scrollLeft += 1;
          
          // Reset to start when reaching the end
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }, 30);
    };

    startScrolling();

    // Pause on hover
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(scrollInterval);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Clients <span className="text-gradient">Say</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Feedback from people I've had the pleasure of working with.
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="glass rounded-xl p-8 card-hover border-glow flex-shrink-0 w-80 animate-fade-up opacity-0"
              style={{ animationDelay: `${(index % testimonials.length) * 150}ms`, animationFillMode: "forwards" }}
            >
              <Quote className="w-8 h-8 text-primary/50 mb-4" />
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials