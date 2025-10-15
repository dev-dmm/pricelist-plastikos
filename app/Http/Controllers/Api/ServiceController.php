<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $services = Service::with(['category', 'pricingTypes', 'materials'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'category' => $service->category,
                    'pricingTypes' => $service->pricingTypes->map(function ($type) {
                        return [
                            'name' => $type->name,
                            'pivot' => $type->pivot
                        ];
                    }),
                    'materials' => $service->materials,
                    'total_price' => $service->total_price
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    public function byCategory(Request $request, $categoryId): JsonResponse
    {
        $services = Service::with(['category', 'pricingTypes', 'materials'])
            ->where('category_id', $categoryId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'category' => $service->category,
                    'pricingTypes' => $service->pricingTypes->map(function ($type) {
                        return [
                            'name' => $type->name,
                            'pivot' => $type->pivot
                        ];
                    }),
                    'materials' => $service->materials,
                    'total_price' => $service->total_price
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }
}
