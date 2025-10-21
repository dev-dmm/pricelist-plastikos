import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/materials');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMaterials(data.data);
      } else {
        setError('Failed to load materials');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (!confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      if (response.ok) {
        setMaterials(materials.filter(mat => mat.id !== materialId));
      } else {
        setError('Failed to delete material');
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
          <p className="mt-4 text-gray-600">Loading materials...</p>
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
            onClick={loadMaterials}
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
      <Head title="Materials" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Υλικά</h1>
                <p className="mt-2 text-gray-600">Διαχείριση όλων των υλικών</p>
              </div>
              <Link
                href="/admin/materials/create"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Δημιουργία Νέου Υλικού
              </Link>
            </div>
          </div>

          {/* Materials Grid */}
          {materials.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Δεν υπάρχουν υλικά</h3>
              <p className="text-gray-600 mb-6">Ξεκινήστε δημιουργώντας το πρώτο σας υλικό</p>
              <Link
                href="/admin/materials/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Δημιουργία Υλικού
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <div key={material.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{material.name}</h3>
                        <p className="text-sm text-gray-600">€{material.price}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/materials/${material.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {material.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
                    )}

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        material.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {material.is_active ? 'Ενεργό' : 'Ανενεργό'}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{material.id}
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

export default Materials;
