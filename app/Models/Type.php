<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Type extends Model
{
    protected $fillable = ['name', 'url', 'description', 'main_image', 'icon', 'category_id'];

    protected $casts = ['name' => 'array', 'description' => 'array'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function culturalItems(): BelongsToMany
    {
        return $this->belongsToMany(CulturalItem::class);
    }
}
