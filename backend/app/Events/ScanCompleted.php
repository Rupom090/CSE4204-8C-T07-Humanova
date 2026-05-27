<?php

namespace App\Events;

use App\Models\Scan;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScanCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Scan $scan;

    public function __construct(Scan $scan)
    {
        $this->scan = $scan;
    }
}
