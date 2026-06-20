<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Moderation Report</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Humanova Moderation Report</h1>
        <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Report ID</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reports ?? [] as $report)
            <tr>
                <td>{{ $report->id }}</td>
                <td>{{ $report->moderation_status }}</td>
                <td>{{ $report->assignedTo->name ?? 'Unassigned' }}</td>
                <td>{{ $report->created_at->format('Y-m-d') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
