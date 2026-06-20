<?php

namespace App\Events;

use App\Models\PdfExport;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExportReady
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $export;

    /**
     * Create a new event instance.
     */
    public function __construct(PdfExport $export)
    {
        $this->export = $export;
    }
}
