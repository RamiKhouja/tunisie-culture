<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->text('google_maps_url')->nullable()->after('longitude');
        });

        Schema::table('cultural_items', function (Blueprint $table) {
            $table->text('google_maps_url')->nullable()->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('events', fn (Blueprint $table) => $table->dropColumn('google_maps_url'));
        Schema::table('cultural_items', fn (Blueprint $table) => $table->dropColumn('google_maps_url'));
    }
};
