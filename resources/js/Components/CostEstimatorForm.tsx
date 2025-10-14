import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

const CostEstimatorForm = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: "face", label: "Face" },
    { id: "breast", label: "Breast" },
    { id: "body", label: "Body" },
    { id: "non-surgical", label: "Non-Surgical" },
  ];

  const procedures: Record<string, string[]> = {
    face: ["Rhinoplasty", "Facelift", "Eyelid Surgery", "Brow Lift"],
    breast: ["Augmentation", "Reduction", "Lift", "Reconstruction"],
    body: ["Liposuction", "Tummy Tuck", "Body Lift", "Brazilian Butt Lift"],
    "non-surgical": ["Botox", "Dermal Fillers", "Laser Treatment", "Chemical Peel"],
  };

  const variants: Record<string, string[]> = {
    Liposuction: ["Lipo (local anesthesia)", "Lipo + lymph nodes", "Full body lipo"],
    Rhinoplasty: ["Primary rhinoplasty", "Revision rhinoplasty", "Ethnic rhinoplasty"],
    default: ["Standard procedure", "Enhanced procedure", "Premium package"],
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (currentStep === 2 && !selectedProcedure) {
      toast.error("Please select a procedure");
      return;
    }
    if (currentStep === 3 && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Request submitted successfully!");
  };

  const getVariantsForProcedure = () => {
    return variants[selectedProcedure] || variants.default;
  };

  const stepIndicator = (
    <div className="flex items-center justify-center space-x-2 mb-12">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-clinic ${
              step < currentStep
                ? "bg-primary text-primary-foreground"
                : step === currentStep
                ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {step < currentStep ? <Check className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-1 mx-2 transition-clinic ${
                step < currentStep ? "bg-primary" : "bg-secondary"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <section id="estimator" className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto card-gradient shadow-clinic-lg">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-foreground">
                Request Received!
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Thank you, {formData.name}! We've received your request for a cost estimate on{" "}
                <span className="font-semibold text-foreground">{selectedProcedure}</span>.
              </p>
              <p className="text-muted-foreground">
                You'll receive your personalized quote via email at{" "}
                <span className="font-semibold text-foreground">{formData.email}</span> within 2
                hours.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  setSelectedCategory("");
                  setSelectedProcedure("");
                  setSelectedVariant("");
                  setFormData({ name: "", email: "", notes: "" });
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
              >
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="estimator" className="py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Get Your Personalized Estimate
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Complete this simple form to receive a detailed cost estimate within 2 hours
          </p>
        </div>

        <Card className="max-w-4xl mx-auto card-gradient shadow-clinic-lg">
          <CardContent className="p-8 md:p-12">
            {stepIndicator}

            {/* Step 1: Category */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    Select Category
                  </h3>
                  <p className="text-muted-foreground">Choose the area you're interested in</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-6 rounded-xl border-2 transition-clinic text-left ${
                        selectedCategory === category.id
                          ? "border-primary bg-primary/5 shadow-clinic-md"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="font-semibold text-lg">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Procedure */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    Choose Procedure
                  </h3>
                  <p className="text-muted-foreground">Select the specific procedure</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {procedures[selectedCategory]?.map((procedure) => (
                    <button
                      key={procedure}
                      onClick={() => setSelectedProcedure(procedure)}
                      className={`p-6 rounded-xl border-2 transition-clinic text-left ${
                        selectedProcedure === procedure
                          ? "border-primary bg-primary/5 shadow-clinic-md"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="font-semibold text-lg">{procedure}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Variant */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    Select Variant
                  </h3>
                  <p className="text-muted-foreground">Choose your preferred option</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {getVariantsForProcedure().map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-6 rounded-xl border-2 transition-clinic text-left ${
                        selectedVariant === variant
                          ? "border-primary bg-primary/5 shadow-clinic-md"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="font-semibold text-lg">{variant}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Contact Info */}
            {currentStep === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    Your Information
                  </h3>
                  <p className="text-muted-foreground">How can we reach you?</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-2 border-border focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 border-border focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-foreground font-medium">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="mt-2 border-border focus:border-primary min-h-[120px]"
                      placeholder="Tell us more about your goals..."
                    />
                  </div>
                </div>
              </form>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12 pt-8 border-t border-border">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={currentStep === 1}
                className="border-primary/30 hover:bg-primary/5"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Submit Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CostEstimatorForm;
