import ProcedureCard from "./ProcedureCard";
import { Smile, Heart, User, Sparkles } from "lucide-react";

const ProceduresGrid = ({ onEstimateClick }) => {
  const procedures = [
    {
      icon: Smile,
      title: "Πρόσωπο",
      description: "Ενισχύστε την φυσική σας ομορφιά με λιφτ προσώπου, ρινοπλαστική, χειρουργική βλεφάρων και διαμόρφωση προσώπου.",
    },
    {
      icon: Heart,
      title: "Στήθος",
      description: "Επιτύχετε το επιθυμητό σας σιλουέτα με επαύξηση, μείωση, ανύψωση ή ανακατασκευή.",
    },
    {
      icon: User,
      title: "Σώμα",
      description: "Διαμορφώστε το σώμα σας με λιποαναρρόφηση, αφαίρεση κοιλίας, ανύψωση σώματος και ολοκληρωμένες θεραπείες διαμόρφωσης.",
    },
    {
      icon: Sparkles,
      title: "Μη Χειρουργικές",
      description: "Ανανεώστε την εμφάνισή σας με Botox, δερματικούς πληρωτές, λέιζερ θεραπείες και ελάχιστα επεμβατικές επιλογές.",
    },
  ];

  return (
    <section id="procedures" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-2">
            Οι Επεμβάσεις μας
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed px-4">
            Εξερευνήστε την ολοκληρωμένη γκάμα των αισθητικών επεμβάσεών μας, καθεμία προσαρμοσμένη στους μοναδικούς σας στόχους και εκτελεσμένη με ακρίβεια και φροντίδα.
          </p>
        </div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {procedures.map((procedure) => (
            <ProcedureCard
              key={procedure.title}
              icon={procedure.icon}
              title={procedure.title}
              description={procedure.description}
              onEstimate={onEstimateClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProceduresGrid;
