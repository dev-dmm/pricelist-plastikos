import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-clinic">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-semibold text-lg">DA</span>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Dr. Aesthetics Clinic
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-foreground hover:text-primary transition-clinic font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("procedures")}
              className="text-foreground hover:text-primary transition-clinic font-medium"
            >
              Procedures
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-foreground hover:text-primary transition-clinic font-medium"
            >
              Results
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-clinic font-medium"
            >
              Contact
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => scrollToSection("estimator")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-clinic-md transition-clinic"
            >
              Book a Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-border pt-4">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("procedures")}
              className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium"
            >
              Procedures
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium"
            >
              Results
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium"
            >
              Contact
            </button>
            <Button
              onClick={() => scrollToSection("estimator")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Book a Consultation
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
