import { Star } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

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
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-2">
            Εμπιστευόμαστε από τους Ασθενείς μας
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed px-4">
            Πραγματικές ιστορίες από πραγματικούς ανθρώπους που μετέτρεψαν τις ζωές τους μαζί μας
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`cursor-pointer card-gradient rounded-xl transition-clinic-slow hover:shadow-clinic-lg touch-manipulation ${
                  activeIndex === index
                    ? "ring-2 ring-primary shadow-clinic-lg scale-105"
                    : "hover:scale-102"
                }`}
              >
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg text-foreground">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.procedure}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-4">
                    {testimonial.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Testimonial Detail */}
          <div className="card-gradient shadow-clinic-lg rounded-xl">
            <div className="p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                {/* Before/After */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 sm:p-6 bg-accent/30 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        Πριν
                      </p>
                      <p className="text-foreground font-medium text-sm sm:text-base">
                        {testimonials[activeIndex].before}
                      </p>
                    </div>
                    <div className="p-4 sm:p-6 bg-primary/10 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        Μετά
                      </p>
                      <p className="text-foreground font-medium text-sm sm:text-base">
                        {testimonials[activeIndex].after}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex space-x-1 mb-2">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-base sm:text-lg text-foreground leading-relaxed italic">
                    "{testimonials[activeIndex].text}"
                  </blockquote>
                  <div className="pt-3 sm:pt-4 border-t border-border">
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {testimonials[activeIndex].name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {testimonials[activeIndex].procedure}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-clinic touch-manipulation ${
                  activeIndex === index ? "bg-primary w-8" : "bg-secondary hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
