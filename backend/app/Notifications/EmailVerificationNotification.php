<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailVerificationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public string $verificationUrl;

    public function __construct(private readonly User $user)
    {
        $this->verificationUrl = $this->buildVerificationUrl();
        $this->queue = 'notifications';
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Verify Your Humanova Email Address')
            ->greeting('Hello, ' . $this->user->name . '!')
            ->line('Thank you for registering with Humanova — the AI Trust Governance Platform.')
            ->line('Please click the button below to verify your email address.')
            ->action('Verify Email Address', $this->verificationUrl)
            ->line('This verification link will expire in 60 minutes.')
            ->line('If you did not create an account, no further action is required.')
            ->salutation('The Humanova Team');
    }

    private function buildVerificationUrl(): string
    {
        $hash = sha1($this->user->email);
        $frontendUrl = config('app.frontend_url', config('app.url'));
        return rtrim($frontendUrl, '/') . "/email/verify/{$this->user->id}/{$hash}";
    }
}
