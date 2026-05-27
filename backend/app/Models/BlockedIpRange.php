<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockedIpRange extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_range',
        'reason',
    ];
}
