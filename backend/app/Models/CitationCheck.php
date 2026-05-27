<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CitationCheck extends Model
{
    use HasFactory;

    protected $fillable = [
        'scan_id',
        'citation_text',
        'doi',
        'validity_status',
        'metadata_score',
    ];

    protected $casts = [
        'metadata_score' => 'decimal:2',
    ];

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class, 'scan_id');
    }
}
