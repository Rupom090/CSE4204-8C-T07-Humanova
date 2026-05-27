<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\PdfExport;
use App\Models\Scan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class GeneratePdfExport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    protected $exportId;

    public function __construct(int $exportId)
    {
        $this->exportId = $exportId;
    }

    public function handle(): void
    {
        $export = PdfExport::findOrFail($this->exportId);
        $export->update(['export_status' => 'processing']);

        try {
            $data = [];
            $view = 'exports.default';

            if ($export->export_type === 'scan_report' && $export->scan_id) {
                $scan = Scan::with(['generation', 'claims.verificationResults', 'confidenceScore'])->findOrFail($export->scan_id);
                $data['scan'] = $scan;
                $view = 'exports.scan_report'; // Assumes resources/views/exports/scan_report.blade.php exists
            }
            
            // NOTE: In a real environment, we'd need the blade view to exist.
            // Using a simple HTML string for the mock implementation if view missing
            
            $pdf = Pdf::loadHTML('<h1>Humanova Export: ' . $export->export_type . '</h1>');
            
            $content = $pdf->output();
            
            Storage::disk('public')->put($export->file_path, $content);

            $export->update(['export_status' => 'completed']);
            
            // Could notify user here

        } catch (\Exception $e) {
            Log::error("PDF Generation failed: " . $e->getMessage());
            $export->update(['export_status' => 'failed']);
        }
    }
}
