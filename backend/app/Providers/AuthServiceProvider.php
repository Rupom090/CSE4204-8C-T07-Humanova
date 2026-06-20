<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

use App\Models\Organization;
use App\Models\Scan;
use App\Models\HallucinationReport;
use App\Models\UserApiKey;
use App\Models\PdfExport;
use App\Models\AuditLog;

use App\Policies\OrganizationPolicy;
use App\Policies\ScanPolicy;
use App\Policies\HallucinationReportPolicy;
use App\Policies\UserApiKeyPolicy;
use App\Policies\PdfExportPolicy;
use App\Policies\AuditLogPolicy;
use App\Policies\AnalyticsPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Organization::class        => OrganizationPolicy::class,
        Scan::class                => ScanPolicy::class,
        HallucinationReport::class => HallucinationReportPolicy::class,
        UserApiKey::class          => UserApiKeyPolicy::class,
        PdfExport::class           => PdfExportPolicy::class,
        AuditLog::class            => AuditLogPolicy::class,
        // Virtual policy mapping for analytics
        'Analytics'                => AnalyticsPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Define Gates for non-model resources
        Gate::define('view-analytics', [AnalyticsPolicy::class, 'view']);
    }
}
