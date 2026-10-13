<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crafts', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('short_description');
            $table->string('url')->unique();
            $table->json('description');
            $table->string('main_image');
            $table->string('icon')->nullable();
            $table->json('pictures')->nullable();
            $table->json('products')->nullable();
            $table->json('videos')->nullable();
            $table->decimal('x_position', 7, 4)->nullable();
            $table->decimal('y_position', 7, 4)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('google_maps_url')->nullable();
            $table->string('owner');
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->string('city')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('category_craft', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('craft_id')->constrained()->cascadeOnDelete();
            $table->primary(['category_id', 'craft_id']);
        });

        Schema::create('craft_type', function (Blueprint $table) {
            $table->foreignId('craft_id')->constrained()->cascadeOnDelete();
            $table->foreignId('type_id')->constrained()->cascadeOnDelete();
            $table->primary(['craft_id', 'type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('craft_type');
        Schema::dropIfExists('category_craft');
        Schema::dropIfExists('crafts');
    }
};
