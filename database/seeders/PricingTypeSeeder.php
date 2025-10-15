<?php

namespace Database\Seeders;

use App\Models\PricingType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PricingTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Αμοιβή Ιατρού (€)', 'is_range' => true],
            ['name' => 'Βοηθός (€)', 'is_range' => false],
            ['name' => 'Αναισθησιολόγος (€)', 'is_range' => false],
            ['name' => 'Κλινική 1 (€)', 'is_range' => false],
            ['name' => 'Κλινική 2 (€)', 'is_range' => false],
            ['name' => 'Κλινική 3 (€)', 'is_range' => false],
            ['name' => 'Υλικά (€)', 'is_range' => false],
        ];

        foreach ($types as $type) {
            PricingType::create([
                'name' => $type['name'],
                'slug' => Str::slug($type['name']),
                'is_range' => $type['is_range'],
                'is_active' => true,
                'sort_order' => 0,
            ]);
        }
    }
}