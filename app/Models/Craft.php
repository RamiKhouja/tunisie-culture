<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Craft extends Model
{
    protected $fillable = ['name', 'short_description', 'url', 'description', 'main_image', 'icon', 'pictures', 'products', 'videos', 'x_position', 'y_position', 'latitude', 'longitude', 'google_maps_url', 'owner', 'location_id', 'city', 'is_active'];

    protected $casts = ['name' => 'array', 'short_description' => 'array', 'description' => 'array', 'pictures' => 'array', 'products' => 'array', 'videos' => 'array', 'is_active' => 'boolean', 'latitude' => 'float', 'longitude' => 'float', 'x_position' => 'float', 'y_position' => 'float'];

    public function categories(): BelongsToMany { return $this->belongsToMany(Category::class); }
    public function types(): BelongsToMany { return $this->belongsToMany(Type::class); }
    public function location(): BelongsTo { return $this->belongsTo(Location::class); }
}
