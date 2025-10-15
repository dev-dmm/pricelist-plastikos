import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ auth, service, categories, pricingTypes, materials }) {
    const hasVariations = service.variations && service.variations.length > 0;
    
    const { data, setData, put, processing, errors } = useForm({
        name: service.name || '',
        category_id: service.category_id || '',
        description: service.description || '',
        has_variations: hasVariations,
        pricing_types: !hasVariations ? (service.pricingTypes?.map(pt => ({
            id: pt.id,
            price_from: pt.pivot.price_from,
            price_to: pt.pivot.price_to
        })) || pricingTypes.map(pt => ({
            id: pt.id,
            price_from: 0,
            price_to: 0
        }))) : [],
        materials: !hasVariations ? (service.materials?.map(m => m.id) || []) : [],
        variations: hasVariations ? service.variations.map(v => ({
            id: v.id,
            name: v.name,
            description: v.description || '',
            is_active: v.is_active,
            pricing_types: pricingTypes.map(pt => {
                const existingPt = v.pricing_types?.find(vpt => vpt.id === pt.id);
                return {
                    id: pt.id,
                    price_from: existingPt?.pivot?.price_from || 0,
                    price_to: existingPt?.pivot?.price_to || 0
                };
            })
        })) : []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.services.update', service.id));
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

    const addVariation = () => {
        const newVariations = [...data.variations, {
            id: null,
            name: '',
            description: '',
            is_active: true,
            pricing_types: pricingTypes.map(pt => ({
                id: pt.id,
                price_from: 0,
                price_to: 0
            }))
        }];
        setData('variations', newVariations);
    };

    const removeVariation = (index) => {
        const newVariations = data.variations.filter((_, i) => i !== index);
        setData('variations', newVariations);
    };

    const updateVariation = (index, field, value) => {
        const newVariations = [...data.variations];
        newVariations[index][field] = value;
        setData('variations', newVariations);
    };

    const updateVariationPricing = (varIndex, ptIndex, field, value) => {
        const newVariations = [...data.variations];
        newVariations[varIndex].pricing_types[ptIndex][field] = parseFloat(value) || 0;
        setData('variations', newVariations);
    };

    const toggleHasVariations = () => {
        const newHasVariations = !data.has_variations;
        setData({
            ...data,
            has_variations: newHasVariations,
            variations: newHasVariations ? [{
                id: null,
                name: '',
                description: '',
                is_active: true,
                pricing_types: pricingTypes.map(pt => ({
                    id: pt.id,
                    price_from: 0,
                    price_to: 0
                }))
            }] : [],
            pricing_types: !newHasVariations ? pricingTypes.map(pt => ({
                id: pt.id,
                price_from: 0,
                price_to: 0
            })) : [],
            materials: []
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Service
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
            <Head title="Edit Service" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
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
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Has Variations Toggle */}
                                <div className="border-t border-b border-gray-200 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Παραλλαγές Υπηρεσίας
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Ενεργοποιήστε αν η υπηρεσία έχει διαφορετικές επιλογές (π.χ. "με μέθη", "με τοπική")
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={toggleHasVariations}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                data.has_variations ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    data.has_variations ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Variations Section */}
                                {data.has_variations ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Διαχείριση Παραλλαγών
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addVariation}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                            >
                                                + Προσθήκη Παραλλαγής
                                            </button>
                                        </div>

                                        {data.variations.map((variation, varIndex) => (
                                            <div key={varIndex} className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
                                                        <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                                                            {varIndex + 1}
                                                        </span>
                                                        Παραλλαγή {varIndex + 1}
                                                    </h4>
                                                    {data.variations.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVariation(varIndex)}
                                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        >
                                                            Διαγραφή
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Variation Name */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Όνομα Παραλλαγής *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={variation.name}
                                                            onChange={e => updateVariation(varIndex, 'name', e.target.value)}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                            placeholder="π.χ. με μέθη, με τοπική"
                                                        />
                                                    </div>

                                                    {/* Variation Pricing Types */}
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-700 mb-3">
                                                            Τιμές για αυτή την παραλλαγή
                                                        </h5>
                                                        <div className="space-y-3">
                                                            {pricingTypes.map((pricingType, ptIndex) => (
                                                                <div key={pricingType.id} className="grid grid-cols-3 gap-4 items-center bg-white p-3 rounded border border-gray-200">
                                                                    <div className="font-medium text-gray-700 text-sm">
                                                                        {pricingType.name}
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs text-gray-600">Από (€)</label>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={variation.pricing_types[ptIndex]?.price_from || 0}
                                                                            onChange={e => updateVariationPricing(varIndex, ptIndex, 'price_from', e.target.value)}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs text-gray-600">Έως (€)</label>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            value={variation.pricing_types[ptIndex]?.price_to || 0}
                                                                            onChange={e => updateVariationPricing(varIndex, ptIndex, 'price_to', e.target.value)}
                                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
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
                                    </>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update Service'}
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
