<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('categories', 'color')) {
            Schema::table('categories', fn (Blueprint $table) => $table->string('color', 7)->default('#8f3527'));
        }
        if (! Schema::hasTable('organizations')) {
            Schema::create('organizations', function (Blueprint $table) {
                $table->id();
                $table->json('name');
                $table->string('logo')->nullable();
                $table->string('mf')->nullable();
                $table->mediumText('description');
                foreach (['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website'] as $link) {
                    $table->text($link)->nullable();
                }
                $table->string('email')->nullable();
                $table->string('phone');
                $table->boolean('show_phone')->default(false);
                $table->boolean('show_email')->default(false);
                $table->foreignId('state_id')->constrained('locations')->restrictOnDelete();
                $table->string('city');
                $table->string('address');
                $table->string('zip_code')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
        if (! Schema::hasTable('organization_user')) {
            Schema::create('organization_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('role');
                $table->boolean('show_user')->default(false);
                $table->unique(['organization_id', 'user_id']);
            });
        }
        if (! Schema::hasTable('events')) {
            Schema::create('events', function (Blueprint $table) {
                $table->id();
                $table->json('name');
                $table->string('main_image');
                $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
                $table->json('tags')->nullable();
                $table->boolean('is_free')->default(true);
                $table->decimal('price', 12, 2)->default(0);
                $table->text('payment_link')->nullable();
                $table->text('short_description');
                $table->mediumText('description');
                $table->decimal('latitude', 10, 7);
                $table->decimal('longitude', 10, 7);
                $table->foreignId('state_id')->constrained('locations')->restrictOnDelete();
                $table->string('city');
                $table->string('place_name');
                $table->json('pictures')->nullable();
                $table->json('videos')->nullable();
                foreach (['facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website', 'other_link'] as $link) {
                    $table->text($link)->nullable();
                }
                $table->timestamps();
            });
        }
        if (! Schema::hasTable('category_event')) {
            Schema::create('category_event', function (Blueprint $table) {
                $table->foreignId('category_id')->constrained()->cascadeOnDelete();
                $table->foreignId('event_id')->constrained()->cascadeOnDelete();
                $table->primary(['category_id', 'event_id']);
            });
        }
        if (! Schema::hasTable('event_dates')) {
            Schema::create('event_dates', function (Blueprint $table) {
                $table->id();
                $table->foreignId('event_id')->constrained()->cascadeOnDelete();
                $table->date('date');
                $table->time('start_at');
                $table->time('end_at');
                $table->index(['event_id', 'date']);
            });
        }
    }

    public function down(): void
    {
        foreach (['event_dates', 'category_event', 'events', 'organization_user', 'organizations'] as $table) {
            Schema::dropIfExists($table);
        }
        Schema::table('categories', fn (Blueprint $table) => $table->dropColumn('color'));
    }
};
