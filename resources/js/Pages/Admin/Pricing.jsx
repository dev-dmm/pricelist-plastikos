import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

const Pricing = () => {
  const [pricings, setPricings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPricings();
  }, []);

  const loadPricings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pricings');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPricings(data.data);
      } else {
        setError('Failed to load pricings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pricingId) => {
    if (!confirm('Are you sure you want to delete this pricing?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/pricings/${pricingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      if (response.ok) {
        setPricings(pricings.filter(pr => pr.id !== pricingId));
      } else {
        setError('Failed to delete pricing');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const formatAmount = (pricing) => {
    if (pricing.type === 'flat') {
      return `€${pricing.flat_amount}`;
    } else if (pricing.type === 'range') {
      return `€${pricing.min_amount} - €${pricing.max_amount}`;
    } else if (pricing.type === 'percentage') {
      return `${pricing.percentage}%`;
    }
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pricings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadPricings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title="Pricing" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Τιμολόγηση</h1>
                <p className="mt-2 text-gray-600">Διαχείριση όλων των τιμολογήσεων</p>
              </div>
              <Link
                href="/admin/pricing/create"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Δημιουργία Νέας Τιμολόγησης
              </Link>
            </div>
          </div>

          {/* Pricings Grid */}
          {pricings.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Δεν υπάρχουν τιμολογήσεις</h3>
              <p className="text-gray-600 mb-6">Ξεκινήστε δημιουργώντας την πρώτη σας τιμολόγηση</p>
              <Link
                href="/admin/pricing/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Δημιουργία Τιμολόγησης
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricings.map((pricing) => (
                <div key={pricing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{pricing.name}</h3>
                        <p className="text-sm text-gray-600">{formatAmount(pricing)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/pricing/${pricing.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(pricing.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {pricing.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pricing.description}</p>
                    )}

                    {/* Pricing Type and Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {pricing.type === 'flat' ? 'Σταθερή' : pricing.type === 'range' ? 'Εύρος' : 'Ποσοστό'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pricing.is_exclusive 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pricing.is_exclusive ? 'Εξαιρετική' : 'Γενική'}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pricing.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pricing.is_active ? 'Ενεργή' : 'Ανενεργή'}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{pricing.id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pricing;
