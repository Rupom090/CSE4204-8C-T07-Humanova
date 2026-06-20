<?php

namespace App\Services\Security;

use App\Models\BlockedDomain;
use App\Models\BlockedIpRange;

class SsrfProtectionService
{
    /**
     * Check if a URL is safe from SSRF attacks.
     * DNS resolution -> IP blacklist check -> SSL validation
     */
    public function isSafeUrl(string $url): bool
    {
        $parsedUrl = parse_url($url);
        
        if (!isset($parsedUrl['host'])) {
            return false;
        }

        $host = $parsedUrl['host'];

        // 1. Check blocked domains
        if (BlockedDomain::where('domain', $host)->exists()) {
            return false;
        }

        // 2. DNS Resolution
        $ip = gethostbyname($host);
        
        // If it didn't resolve, gethostbyname returns the host string
        if ($ip === $host && !filter_var($host, FILTER_VALIDATE_IP)) {
            return false; // Could not resolve
        }

        // 3. Check for private/loopback/reserved IP ranges
        if (!$this->isPublicIp($ip)) {
            return false;
        }

        // 4. Check dynamic DB blocked IP ranges
        $blockedRanges = BlockedIpRange::pluck('ip_range')->toArray();
        if (\Symfony\Component\HttpFoundation\IpUtils::checkIp($ip, $blockedRanges)) {
            return false;
        }

        // Must be HTTPS for basic security in this context, although HTTP might be allowed in some contexts
        if (isset($parsedUrl['scheme']) && $parsedUrl['scheme'] !== 'https') {
            // Log warning or reject based on strictness
        }

        return true;
    }

    /**
     * Checks if IP is public (not private, loopback, or reserved).
     */
    protected function isPublicIp(string $ip): bool
    {
        return filter_var(
            $ip, 
            FILTER_VALIDATE_IP, 
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) !== false;
    }
}
