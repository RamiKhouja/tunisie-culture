<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventDate extends Model
{
    public $timestamps = false;

    protected $fillable = ['date', 'start_at', 'end_at'];

    protected $casts = ['date' => 'date:Y-m-d'];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
