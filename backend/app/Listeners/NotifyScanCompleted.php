<?php

namespace App\Listeners;

use App\Events\ScanCompleted;
use App\Notifications\ScanCompletedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyScanCompleted implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(ScanCompleted $event): void
    {
        $scan = $event->scan;
        $user = $scan->user;

        if ($user) {
            $user->notify(new ScanCompletedNotification($scan));
        }
    }
}
