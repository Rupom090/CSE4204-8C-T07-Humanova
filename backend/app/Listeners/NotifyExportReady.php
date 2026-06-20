<?php

namespace App\Listeners;

use App\Events\ExportReady;
use App\Notifications\ExportReadyNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyExportReady implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(ExportReady $event): void
    {
        if ($event->export->user) {
            $event->export->user->notify(new ExportReadyNotification($event->export));
        }
    }
}
