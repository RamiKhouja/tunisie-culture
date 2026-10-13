<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Site extends Model
{
    protected $fillable = ['name', 'short_description', 'url', 'description', 'main_image', 'icon', 'pictures', 'videos', 'location_id', 'city', 'latitude', 'longitude', 'google_maps_url', 'is_active', 'founded_by', 'foundation_year', 'foundation_month', 'is_unesco_certif', 'unesco_certif_year'];

    protected $casts = ['name' => 'array', 'short_description' => 'array', 'description' => 'array', 'pictures' => 'array', 'videos' => 'array', 'is_active' => 'boolean', 'is_unesco_certif' => 'boolean', 'latitude' => 'float', 'longitude' => 'float', 'foundation_year' => 'integer', 'foundation_month' => 'integer', 'unesco_certif_year' => 'integer'];

    public function categories(): BelongsToMany { return $this->belongsToMany(Category::class); }
    public function events(): HasMany { return $this->hasMany(Event::class); }
    public function location(): BelongsTo { return $this->belongsTo(Location::class); }
}
