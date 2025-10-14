import { useState, useEffect } from 'react';
import { fetchPricelistData, getCategories, getAllProceduresWithVariations, calculateCorrectTotal, getCostBreakdownWithTotal } from '../utils/googleSheets';

const ExcelDataTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const sheetsData = await fetchPricelistData();
      setData(sheetsData);
      console.log('Google Sheets data loaded:', sheetsData);
    } catch (err) {
      console.error('Error loading Google Sheets data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Google Sheets data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  const categories = getCategories(data);
  const allProceduresWithVariations = getAllProceduresWithVariations(data);
  const procedures = selectedCategory ? allProceduresWithVariations.filter(p => p.category === selectedCategory) : [];

  return (
    <div className="bg-card rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Google Sheets Data Test
      </h3>
      
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">
            ✅ Φορτώθηκαν {data.length} επεμβάσεις από το Google Sheets
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
                  
                  {/* Show cost breakdown with proper parsing */}
                  <div className="mt-4">
                    <h6 className="font-medium text-foreground mb-2">Ανάλυση Κόστους:</h6>
                    <div className="space-y-1 text-sm">
                      {(() => {
                        const correctedTotal = calculateCorrectTotal(procedure);
                        
                        return (
                          <>
                            {procedure.doctorFee && procedure.doctorFee.display && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Ιατρός:</span>
                                <span className="font-medium">
                                  €{procedure.doctorFee.display}
                                  {procedure.doctorFee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                </span>
                              </div>
                            )}
                            {procedure.assistantFee && procedure.assistantFee.display && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Βοηθός:</span>
                                <span className="font-medium">
                                  €{procedure.assistantFee.display}
                                </span>
                              </div>
                            )}
                            {procedure.anesthesiologistFee && procedure.anesthesiologistFee.display && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Αναισθησιολόγος:</span>
                                <span className="font-medium">
                                  €{procedure.anesthesiologistFee.display}
                                </span>
                              </div>
                            )}
                            {procedure.clinic1Fee && procedure.clinic1Fee.display && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Κλινική 1:</span>
                                <span className="font-medium">
                                  €{procedure.clinic1Fee.display}
                                  {procedure.clinic1Fee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                </span>
                              </div>
                            )}
                            {procedure.materialsFee && procedure.materialsFee.display && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Υλικά:</span>
                                <span className="font-medium">
                                  €{procedure.materialsFee.display}
                                  {procedure.materialsFee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between border-t border-border pt-1 mt-1 font-semibold">
                              <span>Σύνολο:</span>
                              <span className="text-green-700">
                                €{correctedTotal.display}
                                {correctedTotal.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Show variations if they exist */}
                  {procedure.variations && procedure.variations.length > 0 && (
                    <div className="mt-4 border-t border-border pt-3">
                      <h6 className="font-medium text-foreground mb-2">Παραλλαγές ({procedure.variations.length}):</h6>
                      <div className="space-y-2">
                        {procedure.variations.map((variation, varIdx) => (
                          <div key={varIdx} className="bg-background/50 p-3 rounded text-sm">
                            <div className="font-medium mb-2">{variation.name}</div>
                            <div className="space-y-1">
                              {variation.doctorFee && variation.doctorFee.display && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Ιατρός:</span>
                                  <span className="font-medium">
                                    €{variation.doctorFee.display}
                                    {variation.doctorFee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                  </span>
                                </div>
                              )}
                              {variation.anesthesiologistFee && variation.anesthesiologistFee.display && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Αναισθησιολόγος:</span>
                                  <span className="font-medium">€{variation.anesthesiologistFee.display}</span>
                                </div>
                              )}
                              {variation.clinic1Fee && variation.clinic1Fee.display && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Κλινική 1:</span>
                                  <span className="font-medium">
                                    €{variation.clinic1Fee.display}
                                    {variation.clinic1Fee.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between border-t border-border pt-1 mt-1 font-semibold">
                                <span>Σύνολο:</span>
                                <span className="text-green-700">
                                  €{variation.total.display}
                                  {variation.total.isRange && <span className="text-xs text-muted-foreground ml-1">(range)</span>}
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

      </div>
    </div>
  );
};

export default ExcelDataTest;
