import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ProcedureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onEstimate: () => void;
}

const ProcedureCard = ({ icon: Icon, title, description, onEstimate }: ProcedureCardProps) => {
  return (
    <Card className="group card-gradient border-border/50 shadow-clinic hover:shadow-clinic-lg transition-clinic-slow hover:-translate-y-1 overflow-hidden">
      <CardContent className="p-8 space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-accent/30 flex items-center justify-center group-hover:bg-primary/10 transition-clinic">
          <Icon className="w-8 h-8 text-primary" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={onEstimate}
          variant="outline"
          className="w-full border-primary/30 hover:bg-primary hover:text-primary-foreground transition-clinic group-hover:border-primary"
        >
          Estimate Cost
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcedureCard;
