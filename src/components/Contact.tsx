import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const Contact = () => {
  const socials = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@example.com", label: "Email" },
  ];

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-muted-foreground mb-10">
            Have a project in mind or just want to chat? I'm always open to discussing 
            new opportunities and interesting ideas.
          </p>

          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover-glow transition-all duration-300 hover:scale-105 mb-12"
          >
            <Mail className="w-5 h-5" />
            Say Hello
          </a>

          <div className="flex justify-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-12 h-12 glass rounded-full flex items-center justify-center border-glow hover:bg-primary/10 transition-all duration-300"
              >
                <social.icon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
