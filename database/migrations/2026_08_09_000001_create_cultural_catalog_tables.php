<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->string('url')->unique();
            $table->json('description')->nullable();
            $table->string('main_image')->nullable();
            $table->string('icon')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('types', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->string('url')->unique();
            $table->json('description')->nullable();
            $table->string('main_image')->nullable();
            $table->string('icon')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('artists', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->string('url')->unique();
            $table->string('profession')->nullable();
            $table->json('description')->nullable();
            $table->string('picture')->nullable();
            $table->timestamps();
        });

        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->string('code')->nullable()->unique();
            $table->json('cities')->nullable();
            $table->timestamps();
        });

        Schema::create('cultural_items', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('short_description');
            $table->string('url')->unique();
            $table->json('description');
            $table->string('main_image');
            $table->string('icon')->nullable();
            $table->json('pictures')->nullable();
            $table->json('videos')->nullable();
            $table->json('audio')->nullable();
            $table->decimal('x_position', 7, 4);
            $table->decimal('y_position', 7, 4);
            $table->foreignId('author_id')->nullable()->constrained('artists')->nullOnDelete();
            $table->json('people')->nullable();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->string('city')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('release')->nullable();
            $table->enum('importance', ['high', 'medium', 'low'])->default('medium');
            $table->timestamps();
        });

        Schema::create('category_cultural_item', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('cultural_item_id')->constrained()->cascadeOnDelete();
            $table->primary(['category_id', 'cultural_item_id']);
        });

        Schema::create('cultural_item_type', function (Blueprint $table) {
            $table->foreignId('cultural_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('type_id')->constrained()->cascadeOnDelete();
            $table->primary(['cultural_item_id', 'type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cultural_item_type');
        Schema::dropIfExists('category_cultural_item');
        Schema::dropIfExists('cultural_items');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('artists');
        Schema::dropIfExists('types');
        Schema::dropIfExists('categories');
    }
};
