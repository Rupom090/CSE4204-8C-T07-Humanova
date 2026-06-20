<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToOrganization;

class UsageStatistic extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'metric_key',
        'metric_value',
        'period_type',
        'period_start',
        'period_end',
    ];

    protected $casts = [
        'metric_value' => 'array',
        'period_start' => 'datetime',
        'period_end'   => 'datetime',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
