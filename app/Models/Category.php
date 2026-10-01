<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['color', 'name', 'url', 'description', 'main_image', 'icon', 'parent_id'];

    protected $casts = ['name' => 'array', 'description' => 'array'];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function types(): HasMany
    {
        return $this->hasMany(Type::class);
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class);
    }

    public function culturalItems(): BelongsToMany
    {
        return $this->belongsToMany(CulturalItem::class);
    }
}
