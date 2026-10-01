<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    protected $fillable = ['name', 'logo', 'mf', 'description', 'facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'website', 'email', 'phone', 'show_phone', 'show_email', 'state_id', 'city', 'address', 'zip_code', 'is_active'];

    protected $casts = ['name' => 'array', 'show_phone' => 'boolean', 'show_email' => 'boolean', 'is_active' => 'boolean'];

    public function state(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'state_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('role', 'show_user');
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }
}
