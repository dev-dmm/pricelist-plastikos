<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ServiceVariation extends Model
{
    protected $table = 'service_variations';
    
    protected $fillable = [
        'service_id',
        'name',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function pricingTypes(): BelongsToMany
    {
        return $this->belongsToMany(PricingType::class, 'service_variation_pricing')
            ->withPivot('price_from', 'price_to')
            ->withTimestamps();
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

        return [
            'min' => $minTotal,
            'max' => $maxTotal,
        ];
    }
}
