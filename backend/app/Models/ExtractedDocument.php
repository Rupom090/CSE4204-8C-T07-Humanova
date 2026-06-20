<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToOrganization;

class ExtractedDocument extends Model
{
    use BelongsToOrganization, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'user_id',
        'uploaded_file_id',
        'document_type',
        'extracted_text',
        'page_count',
        'word_count',
        'character_count',
        'language',
        'processing_status',
        'processing_error',
        'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function uploadedFile(): BelongsTo
    {
        return $this->belongsTo(UploadedFile::class);
    }

    public function isPending(): bool
    {
        return $this->processing_status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->processing_status === 'completed';
    }
}
