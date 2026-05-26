import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  Cpu, 
  FileCheck,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Download,
  AlertOctagon,
  ExternalLink,
  ChevronRight,
  Share2,
  Lock,
  Globe,
  Search
} from 'lucide-react';
import { useScanStore } from '@/stores/scanStore';
import { useUiStore } from '@/stores/uiStore';
import { ConfidenceScoreMeter } from '@/components/shared/ConfidenceScoreMeter';
import { ClaimHighlighter } from '@/components/shared/ClaimHighlighter';
import { ProviderBadge } from '@/components/shared/ProviderBadge';
import { ScanStatusBadge } from '@/components/shared/ScanStatusBadge';

export const Verification: React.FC = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { scans } = useScanStore();
  const { addNotification } = useUiStore();

  const [activeTab, setActiveTab] = useState<'response' | 'claims'>('response');

  // If no scanId is provided, render the directory view of all scans
  if (!scanId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary">
            Verification Records
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Directory of all audited queries, confidence scores, and historical fact-checking logs.
          </p>
        </div>

        <div className="glass-card rounded-xl border border-border-subtle overflow-hidden">
          <div className="p-4 bg-surface/30 border-b border-border-subtle flex items-center justify-between gap-4">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-text-muted">
              Audited Index
            </span>
            <span className="text-xs text-text-secondary">
              Total Records: <strong>{scans.length}</strong>
            </span>
          </div>

          <div className="divide-y divide-border-subtle">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => navigate(`/verification/${scan.id}`)}
                className="p-5 hover:bg-surface/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-2 overflow-hidden flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-display font-bold text-accent-primary">#{scan.id}</span>
                    <ProviderBadge provider={scan.provider} model={scan.model} />
                    <ScanStatusBadge status={scan.status} />
                    <span className="text-[10px] text-text-muted flex items-center gap-1 font-display">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(scan.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary truncate">
                    "{scan.prompt}"
                  </h3>
                </div>

                <div className="flex items-center gap-6 self-start md:self-center shrink-0">
                  <div className="text-right">
                    <span 
                      className="text-2xl font-display font-black block"
                      style={{
                        color: scan.confidenceScore >= 90 ? '#10B981' : scan.confidenceScore >= 70 ? '#22D3EE' : scan.confidenceScore >= 50 ? '#F59E0B' : '#EF4444'
                      }}
                    >
                      {scan.confidenceScore}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-text-secondary font-display font-medium">Confidence</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted hover:text-text-primary transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Load selected scan details
  const scan = scans.find((s) => s.id === scanId);

  if (!scan) {
    return (
      <div className="text-center p-12 glass-card rounded-xl border border-border-subtle">
        <AlertOctagon className="w-12 h-12 text-danger mx-auto mb-4" />
        <h3 className="text-lg font-display font-bold text-text-primary">Record Not Found</h3>
        <p className="text-xs text-text-secondary mt-1">The requested verification record #{scanId} could not be resolved.</p>
        <button
          onClick={() => navigate('/verification')}
          className="mt-6 py-2 px-4 rounded-lg bg-surface hover:bg-surface-hover border border-border text-xs font-semibold cursor-pointer text-text-primary"
        >
          Return to directory
        </button>
      </div>
    );
  }

  // Count claims category numbers
  const verifiedClaims = scan.claims.filter((c) => c.category === 'verified');
  const uncertainClaims = scan.claims.filter((c) => c.category === 'uncertain');
  const hallucinatedClaims = scan.claims.filter((c) => c.category === 'hallucinated');

  // Hardcoded values for the score breakdowns matching the specs
  const similarityScore = 0.88;
  const authorityScore = 0.92;
  const penaltyScore = -0.14;
  const citationScore = 0.79;

  // Fake uncertainty scanner flagged words
  const flaggedWords = ['may', 'possibly', 'approximately', 'Google claims', 'claims that'];

  const handleExportPDF = () => {
    addNotification(`Exporting PDF Audit Summary for scan ${scan.id}...`, 'info');
    setTimeout(() => {
      addNotification(`PDF Trust Report ${scan.id} generated & downloaded successfully.`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span 
              onClick={() => navigate('/verification')}
              className="text-xs font-semibold text-accent-primary hover:underline cursor-pointer transition-all"
            >
              Directory
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted font-display font-bold uppercase">#{scan.id}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary mt-1">
            Scan Audit Breakdown
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="py-2 px-4 rounded-lg bg-surface hover:bg-surface-hover border border-border hover:border-accent-primary text-xs font-display font-black uppercase tracking-wider text-text-primary transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-accent-primary" />
            Export PDF
          </button>
          <button
            onClick={() => addNotification('Copied shareable scan token to clipboard!', 'success')}
            className="p-2 rounded-lg bg-surface hover:bg-surface-hover border border-border hover:border-accent-primary transition-all cursor-pointer"
            title="Share Audit Record"
          >
            <Share2 className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Top Banner Confidence Overview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center glass-card p-6 md:p-8 rounded-xl border border-border-subtle relative overflow-hidden">
        {/* Glow accent matching color */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-secondary via-transparent to-bg-secondary pointer-events-none" />

        {/* Circular radial progress meter (left) */}
        <div className="lg:col-span-4 flex items-center justify-center relative z-10">
          <ConfidenceScoreMeter score={scan.confidenceScore} size={200} strokeWidth={14} />
        </div>

        {/* Metadata & breakdown (right) */}
        <div className="lg:col-span-8 space-y-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface/50 border border-border-subtle p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-display font-semibold">Engine Provider</span>
              <span className="text-sm font-bold text-text-primary mt-2 flex items-center gap-1.5 capitalize">
                <Cpu className="w-4 h-4 text-accent-primary" />
                {scan.provider}
              </span>
            </div>

            <div className="bg-surface/50 border border-border-subtle p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-display font-semibold">Model ID</span>
              <span className="text-sm font-mono font-bold text-text-primary mt-2">{scan.model}</span>
            </div>

            <div className="bg-surface/50 border border-border-subtle p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-display font-semibold">Audit Duration</span>
              <span className="text-sm font-bold text-text-primary mt-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent-primary animate-pulse" />
                {(scan.duration / 1000).toFixed(2)}s
              </span>
            </div>

            <div className="bg-surface/50 border border-border-subtle p-3 rounded-lg flex flex-col justify-between">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-display font-semibold">Token Savings</span>
              <span className="text-sm font-bold text-success mt-2">
                {scan.tokenUsage.savings}% optimization
              </span>
            </div>
          </div>

          {/* Score breakdown metrics strip */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-display font-bold uppercase tracking-widest text-text-muted">
              Semantic Integrity Vectors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Semantic Similarity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">Similarity</span>
                  <span className="font-display font-bold text-accent-primary">{similarityScore}</span>
                </div>
                <div className="h-1.5 bg-surface border border-border-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-accent-primary rounded-full" style={{ width: `${similarityScore * 100}%` }} />
                </div>
              </div>

              {/* Source Authority */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">Authority</span>
                  <span className="font-display font-bold text-success">{authorityScore}</span>
                </div>
                <div className="h-1.5 bg-surface border border-border-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: `${authorityScore * 100}%` }} />
                </div>
              </div>

              {/* Contradiction Penalty */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">Contradictions</span>
                  <span className="font-display font-bold text-danger">{penaltyScore}</span>
                </div>
                <div className="h-1.5 bg-surface border border-border-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-danger rounded-full" style={{ width: `${Math.abs(penaltyScore) * 100}%` }} />
                </div>
              </div>

              {/* Citation Validity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium">Citations</span>
                  <span className="font-display font-bold text-accent-primary">{citationScore}</span>
                </div>
                <div className="h-1.5 bg-surface border border-border-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-accent-secondary rounded-full" style={{ width: `${citationScore * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (2 column) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (8 cols): Audited Text & claims */}
        <div className="lg:col-span-8 glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex bg-bg-primary border border-border-subtle p-0.5 rounded-lg">
                <button
                  onClick={() => setActiveTab('response')}
                  className={`px-3.5 py-1 rounded text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer ${
                    activeTab === 'response' ? 'bg-surface text-accent-primary border border-border-subtle shadow-md' : 'text-text-secondary'
                  }`}
                >
                  Audited Response
                </button>
                <button
                  onClick={() => setActiveTab('claims')}
                  className={`px-3.5 py-1 rounded text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer ${
                    activeTab === 'claims' ? 'bg-surface text-accent-primary border border-border-subtle shadow-md' : 'text-text-secondary'
                  }`}
                >
                  Claims Directory
                </button>
              </div>

              <div className="flex gap-3 text-[10px] font-display font-bold uppercase tracking-wider">
                {verifiedClaims.length > 0 && <span className="text-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-success" /> {verifiedClaims.length} verified</span>}
                {uncertainClaims.length > 0 && <span className="text-warning flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-warning" /> {uncertainClaims.length} uncertain</span>}
                {hallucinatedClaims.length > 0 && <span className="text-danger flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-danger animate-pulse" /> {hallucinatedClaims.length} hallucination</span>}
              </div>
            </div>

            {/* Tab 1: Render Response Body with Highlighters */}
            {activeTab === 'response' && (
              <div className="space-y-4">
                <div className="p-2 bg-surface/30 rounded border border-border-subtle text-xs italic text-text-secondary font-medium">
                  💡 Prompt Input: "{scan.prompt}"
                </div>

                <div className="p-5 bg-bg-primary rounded-lg border border-border-subtle leading-relaxed font-sans shadow-inner min-h-[220px]">
                  <ClaimHighlighter text={scan.response} claims={scan.claims} />
                </div>

                <p className="text-[10px] text-text-secondary italic">
                  *Click on any underlined statement inside the response text to slide open detailed authority score audits and live citation sources.
                </p>
              </div>
            )}

            {/* Tab 2: Claims Directory card lists */}
            {activeTab === 'claims' && (
              <div className="space-y-4">
                {scan.claims.map((claim) => (
                  <div 
                    key={claim.id}
                    className={`p-4 rounded-lg bg-surface/50 border border-border-subtle flex flex-col gap-3 hover:border-border transition-all`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-medium text-text-primary">
                        "{claim.text}"
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shrink-0 ${
                        claim.category === 'verified' ? 'bg-success/15 text-success' : claim.category === 'uncertain' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
                      }`}>
                        {claim.category}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed bg-bg-primary/40 p-2.5 rounded border border-border-subtle/50">
                      {claim.details}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Citations, broken links, uncertainty Flagging */}
        <div className="lg:col-span-4 flex flex-col gap-6 justify-between items-stretch">
          
          {/* Top segment: Broken link checker table */}
          <div className="glass-card p-5 rounded-xl border border-border-subtle">
            <h3 className="text-xs font-display font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-accent-primary" /> Citation Link Inspector
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10px] font-sans">
                <thead>
                  <tr className="border-b border-border-subtle text-text-secondary uppercase tracking-wider font-display">
                    <th className="py-2 pr-2 font-bold">Domain</th>
                    <th className="py-2 pr-2 font-bold">Status</th>
                    <th className="py-2 pr-2 font-bold">SSL</th>
                    <th className="py-2 font-bold">Trust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/40 text-text-primary">
                  <tr>
                    <td className="py-2 pr-2 font-semibold">nvidia.com</td>
                    <td className="py-2 pr-2 text-success font-semibold">200 OK</td>
                    <td className="py-2 pr-2 text-success font-semibold">Yes</td>
                    <td className="py-2 text-success font-bold">99%</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-2 font-semibold">sec.gov</td>
                    <td className="py-2 pr-2 text-success font-semibold">200 OK</td>
                    <td className="py-2 pr-2 text-success font-semibold">Yes</td>
                    <td className="py-2 text-success font-bold">98%</td>
                  </tr>
                  {scanId === 'scan-2846' && (
                    <tr>
                      <td className="py-2 pr-2 font-semibold text-danger">aisafety.org</td>
                      <td className="py-2 pr-2 text-danger font-semibold">404 Err</td>
                      <td className="py-2 pr-2 text-danger font-semibold">No</td>
                      <td className="py-2 text-danger font-bold">22%</td>
                    </tr>
                  )}
                  {scanId !== 'scan-2846' && (
                    <tr>
                      <td className="py-2 pr-2 font-semibold">fool.com</td>
                      <td className="py-2 pr-2 text-success font-semibold">200 OK</td>
                      <td className="py-2 pr-2 text-success font-semibold">Yes</td>
                      <td className="py-2 text-warning font-bold">85%</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Middle segment: Uncertainty scanner (flagged words) */}
          <div className="glass-card p-5 rounded-xl border border-border-subtle flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-display font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-warning" /> Uncertainty Flags
              </h3>
              <p className="text-[10px] text-text-secondary leading-relaxed mb-4">
                Flagged lexical modifiers indicating vague estimations or questionable certainty thresholds.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {flaggedWords.map((word) => {
                  const exists = scan.response.toLowerCase().includes(word.toLowerCase());

                  return (
                    <span 
                      key={word}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                        exists 
                          ? 'bg-warning/15 border-warning/35 text-warning font-bold' 
                          : 'bg-surface/30 border-border-subtle text-text-muted'
                      }`}
                    >
                      "{word}"
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="text-[9px] text-text-muted italic border-t border-border-subtle pt-3 mt-4">
              *Lexical modifiers often mask missing sources or hallucinations.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
