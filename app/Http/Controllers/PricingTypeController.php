<?php

namespace App\Http\Controllers;

use App\Models\PricingType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PricingTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/PricingTypes/Index', [
            'pricingTypes' => PricingType::orderBy('sort_order')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/PricingTypes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:pricing_types,name',
            'description' => 'nullable|string',
            'is_range' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        PricingType::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'is_range' => $request->is_range ?? false,
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return redirect()->route('admin.pricing-types.index')
            ->with('success', 'Pricing type created successfully.');
    }

    public function edit(PricingType $pricingType)
    {
        return Inertia::render('Admin/PricingTypes/Edit', [
            'pricingType' => $pricingType
        ]);
    }

    public function update(Request $request, PricingType $pricingType)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:pricing_types,name,' . $pricingType->id,
            'description' => 'nullable|string',
            'is_range' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $pricingType->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'is_range' => $request->is_range ?? false,
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return redirect()->route('admin.pricing-types.index')
            ->with('success', 'Pricing type updated successfully.');
    }

    public function destroy(PricingType $pricingType)
    {
        $pricingType->delete();

        return redirect()->route('admin.pricing-types.index')
            ->with('success', 'Pricing type deleted successfully.');
    }
}
