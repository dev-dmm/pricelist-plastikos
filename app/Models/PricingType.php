<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PricingType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_range',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_range' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_pricing')
            ->withPivot('price_from', 'price_to')
            ->withTimestamps();
    }
}
