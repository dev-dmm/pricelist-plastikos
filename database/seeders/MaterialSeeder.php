<?php

namespace Database\Seeders;

use App\Models\Material;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MaterialSeeder extends Seeder
{
    public function run(): void
    {
        $materials = [
            ['name' => 'Στρογγυλά', 'price' => 800],
            ['name' => 'Ανατομικά', 'price' => 1200],
        ];

        foreach ($materials as $material) {
            Material::create([
                'name' => $material['name'],
                'slug' => Str::slug($material['name']),
                'price' => $material['price'],
                'is_active' => true,
                'sort_order' => 0,
            ]);
        }
    }
}