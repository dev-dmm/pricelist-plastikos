import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye, Package, Tag, DollarSign, Wrench } from 'lucide-react';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.data);
      } else {
        setError('Failed to load packages');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/packages/${packageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      if (response.ok) {
        setPackages(packages.filter(pkg => pkg.id !== packageId));
      } else {
        setError('Failed to delete package');
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
          <p className="mt-4 text-gray-600">Loading packages...</p>
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
            onClick={loadPackages}
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
      <Head title="Packages" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Πακέτα</h1>
                <p className="mt-2 text-gray-600">Διαχείριση όλων των πακέτων</p>
              </div>
              <Link
                href="/admin/packages/create"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Δημιουργία Νέου Πακέτου
              </Link>
            </div>
          </div>

          {/* Packages Grid */}
          {packages.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Δεν υπάρχουν πακέτα</h3>
              <p className="text-gray-600 mb-6">Ξεκινήστε δημιουργώντας το πρώτο σας πακέτο</p>
              <Link
                href="/admin/packages/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Δημιουργία Πακέτου
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                        <p className="text-sm text-gray-600">{pkg.category?.name}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/packages/${pkg.id}`}
                          className="p-2 text-gray-400 hover:text-green-600"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/packages/${pkg.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {pkg.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                    )}

                    {/* Pricing Information */}
                    {pkg.pricing_values && Object.keys(pkg.pricing_values).length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Τιμολόγηση:</h4>
                        <div className="space-y-1">
                          {Object.entries(pkg.pricing_values).map(([pricingId, pricing]) => (
                            <div key={pricingId} className="text-sm text-gray-600">
                              <span className="font-medium">{pricing.name || `Pricing ${pricingId}`}:</span>
                              {pricing.type === 'flat' ? (
                                <span className="ml-2">€{pricing.value}</span>
                              ) : (
                                <span className="ml-2">
                                  €{pricing.min || 0} - €{pricing.max || 0}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pkg.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pkg.is_active ? 'Ενεργό' : 'Ανενεργό'}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{pkg.id}
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

export default Packages;
