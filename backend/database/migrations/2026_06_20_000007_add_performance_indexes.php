<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Performance indexes for high-query tables
        Schema::table('scans', function (Blueprint $table) {
            $table->index(['organization_id', 'created_at'], 'scans_org_created_idx');
            $table->index('scan_status', 'scans_status_idx');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->index(['organization_id', 'created_at'], 'audit_org_created_idx');
            $table->index(['organization_id', 'action_type'], 'audit_org_action_idx');
        });

        Schema::table('ai_generations', function (Blueprint $table) {
            $table->index(['organization_id', 'created_at'], 'gen_org_created_idx');
        });

        Schema::table('provider_usage_logs', function (Blueprint $table) {
            $table->index(['organization_id', 'created_at'], 'pul_org_created_idx');
            $table->index(['provider_id', 'created_at'], 'pul_provider_created_idx');
        });

        Schema::table('hallucination_reports', function (Blueprint $table) {
            $table->index('moderation_status', 'hr_moderation_status_idx');
            $table->index(['organization_id', 'moderation_status'], 'hr_org_status_idx');
        });

        Schema::table('security_events', function (Blueprint $table) {
            $table->index('organization_id', 'se_org_idx');
            $table->index(['organization_id', 'created_at'], 'se_org_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('scans', function (Blueprint $table) {
            $table->dropIndex('scans_org_created_idx');
            $table->dropIndex('scans_status_idx');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex('audit_org_created_idx');
            $table->dropIndex('audit_org_action_idx');
        });

        Schema::table('ai_generations', function (Blueprint $table) {
            $table->dropIndex('gen_org_created_idx');
        });

        Schema::table('provider_usage_logs', function (Blueprint $table) {
            $table->dropIndex('pul_org_created_idx');
            $table->dropIndex('pul_provider_created_idx');
        });

        Schema::table('hallucination_reports', function (Blueprint $table) {
            $table->dropIndex('hr_moderation_status_idx');
            $table->dropIndex('hr_org_status_idx');
        });

        Schema::table('security_events', function (Blueprint $table) {
            $table->dropIndex('se_org_idx');
            $table->dropIndex('se_org_created_idx');
        });
    }
};
