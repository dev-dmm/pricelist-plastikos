const ProcedureCard = ({ icon: Icon, title, description, onEstimate }) => {
  return (
    <div className="group card-gradient border border-border/50 shadow-clinic hover:shadow-clinic-lg transition-clinic-slow hover:-translate-y-1 overflow-hidden rounded-xl">
      <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
        {/* Icon */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent/30 flex items-center justify-center group-hover:bg-primary/10 transition-clinic">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>

        {/* Content */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onEstimate}
          className="w-full border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-clinic group-hover:border-primary px-4 py-3 sm:py-2 rounded-lg text-sm sm:text-base touch-manipulation min-h-[44px]"
        >
          Εκτίμηση Κόστους
        </button>
      </div>
    </div>
  );
};

export default ProcedureCard;
