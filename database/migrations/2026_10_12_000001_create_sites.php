<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sites', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('short_description');
            $table->string('url')->unique();
            $table->json('description');
            $table->string('main_image');
            $table->string('icon')->nullable();
            $table->json('pictures')->nullable();
            $table->json('videos')->nullable();
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->string('city')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('google_maps_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('founded_by')->nullable();
            $table->unsignedSmallInteger('foundation_year')->nullable();
            $table->unsignedTinyInteger('foundation_month')->nullable();
            $table->boolean('is_unesco_certif')->default(false);
            $table->unsignedSmallInteger('unesco_certif_year')->nullable();
            $table->timestamps();
        });

        Schema::create('category_site', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->primary(['category_id', 'site_id']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->foreignId('site_id')->nullable()->after('organization_id')->constrained('sites')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('events', fn (Blueprint $table) => $table->dropConstrainedForeignId('site_id'));
        Schema::dropIfExists('category_site');
        Schema::dropIfExists('sites');
    }
};
