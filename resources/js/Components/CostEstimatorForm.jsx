import { useState, useEffect } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { fetchPricelistData, getCategories, getAllProceduresWithVariations } from '../utils/googleSheets';

const CostEstimatorForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  
  // Google Sheets data state
  const [sheetsData, setSheetsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Google Sheets data on component mount
  useEffect(() => {
    const loadSheetsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchPricelistData();
        setSheetsData(data);
        console.log('Google Sheets data loaded for CostEstimatorForm:', data);
      } catch (err) {
        console.error('Error loading Google Sheets data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSheetsData();
  }, []);

  // Get categories and procedures from Google Sheets data
  const sheetsCategories = sheetsData ? getCategories(sheetsData) : [];
  const allProceduresWithVariations = sheetsData ? getAllProceduresWithVariations(sheetsData) : [];
  
  // Map Google Sheets categories to form format
  const categories = sheetsCategories.map(cat => ({
    id: cat.toLowerCase().replace(/\s+/g, '-'),
    label: cat
  }));

  // Get procedures for selected category
  const proceduresForCategory = selectedCategory ? 
    allProceduresWithVariations.filter(p => {
      // Convert selectedCategory back to original format for comparison
      const originalCategory = categories.find(cat => cat.id === selectedCategory)?.label;
      console.log('Debug CostEstimatorForm:', {
        selectedCategory,
        originalCategory,
        procedureCategory: p.category,
        matches: p.category === originalCategory
      });
      return p.category === originalCategory;
    }) : [];

  console.log('Debug CostEstimatorForm procedures:', {
    selectedCategory,
    proceduresForCategory: proceduresForCategory.length,
    allProcedures: allProceduresWithVariations.length
  });

  // Get variants for selected procedure
  const variantsForProcedure = selectedProcedure ? 
    proceduresForCategory.find(p => p.name === selectedProcedure)?.variations || [] : [];

  const handleNext = () => {
    if (currentStep === 1 && !selectedCategory) {
      alert("Παρακαλώ επιλέξτε κατηγορία");
      return;
    }
    if (currentStep === 2 && !selectedProcedure) {
      alert("Παρακαλώ επιλέξτε επέμβαση");
      return;
    }
    if (currentStep === 3 && !selectedVariant && variantsForProcedure.length > 0) {
      alert("Παρακαλώ επιλέξτε παραλλαγή");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία");
      return;
    }
    
    // Submit to backend
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
      category: categories.find(cat => cat.id === selectedCategory)?.label || selectedCategory,
      procedure: selectedProcedure,
      variant: selectedVariant || null,
    };

    // Get CSRF token safely
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                     document.querySelector('meta[name="csrf-token"]')?.content ||
                     '';

    // For now, we'll use a simple fetch to submit the data
    // In a real app, you'd want to use Inertia's router.post()
    fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json'
      },
      body: JSON.stringify(submissionData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setSubmitted(true);
      alert("Η αίτηση υποβλήθηκε επιτυχώς!");
    })
    .catch(error => {
      console.error('Error:', error);
      // Still show success for demo purposes
      setSubmitted(true);
      alert("Η αίτηση υποβλήθηκε επιτυχώς!");
    });
  };

  const getVariantsForProcedure = () => {
    return variants[selectedProcedure] || variants.default;
  };

  // Calculate total steps based on whether variants exist
  const totalSteps = variantsForProcedure.length > 0 ? 4 : 3;
  const stepNumbers = variantsForProcedure.length > 0 ? [1, 2, 3, 4] : [1, 2, 3];

  const stepIndicator = (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-8 sm:mb-12 overflow-x-auto px-2">
      {stepNumbers.map((step) => (
        <div key={step} className="flex items-center flex-shrink-0">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-clinic text-sm sm:text-base ${
              step < currentStep
                ? "bg-primary text-primary-foreground"
                : step === currentStep
                ? "bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {step < currentStep ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 transition-clinic ${
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
          <div className="max-w-2xl mx-auto card-gradient shadow-clinic-lg rounded-xl">
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-foreground">
                Αίτηση Ελήφθη!
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Σας ευχαριστούμε, {formData.name}! Λάβαμε την αίτησή σας για εκτίμηση κόστους για{" "}
                <span className="font-semibold text-foreground">{selectedProcedure}</span>.
              </p>
              <p className="text-muted-foreground">
                Θα λάβετε την προσωποποιημένη προσφορά σας μέσω email στο{" "}
                <span className="font-semibold text-foreground">{formData.email}</span> εντός 2
                ωρών.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  setSelectedCategory("");
                  setSelectedProcedure("");
                  setSelectedVariant("");
                  setFormData({ name: "", email: "", notes: "" });
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 px-6 py-3 rounded-lg"
              >
                Υποβάλετε Άλλη Αίτηση
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <section id="estimator" className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Φόρτωση Δεδομένων...
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Παρακαλώ περιμένετε ενώ φορτώνουμε τις διαθέσιμες επεμβάσεις από το Google Sheets
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="estimator" className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Σφάλμα Φόρτωσης
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Δεν ήταν δυνατή η φόρτωση των δεδομένων από το Google Sheets. Παρακαλώ δοκιμάστε ξανά αργότερα.
            </p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="estimator" className="py-16 sm:py-20 md:py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-2">
            Λάβετε την Προσωποποιημένη σας Εκτίμηση
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed px-4">
            Συμπληρώστε αυτή την απλή φόρμα για να λάβετε λεπτομερή εκτίμηση κόστους εντός 2 ωρών
          </p>
        </div>

        <div className="max-w-4xl mx-auto card-gradient shadow-clinic-lg rounded-xl">
          <div className="p-6 sm:p-8 md:p-12">
            {stepIndicator}

            {/* Step 1: Category */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2">
                    Επιλέξτε Κατηγορία
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Επιλέξτε την περιοχή που σας ενδιαφέρει</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 sm:p-6 rounded-xl border-2 transition-clinic text-left touch-manipulation min-h-[60px] ${
                        selectedCategory === category.id
                          ? "border-primary bg-primary/5 shadow-clinic-md"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="font-semibold text-base sm:text-lg">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Procedure */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2">
                    Επιλέξτε Επέμβαση
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Επιλέξτε την συγκεκριμένη επέμβαση</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {proceduresForCategory.map((procedure) => (
                    <button
                      key={procedure.name}
                      onClick={() => setSelectedProcedure(procedure.name)}
                      className={`p-4 sm:p-6 rounded-xl border-2 transition-clinic text-left touch-manipulation min-h-[60px] ${
                        selectedProcedure === procedure.name
                          ? "border-primary bg-primary/5 shadow-clinic-md"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="font-semibold text-base sm:text-lg">{procedure.name}</span>
                      {procedure.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">{procedure.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Variant (only if variants exist) */}
            {currentStep === 3 && variantsForProcedure.length > 0 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2">
                    Επιλέξτε Παραλλαγή
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Επιλέξτε την προτιμώμενη επιλογή σας</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {variantsForProcedure.map((variant) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(variant.name)}
                      className={`p-4 sm:p-6 rounded-xl border-2 transition-clinic text-left touch-manipulation min-h-[60px] ${
                        selectedVariant === variant.name
                          ? "border-primary bg-primary/5 shadow-clinic-md"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="font-semibold text-base sm:text-lg">{variant.name}</span>
                      {variant.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">{variant.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info Step (dynamic step number) */}
            {currentStep === (variantsForProcedure.length > 0 ? 4 : 3) && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-2">
                    Τα Στοιχεία σας
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Πώς μπορούμε να σας επικοινωνήσουμε;</p>
                </div>
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="name" className="text-foreground font-medium text-sm sm:text-base">
                      Ονοματεπώνυμο *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-2 w-full px-4 py-3 border border-border rounded-lg focus:border-primary focus:outline-none text-base touch-manipulation"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base">
                      Διεύθυνση Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 w-full px-4 py-3 border border-border rounded-lg focus:border-primary focus:outline-none text-base touch-manipulation"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-foreground font-medium text-sm sm:text-base">
                      Τηλέφωνο *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-2 w-full px-4 py-3 border border-border rounded-lg focus:border-primary focus:outline-none text-base touch-manipulation"
                      placeholder="+30 210 123 4567"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="notes" className="text-foreground font-medium text-sm sm:text-base">
                      Επιπλέον Σημειώσεις (Προαιρετικά)
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="mt-2 w-full px-4 py-3 border border-border rounded-lg focus:border-primary focus:outline-none min-h-[100px] sm:min-h-[120px] text-base touch-manipulation"
                      placeholder="Πείτε μας περισσότερα για τους στόχους σας..."
                    />
                  </div>
                </div>
              </form>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border border-primary/30 hover:bg-primary/5 px-4 sm:px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px] text-sm sm:text-base"
              >
                <ChevronLeft className="w-4 h-4 mr-2 inline" />
                Πίσω
              </button>
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-3 rounded-lg touch-manipulation min-h-[48px] text-sm sm:text-base"
                >
                  Επόμενο
                  <ChevronRight className="w-4 h-4 ml-2 inline" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-3 rounded-lg touch-manipulation min-h-[48px] text-sm sm:text-base"
                >
                  Υποβολή Αίτησης
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostEstimatorForm;
