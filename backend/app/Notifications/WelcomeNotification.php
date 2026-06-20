<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        $this->queue = 'notifications';
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $dashboardUrl = rtrim(config('app.frontend_url', config('app.url')), '/') . '/dashboard';

        return (new MailMessage)
            ->subject('Welcome to Humanova — AI Trust Governance Platform')
            ->greeting('Welcome, ' . $notifiable->name . '!')
            ->line('Your Humanova account has been created successfully.')
            ->line('Humanova helps you detect AI hallucinations, verify citations, optimize prompts, and build trust in AI-generated content.')
            ->action('Go to Dashboard', $dashboardUrl)
            ->line('Get started by enhancing your first prompt or running a hallucination scan.')
            ->salutation('The Humanova Team');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'welcome',
            'title'   => 'Welcome to Humanova!',
            'message' => 'Your account has been created. Start by verifying your email.',
        ];
    }
}
