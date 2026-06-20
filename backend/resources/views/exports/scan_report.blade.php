<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Scan Report</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
        .claim { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .status-verified { color: green; font-weight: bold; }
        .status-contradicted { color: red; font-weight: bold; }
        .status-unsupported { color: orange; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Humanova Scan Report</h1>
        <p>Scan ID: {{ $scan->id }}</p>
        <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>

    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Overall Confidence:</strong> {{ $scan->confidenceScore->overall_score ?? 'N/A' }} / 100</p>
        <p><strong>Total Claims Analyzed:</strong> {{ $scan->claims->count() }}</p>
    </div>

    <div class="claims">
        <h2>Detailed Findings</h2>
        @foreach($scan->claims as $claim)
        <div class="claim">
            <p><strong>Claim:</strong> {{ $claim->claim_text }}</p>
            <p>
                <strong>Status:</strong> 
                <span class="status-{{ strtolower($claim->verification_status ?? 'unsupported') }}">
                    {{ ucfirst($claim->verification_status ?? 'Unsupported') }}
                </span>
            </p>
            <p><strong>Confidence:</strong> {{ $claim->confidence_score ?? 'N/A' }}</p>
            
            @if($claim->verificationResults->isNotEmpty())
                <h4>Verification Details:</h4>
                <ul>
                @foreach($claim->verificationResults as $vr)
                    <li>{{ $vr->finding }} (Source: {{ $vr->source_url }})</li>
                @endforeach
                </ul>
            @endif
        </div>
        @endforeach
    </div>
</body>
</html>
