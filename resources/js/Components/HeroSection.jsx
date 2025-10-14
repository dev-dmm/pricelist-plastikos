import { Sparkles } from "lucide-react";

const HeroSection = () => {
  const scrollToEstimator = () => {
    const element = document.getElementById("estimator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden clinic-gradient"
    >
      <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-card/60 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-primary/20 shadow-clinic">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Εκτίμηση Κόστους με AI</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight px-2">
            Προσωποποιημένες Αισθητικές Επεμβάσεις με{" "}
            <span className="text-primary">Διαφάνεια & Φροντίδα</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Λάβετε την λεπτομερή εκτίμηση κόστους σας εντός 2 ωρών — με τη δύναμη του AI
          </p>

          {/* CTA Button */}
          <div className="pt-2 sm:pt-4">
            <button
              onClick={scrollToEstimator}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6 rounded-lg shadow-clinic-lg transition-clinic-slow hover:scale-105 w-full sm:w-auto min-h-[48px] touch-manipulation"
            >
              Λάβετε την Εκτίμησή μου
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span>Πιστοποιημένοι Χειρουργοί</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span>15+ Χρόνια Εμπειρία</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span>2,500+ Ευχαριστημένοι Ασθενείς</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
