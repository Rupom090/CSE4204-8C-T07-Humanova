<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Organization Report</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Organization Summary Report</h1>
        <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>

    <h2>Organization Details</h2>
    <p><strong>Name:</strong> {{ $org->name ?? 'N/A' }}</p>
    <p><strong>Members Count:</strong> {{ isset($org) ? $org->members()->count() : 0 }}</p>
</body>
</html>
