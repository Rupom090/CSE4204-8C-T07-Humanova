<?php

namespace App\Models;

use App\Enums\Severity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UncertaintyAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'scan_id',
        'keyword',
        'severity',
        'occurrence_count',
    ];

    protected $casts = [
        'severity' => Severity::class,
        'occurrence_count' => 'integer',
    ];

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class, 'scan_id');
    }
}
