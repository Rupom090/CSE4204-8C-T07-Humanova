<?php

namespace App\Enums;

enum UserRole: string
{
    case Guest = 'guest';
    case User = 'user';
    case Researcher = 'researcher';
    case TrustedVerifier = 'trusted_verifier';
    case Moderator = 'moderator';
    case OrgAdmin = 'org_admin';
    case SuperAdmin = 'super_admin';

    public function label(): string
    {
        return match ($this) {
            self::Guest => 'Guest',
            self::User => 'User',
            self::Researcher => 'Researcher',
            self::TrustedVerifier => 'Trusted Verifier',
            self::Moderator => 'Moderator',
            self::OrgAdmin => 'Organization Admin',
            self::SuperAdmin => 'Super Admin',
        };
    }

    public function level(): int
    {
        return match ($this) {
            self::Guest => 0,
            self::User => 1,
            self::Researcher => 2,
            self::TrustedVerifier => 3,
            self::Moderator => 4,
            self::OrgAdmin => 5,
            self::SuperAdmin => 6,
        };
    }

    public function isAtLeast(self $role): bool
    {
        return $this->level() >= $role->level();
    }
}
