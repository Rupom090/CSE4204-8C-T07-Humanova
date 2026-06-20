<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\OrganizationInvitation;
use App\Models\Organization;

class OrganizationInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private OrganizationInvitation $invitation,
        private string $token,
        private Organization $organization
    ) {
        $this->queue = 'notifications';
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $acceptUrl = rtrim(config('app.frontend_url', config('app.url')), '/')
            . '/invitations/accept?token=' . $this->token;

        return (new MailMessage)
            ->subject('You have been invited to join ' . $this->organization->name)
            ->greeting('Hello!')
            ->line('You have been invited to join the organization "' . $this->organization->name . '" on Humanova.')
            ->action('Accept Invitation', $acceptUrl)
            ->line('This invitation will expire in 7 days.')
            ->line('If you do not wish to join this organization, you can safely ignore this email.')
            ->salutation('The Humanova Team');
    }
}
