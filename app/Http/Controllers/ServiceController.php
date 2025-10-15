<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Material;
use App\Models\PricingType;
use App\Models\Service;
use App\Models\ServiceVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with(['category', 'pricingTypes', 'materials', 'variations.pricingTypes'])
            ->where(function($query) {
                $query->whereDoesntHave('variations')
                    ->orWhereHas('variations');
            })
            ->where('is_active', true)
            ->get()
            ->map(function ($service) {
                $data = [
                    'id' => $service->id,
                    'name' => $service->name,
                    'category' => $service->category ? $service->category->name : 'N/A',
                    'description' => $service->description,
                ];

                // If service has variations  
                $variationsData = $service->getRelation('variations');
                if ($variationsData && $variationsData->isNotEmpty()) {
                    $variations = $variationsData->map(function ($variation) {
                        // Calculate total for this variation
                        $variationTotal = 0;
                        $pricingTypes = $variation->pricingTypes->map(function ($type) use (&$variationTotal) {
                            $price = $type->pivot->price_from ?? 0;
                            $variationTotal += $price;
                            return [
                                'name' => $type->name,
                                'price_from' => $price,
                                'price_to' => $type->pivot->price_to ?? $price,
                            ];
                        })->values()->toArray();

                        return [
                            'id' => $variation->id,
                            'name' => $variation->name,
                            'pricing' => [
                                'types' => $pricingTypes,
                                'total' => ['min' => $variationTotal, 'max' => $variationTotal],
                            ],
                        ];
                    })->values()->toArray();

                    // Calculate min and max from all variations
                    $minTotal = collect($variations)->min(function ($variation) {
                        return $variation['pricing']['total']['min'];
                    }) ?? 0;
                    $maxTotal = collect($variations)->max(function ($variation) {
                        return $variation['pricing']['total']['max'];
                    }) ?? 0;

                    $data['variations'] = $variations;
                    $data['pricing'] = [
                        'types' => [],
                        'total' => ['min' => $minTotal, 'max' => $maxTotal]
                    ];
                } else {
                    // Regular service pricing
                    $data['pricing'] = [
                        'types' => $service->pricingTypes ? $service->pricingTypes->map(function ($type) {
                            return [
                                'name' => $type->name,
                                'price_from' => $type->pivot->price_from ?? 0,
                                'price_to' => $type->pivot->price_to ?? 0,
                            ];
                        }) : [],
                        'materials' => $service->materials ? $service->materials->map(function ($material) {
                            return [
                                'name' => $material->name,
                                'price' => $material->price ?? 0,
                            ];
                        }) : [],
                        'total' => $service->total_price ?? ['min' => 0, 'max' => 0],
                    ];
                }

                return $data;
            });

        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        return Inertia::render('Services/Create', [
            'categories' => Category::all(),
            'pricingTypes' => PricingType::all(),
            'materials' => Material::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'pricing_types' => 'required|array',
            'pricing_types.*.id' => 'required|exists:pricing_types,id',
            'pricing_types.*.price_from' => 'required|numeric|min:0',
            'pricing_types.*.price_to' => 'nullable|numeric|min:0',
            'materials' => 'array',
            'materials.*' => 'exists:materials,id',
        ]);

        $service = Service::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'category_id' => $request->category_id,
            'description' => $request->description,
        ]);

        // Attach pricing types with their prices
        foreach ($request->pricing_types as $pricingType) {
            $service->pricingTypes()->attach($pricingType['id'], [
                'price_from' => $pricingType['price_from'],
                'price_to' => $pricingType['price_to'] ?? $pricingType['price_from'],
            ]);
        }

        // Attach materials if any
        if ($request->has('materials')) {
            $service->materials()->attach($request->materials);
        }

        return redirect()->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    public function show(Service $service)
    {
        $service->load(['category', 'pricingTypes', 'materials']);
        
        return Inertia::render('Services/Show', [
            'service' => [
                'id' => $service->id,
                'name' => $service->name,
                'category' => $service->category->name,
                'description' => $service->description,
                'pricing' => [
                    'types' => $service->pricingTypes->map(function ($type) {
                        return [
                            'name' => $type->name,
                            'price_from' => $type->pivot->price_from,
                            'price_to' => $type->pivot->price_to,
                        ];
                    }),
                    'materials' => $service->materials->map(function ($material) {
                        return [
                            'name' => $material->name,
                            'price' => $material->price,
                        ];
                    }),
                    'total' => $service->total_price,
                ],
            ],
        ]);
    }

    public function edit(Service $service)
    {
        $service->load(['category', 'pricingTypes', 'materials', 'variations.pricingTypes']);

        return Inertia::render('Services/Edit', [
            'service' => $service,
            'categories' => Category::all(),
            'pricingTypes' => PricingType::all(),
            'materials' => Material::all(),
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $hasVariations = $request->has_variations ?? false;
        
        $rules = [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'has_variations' => 'boolean',
        ];

        if ($hasVariations) {
            $rules['variations'] = 'required|array|min:1';
            $rules['variations.*.name'] = 'required|string|max:255';
            $rules['variations.*.pricing_types'] = 'required|array';
            $rules['variations.*.pricing_types.*.id'] = 'required|exists:pricing_types,id';
            $rules['variations.*.pricing_types.*.price_from'] = 'required|numeric|min:0';
            $rules['variations.*.pricing_types.*.price_to'] = 'nullable|numeric|min:0';
        } else {
            $rules['pricing_types'] = 'required|array';
            $rules['pricing_types.*.id'] = 'required|exists:pricing_types,id';
            $rules['pricing_types.*.price_from'] = 'required|numeric|min:0';
            $rules['pricing_types.*.price_to'] = 'nullable|numeric|min:0';
            $rules['materials'] = 'array';
            $rules['materials.*'] = 'exists:materials,id';
        }

        $request->validate($rules);

        $service->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'category_id' => $request->category_id,
            'description' => $request->description,
        ]);

        if ($hasVariations) {
            // Delete existing variations if switching to variations mode
            $existingVariationIds = $service->getRelation('variations')->pluck('id')->toArray();
            
            $submittedVariationIds = [];
            
            foreach ($request->variations as $variationData) {
                if (isset($variationData['id']) && $variationData['id']) {
                    // Update existing variation
                    $variation = ServiceVariation::find($variationData['id']);
                    if ($variation && $variation->service_id == $service->id) {
                        $variation->update([
                            'name' => $variationData['name'],
                            'description' => $variationData['description'] ?? null,
                        ]);
                        $submittedVariationIds[] = $variation->id;
                    }
                } else {
                    // Create new variation
                    $variation = ServiceVariation::create([
                        'service_id' => $service->id,
                        'name' => $variationData['name'],
                        'description' => $variationData['description'] ?? null,
                        'is_active' => true,
                    ]);
                    $submittedVariationIds[] = $variation->id;
                }

                // Sync pricing types for this variation
                $pricingTypes = collect($variationData['pricing_types'])->mapWithKeys(function ($type) {
                    return [$type['id'] => [
                        'price_from' => $type['price_from'],
                        'price_to' => $type['price_to'] ?? $type['price_from'],
                    ]];
                })->all();
                
                $variation->pricingTypes()->sync($pricingTypes);
            }

            // Delete variations that were removed
            $variationsToDelete = array_diff($existingVariationIds, $submittedVariationIds);
            ServiceVariation::whereIn('id', $variationsToDelete)->delete();

            // Clear service-level pricing and materials when using variations
            $service->pricingTypes()->sync([]);
            $service->materials()->sync([]);
        } else {
            // Delete all variations if switching to non-variations mode
            $service->getRelation('variations')->each(function ($variation) {
                $variation->delete();
            });

            // Sync pricing types with their prices
            $pricingTypes = collect($request->pricing_types)->mapWithKeys(function ($type) {
                return [$type['id'] => [
                    'price_from' => $type['price_from'],
                    'price_to' => $type['price_to'] ?? $type['price_from'],
                ]];
            })->all();
            
            $service->pricingTypes()->sync($pricingTypes);

            // Sync materials
            $service->materials()->sync($request->materials ?? []);
        }

        return redirect()->route('admin.services.index')
            ->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Service deleted successfully.');
    }
}