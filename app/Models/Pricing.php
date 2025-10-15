<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pricing extends Model
{
    protected $fillable = [
        'name',
        'description',
        'type',
        'flat_amount',
        'min_amount',
        'max_amount',
        'percentage_rate',
        'currency',
        'is_exclusive',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'flat_amount' => 'decimal:2',
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
        'percentage_rate' => 'decimal:2',
        'is_exclusive' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'service_pricing')
            ->withPivot('is_required', 'notes')
            ->withTimestamps();
    }

    public function getFormattedAmountAttribute()
    {
        switch ($this->type) {
            case 'flat':
                return $this->currency . ' ' . number_format($this->flat_amount, 2);
            case 'range':
                return $this->currency . ' ' . number_format($this->min_amount, 2) . ' - ' . number_format($this->max_amount, 2);
            case 'percentage':
                return $this->percentage_rate . '%';
            default:
                return 'N/A';
        }
    }

    public function getDisplayNameAttribute()
    {
        return $this->name . ' (' . $this->formatted_amount . ')';
    }
}
