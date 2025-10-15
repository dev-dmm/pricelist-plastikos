import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

const PricingForm = ({ pricing: pricingData = null, pricingId = null }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: pricingData?.name || '',
    description: pricingData?.description || '',
    type: pricingData?.type || 'flat',
    flat_amount: pricingData?.flat_amount || '',
    min_amount: pricingData?.min_amount || '',
    max_amount: pricingData?.max_amount || '',
    percentage: pricingData?.percentage || '',
    currency: pricingData?.currency || 'EUR',
    is_exclusive: pricingData?.is_exclusive ?? false,
    is_active: pricingData?.is_active ?? true,
    sort_order: pricingData?.sort_order || 0,
  });

  useEffect(() => {
    if (pricingId) {
      loadPricing();
    } else {
      setLoading(false);
    }
  }, [pricingId]);

  const loadPricing = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pricings/${pricingId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const pricing = data.data;
        setFormData({
          name: pricing.name,
          description: pricing.description,
          type: pricing.type,
          flat_amount: pricing.flat_amount || '',
          min_amount: pricing.min_amount || '',
          max_amount: pricing.max_amount || '',
          percentage: pricing.percentage || '',
          currency: pricing.currency,
          is_exclusive: pricing.is_exclusive,
          is_active: pricing.is_active,
          sort_order: pricing.sort_order,
        });
      } else {
        setError('Failed to load pricing');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = pricingId ? `/admin/api/pricings/${pricingId}` : '/admin/api/pricings';
      const method = pricingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(pricingId ? 'Τιμολόγηση ενημερώθηκε επιτυχώς!' : 'Τιμολόγηση δημιουργήθηκε επιτυχώς!');
        setTimeout(() => {
          window.location.href = '/admin/pricing';
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title={pricingId ? "Edit Pricing" : "Create Pricing"} />
      
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
            <h1 className="text-3xl font-bold text-gray-900">
              {pricingId ? 'Επεξεργασία Τιμολόγησης' : 'Δημιουργία Νέας Τιμολόγησης'}
            </h1>
            <p className="mt-2 text-gray-600">
              {pricingId ? 'Ενημερώστε τις πληροφορίες της τιμολόγησης' : 'Συμπληρώστε τις πληροφορίες για τη νέα τιμολόγηση'}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Όνομα Τιμολόγησης *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="π.χ., Αμοιβή Ιατρού"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Περιγραφή
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Περιγράψτε την τιμολόγηση..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Τύπος Τιμολόγησης *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="flat">Σταθερή Τιμή</option>
                  <option value="range">Εύρος Τιμών</option>
                  <option value="percentage">Ποσοστό</option>
                </select>
              </div>

              {/* Dynamic fields based on type */}
              {formData.type === 'flat' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ποσό (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.flat_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, flat_amount: e.target.value }))}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              )}

              {formData.type === 'range' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ελάχιστο (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.min_amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_amount: e.target.value }))}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Μέγιστο (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.max_amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_amount: e.target.value }))}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              )}

              {formData.type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ποσοστό (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Σειρά Ταξινόμησης
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_exclusive}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_exclusive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Εξαιρετική Τιμολόγηση
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Ενεργή Τιμολόγηση
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {pricingId ? 'Ενημέρωση' : 'Δημιουργία'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingForm;
