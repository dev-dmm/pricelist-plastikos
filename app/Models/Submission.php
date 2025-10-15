<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'notes',
        'category',
        'procedure',
        'pricing_details',
        'total_price',
        'status',
        'email_sent_at',
        'email_scheduled_for'
    ];

    protected $casts = [
        'pricing_details' => 'array',
        'total_price' => 'array',
        'email_sent_at' => 'datetime',
        'email_scheduled_for' => 'datetime'
    ];

    /**
     * Boot method to set random email schedule on creation
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($submission) {
            if ($submission->email && !$submission->email_scheduled_for) {
                // Random time between 1-2 hours from now
                $randomMinutes = rand(60, 120); // 60-120 minutes = 1-2 hours
                $submission->email_scheduled_for = now()->addMinutes($randomMinutes);
            }
        });
    }
}