import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const PackageSummary = ({ packageId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    loadPackage();
  }, [packageId]);

  const loadPackage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services/${packageId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPackageData(data.data);
      } else {
        setError('Failed to load package');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRange = () => {
    if (!packageData?.pricing_values) return { total: 0, hasRange: false };

    let totalMin = 0;
    let totalMax = 0;
    let hasRange = false;
    let total = 0;

    // Calculate pricing components
    Object.entries(packageData.pricing_values).forEach(([id, pricing]) => {
      if (pricing.type === 'flat') {
        const value = parseFloat(pricing.value) || 0;
        if (value > 0) {
          total += value;
          totalMin += value;
          totalMax += value;
        }
      } else if (pricing.type === 'range') {
        const min = parseFloat(pricing.min) || 0;
        const max = parseFloat(pricing.max) || 0;
        if (min > 0 || max > 0) {
          hasRange = true;
          totalMin += min;
          totalMax += max;
        }
      }
    });

    // Add materials cost
    const materialsCost = (packageData.materials || []).reduce((sum, material) => 
      sum + (parseFloat(material.price) || 0), 0);
    totalMin += materialsCost;
    totalMax += materialsCost;
    total += materialsCost;

    return {
      min: totalMin,
      max: totalMax,
      total: total,
      hasRange: hasRange
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading package...</p>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Package not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateTotalRange();

  return (
    <>
      <Head title="Package Summary" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Πίσω
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Σύνοψη Πακέτου</h1>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Category and Service */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Κατηγορία</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {packageData.category?.name || '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Υπηρεσία</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {packageData.name || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Στοιχεία Κόστους</h3>
              <div className="space-y-4">
                {Object.entries(packageData.pricing_values || {}).map(([id, pricing]) => (
                  pricing.value > 0 || pricing.min > 0 || pricing.max > 0 ? (
                    <div key={id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{pricing.name}</p>
                        {pricing.description && (
                          <p className="text-xs text-gray-500">{pricing.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {pricing.type === 'flat' ? (
                          <p className="text-sm font-medium text-gray-900">
                            €{parseFloat(pricing.value).toFixed(2)}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">
                            €{parseFloat(pricing.min).toFixed(2)} - €{parseFloat(pricing.max).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            </div>

            {/* Materials */}
            {packageData.materials?.length > 0 && (
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Υλικά</h3>
                <div className="space-y-4">
                  {packageData.materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between py-2">
                      <p className="text-sm font-medium text-gray-900">{material.name}</p>
                      <p className="text-sm font-medium text-gray-900">€{parseFloat(material.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Cost */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Συνολικό Κόστος</h3>
                <div className="text-right">
                  {totals.hasRange ? (
                    <p className="text-lg font-bold text-gray-900">
                      €{totals.min.toFixed(2)} - €{totals.max.toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-lg font-bold text-gray-900">
                      €{totals.total.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageSummary;
