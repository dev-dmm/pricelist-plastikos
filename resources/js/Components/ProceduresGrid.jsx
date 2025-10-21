import ProcedureCard from "./ProcedureCard";
import { Stethoscope, Heart, User, Sparkles, Shield, Award } from "lucide-react";

const ProceduresGrid = ({ onEstimateClick }) => {
  const procedures = [
    {
      icon: Stethoscope,
      title: "Χειρουργικές Επεμβάσεις",
      description: "Επαγγελματικές χειρουργικές επεμβάσεις προσώπου, στήθους και σώματος με τις πιο σύγχρονες τεχνικές και υψηλότερα πρότυπα ασφάλειας.",
      image: "/images/medical-surgery.jpg",
      features: ["Πιστοποιημένοι Χειρουργοί", "Σύγχρονες Τεχνικές", "Ασφάλεια & Αποτελεσματικότητα"]
    },
    {
      icon: Heart,
      title: "Αισθητική Χειρουργική",
      description: "Εξειδικευμένες αισθητικές επεμβάσεις για την ενίσχυση της φυσικής ομορφιάς με φυσικά και μακροχρόνια αποτελέσματα.",
      image: "/images/aesthetic-surgery.jpg",
      features: ["Φυσικά Αποτελέσματα", "Μακροχρόνια Διαρκεία", "Εξατομικευμένη Προσέγγιση"]
    },
    {
      icon: Shield,
      title: "Μη Χειρουργικές Θεραπείες",
      description: "Ελάχιστα επεμβατικές θεραπείες με Botox, δερματικούς πληρωτές και λέιζερ τεχνολογίες για φυσική ανανέωση.",
      image: "/images/non-surgical.jpg",
      features: ["Ελάχιστα Επεμβατικές", "Γρήγορη Ανάκαμψη", "Φυσικά Αποτελέσματα"]
    },
    {
      icon: Award,
      title: "Εξειδικευμένες Υπηρεσίες",
      description: "Ολοκληρωμένες υπηρεσίες συμβουλευτικής, προετοιμασίας και μετεγχειρητικής φροντίδας για βέλτιστα αποτελέσματα.",
      image: "/images/specialized-care.jpg",
      features: ["Ολοκληρωμένη Φροντίδα", "Εξατομικευμένη Συμβουλευτική", "Συνεχής Υποστήριξη"]
    },
  ];

  return (
    <section id="procedures" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <Stethoscope className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Επαγγελματικές Υπηρεσίες</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-2">
            Οι Υπηρεσίες μας
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed px-4">
            Εξειδικευμένες ιατρικές υπηρεσίες με τα υψηλότερα πρότυπα ασφάλειας και αποτελεσματικότητας. 
            Κάθε επέμβαση εκτελείται από πιστοποιημένους χειρουργούς με χρήση των πιο σύγχρονων τεχνικών.
          </p>
        </div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-7xl mx-auto">
          {procedures.map((procedure, index) => (
            <div key={procedure.title} className={`group relative overflow-hidden rounded-2xl shadow-clinic-lg hover:shadow-clinic-lg transition-clinic-slow ${
              index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}>
              <div className="flex flex-col lg:flex-row h-full">
                {/* Image Section */}
                <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <procedure.icon className="w-24 h-24 text-white/80" />
                  </div>
                  {/* Placeholder for actual medical images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary/80 flex items-center justify-center">
                    <div className="text-center text-white">
                      <procedure.icon className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-sm font-medium">Επαγγελματική Εικόνα</p>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 p-8 bg-white">
                  <div className="space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      {procedure.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {procedure.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {procedure.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={onEstimateClick}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-clinic mt-6"
                    >
                      Εκτίμηση Κόστους
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProceduresGrid;
