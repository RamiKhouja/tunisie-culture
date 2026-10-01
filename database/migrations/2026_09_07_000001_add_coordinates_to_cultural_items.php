<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cultural_items', function (Blueprint $table) {
            $table->decimal('latitude', 9, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            // Preserve legacy image positions; they cannot be converted accurately.
            $table->decimal('x_position', 7, 4)->nullable()->change();
            $table->decimal('y_position', 7, 4)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('cultural_items', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
