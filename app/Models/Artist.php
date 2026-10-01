<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artist extends Model
{
    protected $fillable = ['name', 'url', 'profession', 'description', 'picture'];

    protected $casts = ['name' => 'array', 'description' => 'array'];

    public function culturalItems(): HasMany
    {
        return $this->hasMany(CulturalItem::class, 'author_id');
    }
}
