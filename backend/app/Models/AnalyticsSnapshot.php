<?php

namespace App\Models;

use App\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalyticsSnapshot extends Model
{
    use HasFactory, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'metric_type',
        'metric_data',
        'period_start',
        'period_end',
    ];

    protected $casts = [
        'metric_data' => 'json',
        'period_start' => 'datetime',
        'period_end' => 'datetime',
    ];
}
