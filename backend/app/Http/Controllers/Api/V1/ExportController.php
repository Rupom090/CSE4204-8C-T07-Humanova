<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PdfExport;
use App\Jobs\GeneratePdfExport;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ExportController extends Controller
{
    use ApiResponse;

    public function generatePdf(Request $request): JsonResponse
    {
        $this->authorize('create', PdfExport::class);

        $validated = $request->validate([
            'export_type' => 'required|string|in:scan_report,analytics_summary,moderation_report,org_report',
            'scan_id' => 'nullable|exists:scans,id',
        ]);

        $export = PdfExport::create([
            'organization_id' => $request->user()->current_organization_id,
            'user_id' => $request->user()->id,
            'export_type' => $validated['export_type'],
            'scan_id' => $validated['scan_id'] ?? null,
            'file_path' => 'exports/' . Str::uuid() . '.pdf',
            'export_status' => 'queued',
        ]);

        GeneratePdfExport::dispatch($export->id)->onQueue('exports');

        return $this->created($export, 'PDF export queued successfully');
    }

    public function download(Request $request, PdfExport $export): JsonResponse
    {
        $this->authorize('view', $export);

        if ($export->export_status !== 'completed') {
            return $this->error('Export is not ready yet', 400);
        }

        $url = url('/storage/' . $export->file_path);

        return $this->success(['url' => $url], 'Download URL generated');
    }

    public function history(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PdfExport::class);

        $history = PdfExport::where('organization_id', $request->user()->current_organization_id)
            ->latest()
            ->paginate(15);
            
        return $this->paginated($history, 'Export history retrieved');
    }
}
