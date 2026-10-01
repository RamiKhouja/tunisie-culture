<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = ['name', 'code', 'cities'];

    protected $casts = ['name' => 'array', 'cities' => 'array'];

    public function culturalItems(): HasMany
    {
        return $this->hasMany(CulturalItem::class);
    }
}
