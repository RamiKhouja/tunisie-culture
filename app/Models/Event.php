<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = ['name', 'main_image', 'organization_id', 'tags', 'is_free', 'price', 'payment_link', 'short_description', 'description', 'latitude', 'longitude', 'google_maps_url', 'state_id', 'city', 'place_name', 'pictures', 'videos', 'facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website', 'other_link'];

    protected $casts = ['name' => 'array', 'short_description' => 'array', 'description' => 'array', 'tags' => 'array', 'pictures' => 'array', 'videos' => 'array', 'is_free' => 'boolean', 'price' => 'float', 'latitude' => 'float', 'longitude' => 'float'];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'state_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)->orderBy('categories.id');
    }

    public function eventDates(): HasMany
    {
        return $this->hasMany(EventDate::class)->orderBy('date')->orderBy('start_at');
    }

    public function isCurrentOrUpcoming(): bool
    {
        $today = now('Africa/Tunis')->startOfDay();

        return $this->eventDates->contains(function ($slot) use ($today) {
            $end = $slot->date->copy();
            // An earlier end time represents an overnight event ending the next day.
            if ($slot->end_at < $slot->start_at) {
                $end->addDay();
            }

            return $end->greaterThanOrEqualTo($today);
        });
    }
}
