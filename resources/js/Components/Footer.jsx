import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Clinic Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-semibold text-sm sm:text-lg">
                  DA
                </span>
              </div>
              <span className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                Κλινική Αισθητικής
              </span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Αισθητικές επεμβάσεις υψηλής ποιότητας που εκτελούνται με ακρίβεια, φροντίδα και διαφάνεια.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-serif text-base sm:text-lg font-semibold text-foreground">Γρήγοροι Σύνδεσμοι</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-clinic touch-manipulation"
                >
                  Αρχική
                </a>
              </li>
              <li>
                <a
                  href="#procedures"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-clinic touch-manipulation"
                >
                  Επεμβάσεις
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-clinic touch-manipulation"
                >
                  Αποτελέσματα
                </a>
              </li>
              <li>
                <a
                  href="#estimator"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-clinic touch-manipulation"
                >
                  Λάβετε Εκτίμηση
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-serif text-base sm:text-lg font-semibold text-foreground">Επικοινωνία</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Λεωφόρος Βασιλίσσης Σοφίας 123
                  <br />
                  Αθήνα, 106 74
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">+30 210 123 4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">info@kliniki-aisthitikis.gr</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-serif text-base sm:text-lg font-semibold text-foreground">Ώρες Λειτουργίας</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-muted-foreground">
                  <p>Δευ - Παρα: 9:00 - 18:00</p>
                  <p>Σάββατο: 10:00 - 16:00</p>
                  <p>Κυριακή: Κλειστά</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border text-center">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            © {new Date().getFullYear()} Κλινική Αισθητικής. Όλα τα δικαιώματα διατηρούνται. |{" "}
            <a href="#" className="hover:text-primary transition-clinic touch-manipulation">
              Πολιτική Απορρήτου
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-primary transition-clinic touch-manipulation">
              Όροι Χρήσης
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
