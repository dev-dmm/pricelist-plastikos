import { useState } from "react";
import { Menu } from "lucide-react";

const Header = ({ auth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-clinic">
      <nav className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-semibold text-sm sm:text-lg">DA</span>
            </div>
            <span className="font-serif text-lg sm:text-xl font-semibold text-foreground hidden xs:block">
              Κλινική Αισθητικής
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-foreground hover:text-primary transition-clinic font-medium text-sm lg:text-base"
            >
              Αρχική
            </button>
            <button
              onClick={() => scrollToSection("procedures")}
              className="text-foreground hover:text-primary transition-clinic font-medium text-sm lg:text-base"
            >
              Επεμβάσεις
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-foreground hover:text-primary transition-clinic font-medium text-sm lg:text-base"
            >
              Αποτελέσματα
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-clinic font-medium text-sm lg:text-base"
            >
              Επικοινωνία
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {auth?.user?.is_admin && (
              <a
                href="/admin"
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-clinic-md transition-clinic text-sm lg:text-base"
              >
                Admin Dashboard
              </a>
            )}
            <button
              onClick={() => scrollToSection("estimator")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-clinic-md transition-clinic text-sm lg:text-base"
            >
              Κλείστε Συνάντηση
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2 -mr-2 touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4 animate-fade-in">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium py-3 px-2 rounded-lg hover:bg-accent/50 touch-manipulation"
            >
              Αρχική
            </button>
            <button
              onClick={() => scrollToSection("procedures")}
              className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium py-3 px-2 rounded-lg hover:bg-accent/50 touch-manipulation"
            >
              Επεμβάσεις
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium py-3 px-2 rounded-lg hover:bg-accent/50 touch-manipulation"
            >
              Αποτελέσματα
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium py-3 px-2 rounded-lg hover:bg-accent/50 touch-manipulation"
            >
              Επικοινωνία
            </button>
            {auth?.user?.is_admin && (
              <a
                href="/admin"
                className="block w-full text-left text-foreground hover:text-primary transition-clinic font-medium py-3 px-2 rounded-lg hover:bg-accent/50 touch-manipulation"
              >
                Admin Dashboard
              </a>
            )}
            <button
              onClick={() => scrollToSection("estimator")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-lg mt-4 touch-manipulation min-h-[48px]"
            >
              Κλείστε Συνάντηση
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
