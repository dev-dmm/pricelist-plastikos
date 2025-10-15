import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, services }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('el-GR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const renderPricingTypes = (types) => {
        return types.map((type, index) => (
            <div key={index} className="flex justify-between text-sm py-1">
                <span className="text-gray-600">{type.name}</span>
                <span className="font-medium">
                    {type.price_to && type.price_to !== type.price_from
                        ? `${formatPrice(type.price_from)} - ${formatPrice(type.price_to)}`
                        : formatPrice(type.price_from)}
                </span>
            </div>
        ));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Υπηρεσίες
                    </h2>
                    <Link
                        href={route('admin.services.create')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Δημιουργία Νέας
                    </Link>
                </div>
            }
        >
            <Head title="Υπηρεσίες" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">
                                                        {service.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {service.category}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route('admin.services.edit', service.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Επεξεργασία
                                                </Link>
                                            </div>

                                            {service.description && (
                                                <p className="text-gray-700 mb-4">
                                                    {service.description}
                                                </p>
                                            )}

                                            <div className="space-y-4">
                                                {service.variations ? (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <h4 className="font-medium text-gray-900">
                                                                Επιλογές Υπηρεσίας
                                                            </h4>
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                                {service.variations.length} παραλλαγές
                                                            </span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {service.variations.map((variation, index) => (
                                                                <div 
                                                                    key={variation.id} 
                                                                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500"
                                                                >
                                                                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                                                                            {index + 1}
                                                                        </span>
                                                                        {variation.name}
                                                                    </h5>
                                                                    <div className="space-y-1.5 ml-8">
                                                                        {renderPricingTypes(variation.pricing.types)}
                                                                    </div>
                                                                    <div className="mt-3 pt-3 ml-8 border-t border-gray-300">
                                                                        <div className="flex justify-between font-semibold text-blue-900">
                                                                            <span>Σύνολο:</span>
                                                                            <span>
                                                                                {variation.pricing.total.min === variation.pricing.total.max
                                                                                    ? formatPrice(variation.pricing.total.min)
                                                                                    : `${formatPrice(variation.pricing.total.min)} - ${formatPrice(variation.pricing.total.max)}`}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">
                                                            Τιμές
                                                        </h4>
                                                        <div className="space-y-1">
                                                            {renderPricingTypes(service.pricing.types)}
                                                        </div>
                                                    </div>
                                                )}

                                                {!service.variations && service.pricing.materials && service.pricing.materials.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">
                                                            Υλικά
                                                        </h4>
                                                        <div className="space-y-1">
                                                            {service.pricing.materials.map((material, index) => (
                                                                <div key={index} className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">{material.name}</span>
                                                                    <span className="font-medium">{formatPrice(material.price)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="pt-2 border-t">
                                                    <div className="flex justify-between font-medium">
                                                        <span>Συνολικό εύρος τιμών:</span>
                                                        <span>
                                                            {service.pricing.total.min === service.pricing.total.max
                                                                ? formatPrice(service.pricing.total.min)
                                                                : `${formatPrice(service.pricing.total.min)} - ${formatPrice(service.pricing.total.max)}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}