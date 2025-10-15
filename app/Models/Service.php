<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'is_active',
        'sort_order',
        'parent_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function pricingTypes(): BelongsToMany
    {
        return $this->belongsToMany(PricingType::class, 'service_pricing')
            ->withPivot('price_from', 'price_to')
            ->withTimestamps();
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class, 'service_material')
            ->withTimestamps();
    }

    public function variations()
    {
        return $this->hasMany(ServiceVariation::class);
    }

    public function getTotalPriceAttribute(): array
    {
        $minTotal = 0;
        $maxTotal = 0;

        // Add up pricing types
        if ($this->pricingTypes) {
            foreach ($this->pricingTypes as $pricingType) {
                $minTotal += $pricingType->pivot->price_from ?? 0;
                $maxTotal += $pricingType->pivot->price_to ?? $pricingType->pivot->price_from ?? 0;
            }
        }

        // Add up materials
        if ($this->materials) {
            foreach ($this->materials as $material) {
                $minTotal += $material->price ?? 0;
                $maxTotal += $material->price ?? 0;
            }
        }

        return [
            'min' => $minTotal,
            'max' => $maxTotal,
        ];
    }
}