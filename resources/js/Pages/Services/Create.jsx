import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function Create({ auth, categories, pricingTypes, materials }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        description: '',
        pricing_types: pricingTypes.map(pt => ({
            id: pt.id,
            price_from: 0,
            price_to: 0
        })),
        materials: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.services.store'));
    };

    const updatePricingType = (index, field, value) => {
        const newPricingTypes = [...data.pricing_types];
        newPricingTypes[index][field] = parseFloat(value) || 0;
        setData('pricing_types', newPricingTypes);
    };

    const toggleMaterial = (materialId) => {
        const newMaterials = data.materials.includes(materialId)
            ? data.materials.filter(id => id !== materialId)
            : [...data.materials, materialId];
        setData('materials', newMaterials);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Service
                    </h2>
                    <Link
                        href={route('admin.services.index')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Back to Services
                    </Link>
                </div>
            }
        >
            <Head title="Create Service" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Info Banner */}
                            <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700">
                                            <strong>Σημείωση:</strong> Για υπηρεσίες με παραλλαγές (π.χ. "με μέθη" ή "με τοπική"), χρησιμοποιήστε το database seeder. Αυτή η φόρμα δημιουργεί απλές υπηρεσίες χωρίς παραλλαγές.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Service Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Service Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="e.g., Ρινοπλαστική"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Describe the service..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Pricing Types */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Pricing Types
                                    </h3>
                                    <div className="space-y-4">
                                        {pricingTypes.map((pricingType, index) => (
                                            <div key={pricingType.id} className="grid grid-cols-3 gap-4 items-center">
                                                <div className="font-medium text-gray-700">
                                                    {pricingType.name}
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600">Price From (€)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={data.pricing_types[index]?.price_from || 0}
                                                        onChange={e => updatePricingType(index, 'price_from', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600">Price To (€)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={data.pricing_types[index]?.price_to || 0}
                                                        onChange={e => updatePricingType(index, 'price_to', e.target.value)}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Materials */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Materials
                                    </h3>
                                    <div className="space-y-2">
                                        {materials.map(material => (
                                            <div key={material.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={data.materials.includes(material.id)}
                                                    onChange={() => toggleMaterial(material.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label className="ml-3 block text-sm text-gray-700">
                                                    {material.name} (€{material.price})
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Service'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
