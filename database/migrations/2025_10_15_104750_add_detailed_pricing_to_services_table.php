<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Detailed pricing components
            $table->json('doctor_fee')->nullable(); // {type: 'flat'|'range', value: number, min?: number, max?: number, description?: string}
            $table->json('assistant_fee')->nullable();
            $table->json('anesthesiologist_fee')->nullable();
            $table->json('clinic_1_fee')->nullable();
            $table->json('clinic_2_fee')->nullable();
            $table->json('clinic_3_fee')->nullable();
            $table->json('materials')->nullable(); // Array of material objects with name and price
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'doctor_fee',
                'assistant_fee', 
                'anesthesiologist_fee',
                'clinic_1_fee',
                'clinic_2_fee',
                'clinic_3_fee',
                'materials'
            ]);
        });
    }
};
