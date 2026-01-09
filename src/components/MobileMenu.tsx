import { X } from "lucide-react";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
}

const MobileMenu = ({ isOpen, onClose, links }: MobileMenuProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-72 bg-card border-l border-border animate-slide-in-right">
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <span className="text-xl font-semibold text-gradient">Dev.</span>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {links.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={onClose}
                className="py-3 px-4 text-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="absolute bottom-8 left-6 right-6">
            <a
              href="#contact"
              onClick={onClose}
              className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-lg font-medium hover-glow transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
