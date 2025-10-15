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
        Schema::create('service_pricing', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->foreignId('pricing_id')->constrained()->onDelete('cascade');
            $table->boolean('is_required')->default(false); // Whether this pricing is required for this service
            $table->text('notes')->nullable(); // Service-specific notes for this pricing
            $table->timestamps();
            
            $table->unique(['service_id', 'pricing_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_pricing');
    }
};
