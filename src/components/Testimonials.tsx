import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechStart",
    content: "Exceptional work. Delivered a complex platform ahead of schedule with incredible attention to detail. A true professional.",
    avatar: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "Founder, AppVenture",
    content: "The quality of code and communication was outstanding. Would absolutely work together again on future projects.",
    avatar: "MR",
  },
  {
    name: "Emily Watson",
    role: "Product Lead, DataFlow",
    content: "Turned our vision into reality. The app they built has transformed how we do business. Highly recommended.",
    avatar: "EW",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 px-6 relative">
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

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="glass rounded-xl p-8 card-hover border-glow animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
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

export default Testimonials;
