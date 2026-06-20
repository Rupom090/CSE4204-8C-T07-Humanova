<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Public routes (no auth)
    Route::post('/auth/register', [\App\Http\Controllers\Api\V1\AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/auth/login', [\App\Http\Controllers\Api\V1\AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/auth/forgot-password', [\App\Http\Controllers\Api\V1\AuthController::class, 'forgotPassword'])->middleware('throttle:3,1');
    Route::post('/auth/reset-password', [\App\Http\Controllers\Api\V1\AuthController::class, 'resetPassword']);
    Route::get('/auth/email/verify/{id}/{hash}', [\App\Http\Controllers\Api\V1\AuthController::class, 'verifyEmail'])->name('verification.verify');
    
    // OAuth
    Route::get('/auth/oauth/{provider}', [\App\Http\Controllers\Api\V1\OAuthController::class, 'redirect']);
    Route::get('/auth/oauth/{provider}/callback', [\App\Http\Controllers\Api\V1\OAuthController::class, 'callback']);

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        
        Route::post('/auth/logout', [\App\Http\Controllers\Api\V1\AuthController::class, 'logout']);
        Route::post('/auth/email/resend', [\App\Http\Controllers\Api\V1\AuthController::class, 'resendVerification'])->middleware('throttle:3,1');
        Route::get('/auth/me', [\App\Http\Controllers\Api\V1\AuthController::class, 'me']);

        // Organizations
        Route::apiResource('organizations', \App\Http\Controllers\Api\V1\OrganizationController::class);
        Route::post('/organizations/{organization}/invite', [\App\Http\Controllers\Api\V1\OrganizationController::class, 'invite']);
        Route::get('/organizations/{organization}/members', [\App\Http\Controllers\Api\V1\OrganizationController::class, 'members']);
        Route::delete('/organizations/{organization}/members/{user}', [\App\Http\Controllers\Api\V1\OrganizationController::class, 'removeMember']);
        Route::post('/invitations/accept', [\App\Http\Controllers\Api\V1\InvitationController::class, 'accept']);

        // RBAC
        Route::get('/roles', [\App\Http\Controllers\Api\V1\RoleController::class, 'index']);
        Route::get('/roles/{role}', [\App\Http\Controllers\Api\V1\RoleController::class, 'show']);
        Route::get('/permissions', [\App\Http\Controllers\Api\V1\PermissionController::class, 'index']);
        Route::post('/users/{user}/assign-role', [\App\Http\Controllers\Api\V1\RoleController::class, 'assignToUser']);
        Route::delete('/users/{user}/remove-role', [\App\Http\Controllers\Api\V1\RoleController::class, 'removeFromUser']);

        // AI Providers & API Keys
        Route::get('/providers', [\App\Http\Controllers\Api\V1\ProviderController::class, 'index']);
        Route::get('/providers/{provider}/models', [\App\Http\Controllers\Api\V1\ProviderController::class, 'models']);
        Route::apiResource('provider-keys', \App\Http\Controllers\Api\V1\ApiKeyController::class)
            ->except(['show'])
            ->parameters(['provider-keys' => 'apiKey']);

        // Prompts
        Route::apiResource('prompts', \App\Http\Controllers\Api\V1\PromptController::class);
        Route::post('/prompts/{prompt}/enhance', [\App\Http\Controllers\Api\V1\PromptController::class, 'enhance']);
        Route::get('/prompts/{prompt}/history', [\App\Http\Controllers\Api\V1\PromptController::class, 'history']);

        // Generation
        Route::middleware('throttle:20,1')->group(function() {
            Route::post('/generate', [\App\Http\Controllers\Api\V1\GenerationController::class, 'generate']);
            Route::post('/generate/compare', [\App\Http\Controllers\Api\V1\GenerationController::class, 'compare']);
        });
        Route::get('/generations', [\App\Http\Controllers\Api\V1\GenerationController::class, 'index']);
        Route::get('/generations/{generation}', [\App\Http\Controllers\Api\V1\GenerationController::class, 'show']);

        // Scans
        Route::post('/scans', [\App\Http\Controllers\Api\V1\ScanController::class, 'store'])->middleware('throttle:30,1');
        Route::get('/scans', [\App\Http\Controllers\Api\V1\ScanController::class, 'index']);
        Route::get('/scans/{scan}', [\App\Http\Controllers\Api\V1\ScanController::class, 'show']);
        Route::get('/scans/{scan}/claims', [\App\Http\Controllers\Api\V1\ScanController::class, 'claims']);
        Route::get('/scans/{scan}/evidence', [\App\Http\Controllers\Api\V1\ScanController::class, 'evidence']);
        Route::get('/scans/{scan}/confidence', [\App\Http\Controllers\Api\V1\ScanController::class, 'confidence']);

        // Verification
        Route::post('/verification/external', [\App\Http\Controllers\Api\V1\VerificationController::class, 'verifyExternal'])->middleware('throttle:30,1');
        Route::post('/verification/citations', [\App\Http\Controllers\Api\V1\VerificationController::class, 'verifyCitations'])->middleware('throttle:20,1');
        Route::post('/verification/links', [\App\Http\Controllers\Api\V1\VerificationController::class, 'checkLinks'])->middleware('throttle:20,1');
        Route::get('/scans/{scan}/links', [\App\Http\Controllers\Api\V1\VerificationController::class, 'getLinks']);

        // Community / Reports
        Route::get('/reports', [\App\Http\Controllers\Api\V1\CommunityController::class, 'listReports']);
        Route::post('/reports', [\App\Http\Controllers\Api\V1\CommunityController::class, 'submitReport']);
        Route::get('/reports/{report}', [\App\Http\Controllers\Api\V1\CommunityController::class, 'showReport']);
        Route::post('/reports/{report}/vote', [\App\Http\Controllers\Api\V1\CommunityController::class, 'vote']);
        Route::post('/reports/{report}/evidence', [\App\Http\Controllers\Api\V1\CommunityController::class, 'uploadEvidence']);

        // Moderation
        Route::middleware('role:moderator,org_admin,super_admin')->prefix('moderation')->group(function () {
            Route::get('/reports', [\App\Http\Controllers\Api\V1\ModerationController::class, 'queue']);
            Route::post('/reports/{report}/approve', [\App\Http\Controllers\Api\V1\ModerationController::class, 'approve']);
            Route::post('/reports/{report}/reject', [\App\Http\Controllers\Api\V1\ModerationController::class, 'reject']);
            Route::post('/reports/{report}/assign', [\App\Http\Controllers\Api\V1\ModerationController::class, 'assign']);
            Route::get('/verifiers', [\App\Http\Controllers\Api\V1\ModerationController::class, 'listVerifiers']);
        });

        // Analytics
        Route::prefix('analytics')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\Api\V1\AnalyticsController::class, 'dashboard']);
            Route::get('/providers', [\App\Http\Controllers\Api\V1\AnalyticsController::class, 'providers']);
            Route::get('/tokens', [\App\Http\Controllers\Api\V1\AnalyticsController::class, 'tokens']);
            Route::get('/hallucinations', [\App\Http\Controllers\Api\V1\AnalyticsController::class, 'hallucinations']);
            Route::get('/moderation', [\App\Http\Controllers\Api\V1\AnalyticsController::class, 'moderation']);
        });

        // Exports
        Route::post('/exports/pdf', [\App\Http\Controllers\Api\V1\ExportController::class, 'generatePdf'])->middleware('throttle:10,1');
        Route::get('/exports/history', [\App\Http\Controllers\Api\V1\ExportController::class, 'history']);
        
        // Notifications
        Route::get('/notifications', [\App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
        Route::post('/notifications/{notification}/read', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markRead']);
        Route::post('/notifications/read-all', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAllRead']);

        // Audit
        Route::prefix('audit')->group(function () {
            Route::get('/logs', [\App\Http\Controllers\Api\V1\AuditController::class, 'logs']);
            Route::get('/security', [\App\Http\Controllers\Api\V1\AuditController::class, 'securityEvents']);
        });

        // Settings
        Route::get('/settings/profile', [\App\Http\Controllers\Api\V1\SettingsController::class, 'profile']);
        Route::put('/settings/profile', [\App\Http\Controllers\Api\V1\SettingsController::class, 'updateProfile']);
        Route::put('/settings/password', [\App\Http\Controllers\Api\V1\SettingsController::class, 'updatePassword']);

        // File Uploads
        Route::post('/uploads', [\App\Http\Controllers\Api\V1\UploadController::class, 'store']);
        Route::delete('/uploads/{file}', [\App\Http\Controllers\Api\V1\UploadController::class, 'destroy']);
    });
});

// We need an unauthenticated route for downloading the signed url for exports
Route::get('/exports/{export}/download', [\App\Http\Controllers\Api\V1\ExportController::class, 'download'])
    ->name('exports.download')
    ->middleware('signed');
