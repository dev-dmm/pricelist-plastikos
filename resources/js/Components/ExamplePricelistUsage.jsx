import { useState, useEffect } from 'react';
import { fetchPricelistData, getCategories, getProceduresForCategory, getAllProceduresWithVariations, calculateCorrectTotal, getCostBreakdownWithTotal } from '../utils/googleSheets';

/**
 * Example component που δείχνει πώς να χρησιμοποιήσουμε τα δεδομένα από το Google Sheets
 * στο CostEstimatorForm ή σε άλλα components
 */
const ExamplePricelistUsage = () => {
  const [pricelistData, setPricelistData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadPricelistData();
  }, []);

  const loadPricelistData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPricelistData();
      setPricelistData(data);
      console.log('Loaded pricelist data:', data);
    } catch (err) {
      console.error('Error loading pricelist:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = pricelistData ? getCategories(pricelistData) : [];
  const procedures = selectedCategory ? getProceduresForCategory(pricelistData, selectedCategory) : [];
  const allProceduresWithVariations = pricelistData ? getAllProceduresWithVariations(pricelistData) : [];

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Παράδειγμα Χρήσης Pricelist Data
      </h3>

      {loading && (
        <p className="text-blue-600">Φόρτωση δεδομένων...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">Σφάλμα: {error}</p>
        </div>
      )}

      {pricelistData && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700">
              ✅ Φορτώθηκαν {pricelistData.length} επεμβάσεις από το Google Sheets
            </p>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Επιλέξτε Κατηγορία:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">-- Επιλέξτε κατηγορία --</option>
              {categories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Procedures for selected category */}
          {selectedCategory && (
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Επεμβάσεις για "{selectedCategory}" ({procedures.length})
              </h4>
              <div className="space-y-6">
                {procedures.map((procedure, idx) => (
                  <div key={idx} className="bg-accent/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">{procedure.name}</h5>
                    <p className="text-sm text-muted-foreground mb-3">{procedure.description}</p>
                    
                    {/* Main procedure pricing */}
                    <div className="space-y-1 text-sm mb-4">
                      {procedure.doctorFee && procedure.doctorFee.display && (
                        <div className="flex justify-between">
                          <span>Ιατρός:</span>
                          <span className="font-medium">
                            €{procedure.doctorFee.display}
                            {procedure.doctorFee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                          </span>
                        </div>
                      )}
                      {procedure.assistantFee && procedure.assistantFee.display && (
                        <div className="flex justify-between">
                          <span>Βοηθός:</span>
                          <span className="font-medium">
                            €{procedure.assistantFee.display}
                            {procedure.assistantFee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                          </span>
                        </div>
                      )}
                      {procedure.anesthesiologistFee && procedure.anesthesiologistFee.display && (
                        <div className="flex justify-between">
                          <span>Αναισθησιολόγος:</span>
                          <span className="font-medium">
                            €{procedure.anesthesiologistFee.display}
                            {procedure.anesthesiologistFee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                          </span>
                        </div>
                      )}
                      {procedure.clinic1Fee && procedure.clinic1Fee.display && (
                        <div className="flex justify-between">
                          <span>Κλινική:</span>
                          <span className="font-medium">
                            €{procedure.clinic1Fee.display}
                            {procedure.clinic1Fee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                          </span>
                        </div>
                      )}
                      {procedure.total && procedure.total.display && (
                        <div className="flex justify-between border-t border-border pt-2 mt-2">
                          <span className="font-semibold">Σύνολο (από Sheet):</span>
                          <span className="font-bold text-primary">
                            €{procedure.total.display}
                            {procedure.total.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                          </span>
                        </div>
                      )}
                      
                      {/* Show corrected total */}
                      <div className="flex justify-between border-t border-border pt-2 mt-2 bg-green-50 p-2 rounded">
                        <span className="font-semibold text-green-800">Σωστό Σύνολο:</span>
                        <span className="font-bold text-green-700">
                          €{calculateCorrectTotal(procedure).display}
                          {calculateCorrectTotal(procedure).isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                        </span>
                      </div>
                      
                      {/* Show cost breakdown */}
                      <div className="border-t border-border pt-2 mt-2">
                        <h6 className="font-medium text-foreground mb-2">Ανάλυση Κόστους:</h6>
                        <div className="space-y-1 text-sm">
                          {getCostBreakdownWithTotal(procedure).components.map((component, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-muted-foreground">{component.name}:</span>
                              <span className={`font-medium ${component.hasValue ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {component.hasValue ? (
                                  <>
                                    €{component.display}
                                    {component.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between border-t border-border pt-1 mt-1 font-semibold">
                            <span>Σύνολο:</span>
                            <span className="text-green-700">
                              €{getCostBreakdownWithTotal(procedure).total.display}
                              {getCostBreakdownWithTotal(procedure).total.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Variations */}
                    {procedure.variations && procedure.variations.length > 0 && (
                      <div className="border-t border-border pt-4">
                        <h6 className="font-medium text-foreground mb-3">Παραλλαγές:</h6>
                        <div className="space-y-3">
                          {procedure.variations.map((variation, varIdx) => (
                            <div key={varIdx} className="bg-background/50 p-3 rounded-lg">
                              <h7 className="font-medium text-foreground">{variation.name}</h7>
                              <div className="space-y-1 text-sm mt-2">
                                {variation.doctorFee && variation.doctorFee.display && (
                                  <div className="flex justify-between">
                                    <span>Ιατρός:</span>
                                    <span className="font-medium">
                                      €{variation.doctorFee.display}
                                      {variation.doctorFee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                    </span>
                                  </div>
                                )}
                                {variation.total && variation.total.display && (
                                  <div className="flex justify-between border-t border-border pt-1 mt-1">
                                    <span className="font-semibold">Σύνολο (από Sheet):</span>
                                    <span className="font-bold text-primary">
                                      €{variation.total.display}
                                      {variation.total.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                    </span>
                                  </div>
                                )}
                                
                                {/* Show corrected total for variation */}
                                <div className="flex justify-between border-t border-border pt-1 mt-1 bg-green-50 p-2 rounded">
                                  <span className="font-semibold text-green-800">Σωστό Σύνολο:</span>
                                  <span className="font-bold text-green-700">
                                    €{calculateCorrectTotal(variation).display}
                                    {calculateCorrectTotal(variation).isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show all procedures with variations */}
          <div className="bg-card rounded-lg shadow-lg p-6 mt-8">
            <h4 className="font-semibold text-foreground mb-4">
              Όλες οι Επεμβάσεις με Παραλλαγές ({allProceduresWithVariations.length})
            </h4>
            <div className="space-y-4">
              {allProceduresWithVariations.slice(0, 5).map((procedure, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-foreground">{procedure.name}</h5>
                      <p className="text-sm text-muted-foreground">{procedure.category}</p>
                    </div>
                    <div className="text-right">
                      {procedure.variations.length > 0 && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          {procedure.variations.length} παραλλαγές
                        </span>
                      )}
                    </div>
                  </div>
                  {procedure.variations.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Παραλλαγές: {procedure.variations.map(v => v.name).join(', ')}
                    </div>
                  )}
                </div>
              ))}
              {allProceduresWithVariations.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{allProceduresWithVariations.length - 5} περισσότερες επεμβάσεις...
                </p>
              )}
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-accent/30 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Πώς να χρησιμοποιήσετε στο Code:</h4>
            <pre className="text-xs overflow-x-auto">
{`import { fetchPricelistData, getCategories, getProceduresForCategory } from '../utils/googleSheets';

// Στο component σας:
const [data, setData] = useState(null);

useEffect(() => {
  fetchPricelistData().then(setData);
}, []);

const categories = data ? getCategories(data) : [];
const procedures = selectedCategory ? getProceduresForCategory(data, selectedCategory) : [];`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamplePricelistUsage;