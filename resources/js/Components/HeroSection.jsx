import { useState, useEffect } from "react";
import { Sparkles, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { fetchServiceData, getCategoriesFromApi, getAllProceduresWithVariationsFromApi } from '../utils/serviceApi';

const HeroSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  
  // Service data state
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load service data on component mount
  useEffect(() => {
    const loadServiceData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchServiceData();
        setServiceData(data);
        console.log('Service data loaded for HeroSection:', data);
      } catch (err) {
        console.error('Error loading service data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadServiceData();
  }, []);

  // Get categories and procedures from service data
  const categories = serviceData?.categories ? getCategoriesFromApi(serviceData.categories) : [];
  const allProceduresWithVariations = serviceData?.services ? getAllProceduresWithVariationsFromApi(serviceData.services) : [];

  // Get procedures for selected category
  const proceduresForCategory = selectedCategory && categories.length > 0 ? 
    allProceduresWithVariations.filter(p => {
      // Find the category name from the selected category ID
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.label;
      return categoryName && p.category === categoryName;
    }) : [];

  const handleNext = () => {
    if (currentStep === 1 && !selectedCategory) {
      alert("Παρακαλώ επιλέξτε κατηγορία");
      return;
    }
    if (currentStep === 2 && !selectedProcedure) {
      alert("Παρακαλώ επιλέξτε επέμβαση");
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
    
    // Get selected procedure details
    const selectedProcedureDetails = proceduresForCategory.find(p => p.name === selectedProcedure);
    
    // Submit to backend
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
      category: categories.find(cat => cat.id === selectedCategory)?.label || selectedCategory,
      procedure: selectedProcedure,
      pricing_details: selectedProcedureDetails?.pricing || null,
      total_price: selectedProcedureDetails?.total_price || null,
    };

    // Get CSRF token safely
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
                     document.querySelector('meta[name="csrf-token"]')?.content ||
                     '';

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

  // Calculate total steps (now 3 steps: Category, Procedure, Contact Info)
  const totalSteps = 3;
  const stepNumbers = [1, 2, 3];

  const stepIndicator = (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-6 sm:mb-8 overflow-x-auto px-2">
      {stepNumbers.map((step) => (
        <div key={step} className="flex items-center flex-shrink-0">
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-clinic text-xs sm:text-sm ${
              step < currentStep
                ? "bg-primary text-primary-foreground"
                : step === currentStep
                ? "bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {step < currentStep ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-6 sm:w-8 h-1 mx-1 sm:mx-2 transition-clinic ${
                step < currentStep ? "bg-primary" : "bg-secondary"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  if (submitted) {
    const selectedProcedureDetails = proceduresForCategory.find(p => p.name === selectedProcedure);
    return (
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden clinic-gradient"
      >
        <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 text-center relative z-10">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Αίτηση Ελήφθη!
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
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
                setFormData({ name: "", email: "", phone: "", notes: "" });
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 px-6 py-3 rounded-lg"
            >
              Υποβάλετε Άλλη Αίτηση
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden clinic-gradient"
      >
        <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Φόρτωση Δεδομένων...
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Παρακαλώ περιμένετε ενώ φορτώνουμε τις διαθέσιμες επεμβάσεις
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden clinic-gradient"
      >
        <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Σφάλμα Φόρτωσης
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Δεν ήταν δυνατή η φόρτωση των δεδομένων. Παρακαλώ δοκιμάστε ξανά αργότερα.
            </p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden clinic-gradient"
    >
      <div className="container mx-auto px-4 py-8 sm:py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-card/60 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-primary/20 shadow-clinic">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">Γρήγορη Εκτίμηση</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Αισθητικές Επεμβάσεις με{" "}
                <span className="text-primary">Διαφάνεια & Φροντίδα</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Λάβετε εξατομικευμένη ενημέρωση εντός 2 ωρών
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Πιστοποιημένοι Χειρουργοί</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span>15+ Χρόνια Εμπειρία</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span>2,500+ Ευχαριστημένοι Ασθενείς</span>
                </div>
              </div>
            </div>

            {/* Right Column - Form Container */}
            <div className="bg-card/60 backdrop-blur-sm shadow-clinic-lg rounded-xl border border-primary/20">
              <div className="p-4 sm:p-6 md:p-8">
                {stepIndicator}

                {/* Step 1: Category */}
                {currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
                    <div className="text-center mb-4 sm:mb-6">
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-2">
                        Επιλέξτε Κατηγορία
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Επιλέξτε την περιοχή που σας ενδιαφέρει</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-3 sm:p-4 rounded-lg border-2 transition-clinic text-left touch-manipulation min-h-[50px] ${
                            selectedCategory === category.id
                              ? "border-primary bg-primary/5 shadow-clinic-md"
                              : "border-border hover:border-primary/50 hover:bg-accent/50"
                          }`}
                        >
                          <span className="font-semibold text-sm sm:text-base">{category.label}</span>
                          {category.description && (
                            <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Procedure */}
                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
                    <div className="text-center mb-4 sm:mb-6">
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-2">
                        Επιλέξτε Επέμβαση
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Επιλέξτε την συγκεκριμένη επέμβαση</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {proceduresForCategory.map((procedure) => (
                          <div key={procedure.id} className="space-y-2">
                            {/* Main procedure button */}
                            <button
                              onClick={() => {
                                if (!procedure.variations) {
                                  setSelectedProcedure(procedure.name);
                                }
                              }}
                              className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-clinic text-left touch-manipulation ${
                                !procedure.variations && selectedProcedure === procedure.name
                                  ? "border-primary bg-primary/5 shadow-clinic-md"
                                  : procedure.variations
                                  ? "border-border bg-gray-50"
                                  : "border-border hover:border-primary/50 hover:bg-accent/50"
                              }`}
                            >
                              <span className="font-semibold text-sm sm:text-base">{procedure.name}</span>
                              {procedure.description && (
                                <p className="text-xs text-muted-foreground mt-1">{procedure.description}</p>
                              )}
                            </button>

                            {/* Variations if any */}
                            {procedure.variations && (
                              <div className="pl-4 space-y-2">
                                {procedure.variations.map((variation) => (
                                  <button
                                    key={variation.id}
                                    onClick={() => setSelectedProcedure(`${procedure.name} ${variation.name}`)}
                                    className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-clinic text-left touch-manipulation ${
                                      selectedProcedure === `${procedure.name} ${variation.name}`
                                        ? "border-primary bg-primary/5 shadow-clinic-md"
                                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                                    }`}
                                  >
                                    <span className="font-semibold text-sm sm:text-base">{variation.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info Step */}
                {currentStep === 3 && (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 animate-fade-in">
                    <div className="text-center mb-4 sm:mb-6">
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-2">
                        Τα Στοιχεία σας
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Πώς μπορούμε να σας επικοινωνήσουμε;</p>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label htmlFor="name" className="text-foreground font-medium text-xs sm:text-sm">
                          Ονοματεπώνυμο *
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:border-primary focus:outline-none text-sm touch-manipulation"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-foreground font-medium text-xs sm:text-sm">
                          Διεύθυνση Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:border-primary focus:outline-none text-sm touch-manipulation"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="text-foreground font-medium text-xs sm:text-sm">
                          Τηλέφωνο *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:border-primary focus:outline-none text-sm touch-manipulation"
                          placeholder="+30 210 123 4567"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="notes" className="text-foreground font-medium text-xs sm:text-sm">
                          Επιπλέον Σημειώσεις (Προαιρετικά)
                        </label>
                        <textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:border-primary focus:outline-none min-h-[80px] text-sm touch-manipulation"
                          placeholder="Πείτε μας περισσότερα για τους στόχους σας..."
                        />
                      </div>
                    </div>
                  </form>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="border border-primary/30 hover:bg-primary/5 px-3 sm:px-4 py-2 sm:py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[40px] text-xs sm:text-sm"
                  >
                    <ChevronLeft className="w-3 h-3 mr-1 sm:mr-2 inline" />
                    Πίσω
                  </button>
                  {currentStep < totalSteps ? (
                    <button
                      onClick={handleNext}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-2 sm:py-3 rounded-lg touch-manipulation min-h-[40px] text-xs sm:text-sm"
                    >
                      Επόμενο
                      <ChevronRight className="w-3 h-3 ml-1 sm:ml-2 inline" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-4 py-2 sm:py-3 rounded-lg touch-manipulation min-h-[40px] text-xs sm:text-sm"
                    >
                      Υποβολή Αίτησης
                    </button>
                  )}
                </div>
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