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
        Schema::create('pricings', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Doctor Fee", "Anesthesiologist Fee", "Clinic Fee"
            $table->text('description')->nullable();
            $table->enum('type', ['flat', 'range', 'percentage'])->default('flat');
            $table->decimal('flat_amount', 10, 2)->nullable(); // For flat fee
            $table->decimal('min_amount', 10, 2)->nullable(); // For range pricing
            $table->decimal('max_amount', 10, 2)->nullable(); // For range pricing
            $table->decimal('percentage_rate', 5, 2)->nullable(); // For percentage pricing
            $table->string('currency', 3)->default('EUR');
            $table->boolean('is_exclusive')->default(false); // Exclusive to specific service
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricings');
    }
};
