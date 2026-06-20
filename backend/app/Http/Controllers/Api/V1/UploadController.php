<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    use ApiResponse;

    /**
     * Store an uploaded file.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'type' => 'required|string|in:avatar,evidence,document',
        ]);

        $file = $request->file('file');
        $type = $request->input('type');
        $orgId = $request->user()->current_organization_id;

        $path = $file->storeAs(
            "uploads/{$orgId}/{$type}",
            Str::uuid() . '.' . $file->getClientOriginalExtension(),
            'public'
        );

        $url = url(Storage::url($path));

        return $this->success([
            'path' => $path,
            'url' => $url,
            'filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ], 'File uploaded successfully');
    }

    /**
     * Delete an uploaded file.
     */
    public function destroy(Request $request, string $fileId): JsonResponse
    {
        // Typically $fileId would be a database record ID if tracked in a media table
        // For simple implementations, if fileId is the path base64 encoded:
        $path = base64_decode($fileId);

        // Security check: ensure path belongs to the user's organization
        $orgId = $request->user()->current_organization_id;
        if (!Str::startsWith($path, "uploads/{$orgId}/")) {
            return $this->forbidden('You do not have permission to delete this file.');
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        return $this->noContent('File deleted successfully');
    }
}
