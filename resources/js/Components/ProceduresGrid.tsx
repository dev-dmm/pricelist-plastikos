import ProcedureCard from "./ProcedureCard";
import { Smile, Heart, User, Sparkles } from "lucide-react";

const ProceduresGrid = ({ onEstimateClick }: { onEstimateClick: () => void }) => {
  const procedures = [
    {
      icon: Smile,
      title: "Face",
      description: "Enhance your natural beauty with facelifts, rhinoplasty, eyelid surgery, and facial contouring procedures.",
    },
    {
      icon: Heart,
      title: "Breast",
      description: "Achieve your desired silhouette with augmentation, reduction, lift, or reconstruction procedures.",
    },
    {
      icon: User,
      title: "Body",
      description: "Sculpt your body with liposuction, tummy tuck, body lift, and comprehensive contouring treatments.",
    },
    {
      icon: Sparkles,
      title: "Non-Surgical",
      description: "Refresh your appearance with Botox, dermal fillers, laser treatments, and minimally invasive options.",
    },
  ];

  return (
    <section id="procedures" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Our Procedures
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Explore our comprehensive range of aesthetic procedures, each tailored to your unique goals and delivered with precision and care.
          </p>
        </div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
