import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Euro, Clock, User, Building, Package } from 'lucide-react';

const Pricelist = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/categories')
      ]);
      
      const servicesData = await servicesRes.json();
      const categoriesData = await categoriesRes.json();
      
      if (servicesData.success) {
        setServices(servicesData.data);
      }
      if (categoriesData.success) {
        setCategories(categoriesData.data);
        // Expand all categories by default
        const expanded = {};
        categoriesData.data.forEach(cat => {
          expanded[cat.id] = true;
        });
        setExpandedCategories(expanded);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getServicesByCategory = (categoryId) => {
    return services.filter(service => service.category_id === categoryId);
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `€${Number(price).toLocaleString()}`;
  };

  const formatPriceRange = (service) => {
    if (service.price_range) {
      return service.price_range;
    }
    if (service.price_from && service.price_to) {
      return `${formatPrice(service.price_from)} - ${formatPrice(service.price_to)}`;
    }
    if (service.price_from) {
      return `Από ${formatPrice(service.price_from)}`;
    }
    return 'Επικοινωνήστε για τιμή';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Φόρτωση τιμοκαταλόγου...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Σφάλμα Φόρτωσης</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title="Τιμοκατάλογος - Κλινική Αισθητικής" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Τιμοκατάλογος Επεμβάσεων
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Αισθητικές επεμβάσεις με διαφάνεια και φροντίδα
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Αναζήτηση επεμβάσεων..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {searchTerm ? (
            /* Search Results */
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Αποτελέσματα Αναζήτησης ({filteredServices.length})
              </h2>
              <div className="grid gap-6">
                {filteredServices.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Building className="w-4 h-4 mr-2" />
                          {service.category?.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPriceRange(service)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Categories View */
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryServices = getServicesByCategory(category.id);
                const isExpanded = expandedCategories[category.id];
                
                return (
                  <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                    >
                      <div className="text-left">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {category.name}
                        </h2>
                        <p className="text-gray-600">{category.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {categoryServices.length} επεμβάσεις
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-500" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t">
                        <div className="divide-y divide-gray-200">
                          {categoryServices.map((service) => (
                            <div key={service.id} className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {service.name}
                                  </h3>
                                  {service.description && (
                                    <p className="text-gray-600 mb-4">{service.description}</p>
                                  )}
                                  
                                  {/* Service Variations */}
                                  {service.variations && service.variations.length > 0 && (
                                    <div className="mt-4">
                                      <h4 className="text-sm font-medium text-gray-700 mb-2">Επιλογές:</h4>
                                      <div className="space-y-2">
                                        {service.variations.map((variation, index) => (
                                          <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                            <span className="text-sm text-gray-700">{variation.name}</span>
                                            {variation.price_from && (
                                              <span className="text-sm font-medium text-blue-600">
                                                {variation.price_to 
                                                  ? `${formatPrice(variation.price_from)} - ${formatPrice(variation.price_to)}`
                                                  : `Από ${formatPrice(variation.price_from)}`
                                                }
                                              </span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-right ml-6">
                                  <div className="text-2xl font-bold text-blue-600 mb-2">
                                    {formatPriceRange(service)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Συνολικό κόστος
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="bg-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ενδιαφέρεστε για κάποια επέμβαση;
            </h2>
            <p className="text-xl mb-8">
              Κλείστε συνάντηση για προσωποποιημένη εκτίμηση κόστους
            </p>
            <a
              href="/#home"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Κλείστε Συνάντηση
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricelist;
