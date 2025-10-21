import { Star, Award, Shield, Users, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const whyChooseUs = [
    {
      icon: Award,
      title: "Πιστοποιημένοι Εξειδικευμένοι",
      description: "Οι χειρουργοί μας είναι πιστοποιημένοι από διεθνείς οργανισμούς και έχουν ειδικευτεί στις πιο σύγχρονες τεχνικές αισθητικής χειρουργικής.",
      image: "/images/certified-surgeons.jpg",
      stats: "15+ Χρόνια Εμπειρία"
    },
    {
      icon: Shield,
      title: "Ασφάλεια & Ποιότητα",
      description: "Χρησιμοποιούμε μόνο εγκεκριμένα υλικά και τεχνολογίες υψηλής ποιότητας, με πλήρη συμμόρφωση στις διεθνείς προδιαγραφές ασφάλειας.",
      image: "/images/safety-quality.jpg",
      stats: "100% Ασφαλείς Επεμβάσεις"
    },
    {
      icon: Users,
      title: "Ευχαριστημένοι Ασθενείς",
      description: "Πάνω από 2,500 ασθενείς έχουν εμπιστευτεί τις υπηρεσίες μας και έχουν επιτύχει τα επιθυμητά αποτελέσματα με φυσικό και μακροχρόνιο τρόπο.",
      image: "/images/happy-patients.jpg",
      stats: "2,500+ Ευχαριστημένοι Ασθενείς"
    },
    {
      icon: Clock,
      title: "Γρήγορη Ανάκαμψη",
      description: "Χρησιμοποιούμε τις πιο σύγχρονες τεχνικές που επιτρέπουν γρήγορη και άνετη ανάκαμψη, με ελάχιστο χρόνο αποκατάστασης.",
      image: "/images/quick-recovery.jpg",
      stats: "50% Γρηγορότερη Ανάκαμψη"
    },
  ];

  const testimonials = [
    {
      name: "Μαρία Σ.",
      procedure: "Ρινοπλαστική",
      rating: 5,
      text: "Η Κλινική Αισθητικής μετέτρεψε εντελώς την αυτοπεποίθησή μου. Το προσωπικό ήταν επαγγελματικό, στοργικό και τα αποτελέσματα ξεπέρασαν τις προσδοκίες μου. Τέλος νιώθω εαυτή μου.",
      before: "Ανησυχία για το προφίλ",
      after: "Φυσικά όμορφο αποτέλεσμα",
    },
    {
      name: "Ελένη Κ.",
      procedure: "Επαύξηση Στήθους",
      rating: 5,
      text: "Όλη η διαδικασία ήταν απρόσκοπτη. Από την αρχική συμβουλευτική μέχρι την ανάκαμψη, ένιωσα υποστηριγμένη σε κάθε βήμα. Το φυσικό αποτέλεσμα είναι ακριβώς αυτό που ήθελα.",
      before: "Προβλήματα ασυμμετρίας",
      after: "Τέλεια ισορροπία",
    },
    {
      name: "Σοφία Δ.",
      procedure: "Λιποαναρρόφηση",
      rating: 5,
      text: "Είμαι εντυπωσιασμένη από την ακρίβεια και την καλλιτεχνία. Η ομάδα άκουσε τους στόχους μου και παρέδωσε αποτελέσματα που φαίνονται εντελώς φυσικά. Προτείνω ανεπιφύλακτα!",
      before: "Πεισματάρικες περιοχές",
      after: "Διαμορφωμένα περιγράμματα",
    },
  ];

  return (
    <section id="why-choose-us" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Γιατί να μας επιλέξετε;</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-2">
            Γιατί να μας επιλέξετε;
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed px-4">
            Εξειδικευμένες ιατρικές υπηρεσίες με τα υψηλότερα πρότυπα ασφάλειας, ποιότητας και επαγγελματισμού. 
            Η εμπιστοσύνη των ασθενών μας είναι η καλύτερη απόδειξη της ποιότητας των υπηρεσιών μας.
          </p>
        </div>

        {/* Why Choose Us Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {whyChooseUs.map((item, index) => (
              <div key={item.title} className="group relative overflow-hidden rounded-2xl shadow-clinic-lg hover:shadow-clinic-lg transition-clinic-slow">
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Image Section */}
                  <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <item.icon className="w-24 h-24 text-white/80" />
                    </div>
                    {/* Placeholder for actual medical images */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary/80 flex items-center justify-center">
                      <div className="text-center text-white">
                        <item.icon className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-sm font-medium">Επαγγελματική Εικόνα</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 p-8 bg-white">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-bold text-foreground">
                            {item.title}
                          </h3>
                          <p className="text-sm font-medium text-primary">{item.stats}</p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Τι λένε οι Ασθενείς μας
              </h3>
              <p className="text-muted-foreground">
                Πραγματικές ιστορίες από πραγματικούς ανθρώπους
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-clinic p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.procedure}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
