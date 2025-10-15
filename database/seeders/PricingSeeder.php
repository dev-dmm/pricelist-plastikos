<?php

namespace Database\Seeders;

use App\Models\Pricing;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PricingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // General pricing options (can be used across multiple services)
        $generalPricings = [
            [
                'name' => 'Αμοιβή Ιατρού',
                'description' => 'Βασική αμοιβή για τον χειρουργό',
                'type' => 'range',
                'min_amount' => 1000,
                'max_amount' => 3000,
                'currency' => 'EUR',
                'is_exclusive' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Αναισθησιολόγος',
                'description' => 'Αμοιβή αναισθησιολόγου',
                'type' => 'flat',
                'flat_amount' => 500,
                'currency' => 'EUR',
                'is_exclusive' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Βοηθός Χειρουργού',
                'description' => 'Αμοιβή βοηθού χειρουργού',
                'type' => 'flat',
                'flat_amount' => 300,
                'currency' => 'EUR',
                'is_exclusive' => false,
                'sort_order' => 3,
            ],
            [
                'name' => 'Κλινική 1',
                'description' => 'Χρήση κλινικής 1',
                'type' => 'flat',
                'flat_amount' => 800,
                'currency' => 'EUR',
                'is_exclusive' => false,
                'sort_order' => 4,
            ],
            [
                'name' => 'Κλινική 2',
                'description' => 'Χρήση κλινικής 2',
                'type' => 'flat',
                'flat_amount' => 600,
                'currency' => 'EUR',
                'is_exclusive' => false,
                'sort_order' => 5,
            ],
            [
                'name' => 'Κλινική 3',
                'description' => 'Χρήση κλινικής 3',
                'type' => 'flat',
                'flat_amount' => 400,
                'currency' => 'EUR',
                'is_exclusive' => false,
                'sort_order' => 6,
            ],
        ];

        // Exclusive pricing options (specific to certain services)
        $exclusivePricings = [
            [
                'name' => 'Ρινοπλαστική - Ειδική Αμοιβή',
                'description' => 'Ειδική αμοιβή για ρινοπλαστική',
                'type' => 'range',
                'min_amount' => 2000,
                'max_amount' => 4000,
                'currency' => 'EUR',
                'is_exclusive' => true,
                'sort_order' => 10,
            ],
            [
                'name' => 'Μαστοπλαστική - Ειδική Αμοιβή',
                'description' => 'Ειδική αμοιβή για μαστοπλαστική',
                'type' => 'range',
                'min_amount' => 2500,
                'max_amount' => 5000,
                'currency' => 'EUR',
                'is_exclusive' => true,
                'sort_order' => 11,
            ],
        ];

        // Create general pricings
        foreach ($generalPricings as $pricingData) {
            Pricing::create($pricingData);
        }

        // Create exclusive pricings
        foreach ($exclusivePricings as $pricingData) {
            Pricing::create($pricingData);
        }
    }
}
