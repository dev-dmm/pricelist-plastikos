<?php

namespace App\Http\Controllers;

use App\Models\Pricing;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PricingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $pricings = Pricing::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pricings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:flat,range,percentage',
            'flat_amount' => 'required_if:type,flat|nullable|numeric|min:0',
            'min_amount' => 'required_if:type,range|nullable|numeric|min:0',
            'max_amount' => 'required_if:type,range|nullable|numeric|min:0|gte:min_amount',
            'percentage_rate' => 'required_if:type,percentage|nullable|numeric|min:0|max:100',
            'currency' => 'string|max:3',
            'is_exclusive' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $pricing = Pricing::create([
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'flat_amount' => $request->flat_amount,
            'min_amount' => $request->min_amount,
            'max_amount' => $request->max_amount,
            'percentage_rate' => $request->percentage_rate,
            'currency' => $request->currency ?? 'EUR',
            'is_exclusive' => $request->is_exclusive ?? false,
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pricing created successfully',
            'data' => $pricing
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $pricing = Pricing::with('services')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $pricing
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $pricing = Pricing::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:flat,range,percentage',
            'flat_amount' => 'required_if:type,flat|nullable|numeric|min:0',
            'min_amount' => 'required_if:type,range|nullable|numeric|min:0',
            'max_amount' => 'required_if:type,range|nullable|numeric|min:0|gte:min_amount',
            'percentage_rate' => 'required_if:type,percentage|nullable|numeric|min:0|max:100',
            'currency' => 'string|max:3',
            'is_exclusive' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $pricing->update([
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'flat_amount' => $request->flat_amount,
            'min_amount' => $request->min_amount,
            'max_amount' => $request->max_amount,
            'percentage_rate' => $request->percentage_rate,
            'currency' => $request->currency ?? $pricing->currency,
            'is_exclusive' => $request->is_exclusive ?? $pricing->is_exclusive,
            'is_active' => $request->is_active ?? $pricing->is_active,
            'sort_order' => $request->sort_order ?? $pricing->sort_order,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pricing updated successfully',
            'data' => $pricing
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $pricing = Pricing::findOrFail($id);
        $pricing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pricing deleted successfully'
        ]);
    }

    /**
     * Get general (non-exclusive) pricings
     */
    public function general(): JsonResponse
    {
        $pricings = Pricing::where('is_active', true)
            ->where('is_exclusive', false)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pricings
        ]);
    }
}
