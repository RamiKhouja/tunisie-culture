<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('crafts', 'products')) {
            Schema::table('crafts', function (Blueprint $table) {
                $table->json('products')->nullable()->after('pictures');
            });
        }
    }

    public function down(): void
    {
        Schema::table('crafts', function (Blueprint $table) {
            $table->dropColumn('products');
        });
    }
};
