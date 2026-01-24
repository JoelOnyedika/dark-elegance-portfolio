import { useState } from "react";
import { Send, Github, Linkedin, Twitter, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const socials = [
    { icon: Github, href: "https://github.com/joelonyedika", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/highoctane0000", label: "Twitter" },
  ];

  const services = [
    "Need a messy codebase cleaned up?",
    "Building a SaaS and need a developer?",
    "Have a critical bug that needs fixing ASAP?",
    "Looking for someone to take your project from 0 to 1?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_API_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Project Inquiry from ${formData.name}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent!",
          description: "I'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please email me directly at joelonyedikaepic@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Let's Work <span className="text-gradient">Together</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Got a project that needs shipping? A codebase that needs saving? 
            Send me a message and I'll get back to you within 24 hours.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          {/* Left column - Services */}
          <div className="space-y-6">
            <div className="glass-strong rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">I Can Help With:</h3>
              <ul className="space-y-4">
                {services.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-3">Quick Response Time</h3>
              <p className="text-sm text-muted-foreground mb-4">
                I respond to all inquiries within 24 hours. If your project is urgent, mention it in your message.
              </p>
              
              <div className="flex gap-3 pt-4 border-t border-border/50">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 glass rounded-full flex items-center justify-center border-glow hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Contact Form */}
          <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Your Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Project Details *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project, timeline, and what you need help with..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="bg-background/50 border-border/50 focus:border-primary transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-base font-medium hover-glow transition-all duration-300 hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Message
                  </span>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Or email directly:{" "}
                <a 
                  href="mailto:joelonyedikaepic@gmail.com" 
                  className="text-primary hover:underline"
                >
                  joelonyedikaepic@gmail.com
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
