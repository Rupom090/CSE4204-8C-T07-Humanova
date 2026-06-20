<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Analytics Summary</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
        .stat-box { border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Humanova Analytics Summary</h1>
        <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>

    <div class="stat-box">
        <h3>Total Tokens Used</h3>
        <p>{{ $data['tokens'] ?? 0 }}</p>
    </div>

    <div class="stat-box">
        <h3>Total Scans Performed</h3>
        <p>{{ $data['scans'] ?? 0 }}</p>
    </div>

    <div class="stat-box">
        <h3>Hallucination Rate</h3>
        <p>{{ $data['hallucination_rate'] ?? 0 }}%</p>
    </div>
</body>
</html>
