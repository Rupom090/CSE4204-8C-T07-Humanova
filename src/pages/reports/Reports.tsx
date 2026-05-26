import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  PlusCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';

interface ReportTemplate {
  id: string;
  name: string;
  type: 'Security' | 'Cost' | 'Alignment' | 'Executive';
  date: string;
  status: 'available' | 'generating';
  size: string;
}

export const Reports: React.FC = () => {
  const { addNotification } = useUiStore();

  const [templates, setTemplates] = useState<ReportTemplate[]>([
    { id: 'rep-tpl-1', name: 'Executive AI Compliance Summary', type: 'Executive', date: 'May 2026', status: 'available', size: '1.4 MB' },
    { id: 'rep-tpl-2', name: 'Operational API Hallucination Audit', type: 'Security', date: 'May 2026', status: 'available', size: '2.1 MB' },
    { id: 'rep-tpl-3', name: 'Token Optimization Cost Savings Report', type: 'Cost', date: 'April 2026', status: 'available', size: '890 KB' },
    { id: 'rep-tpl-4', name: 'Verifier Consensus Alignment Log', type: 'Alignment', date: 'April 2026', status: 'available', size: '1.2 MB' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'Security' | 'Cost' | 'Alignment' | 'Executive'>('Executive');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownload = (name: string) => {
    addNotification(`Exporting "${name}" download payload...`, 'info');
    setTimeout(() => {
      addNotification(`"${name}" downloaded successfully.`, 'success');
    }, 1000);
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompiling(true);
    addNotification('Compiling AI trust telemetry registers. Generating PDF...', 'info');

    // Add generating report to template index list
    const tempId = `rep-tpl-${Date.now()}`;
    const newReport: ReportTemplate = {
      id: tempId,
      name: `${reportType} Trust Log [${dateRange}]`,
      type: reportType,
      date: 'May 2026',
      status: 'generating',
      size: '0 KB',
    };

    setTemplates((prev) => [newReport, ...prev]);

    setTimeout(() => {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === tempId
            ? { ...t, status: 'available', size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB` }
            : t
        )
      );
      setIsCompiling(false);
      setModalOpen(false);
      addNotification(`"${newReport.name}" created and is now available!`, 'success');
    }, 3000);
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'Security': return <ShieldCheck className="w-5 h-5 text-danger" />;
      case 'Cost': return <Calendar className="w-5 h-5 text-success" />;
      case 'Alignment': return <AlertTriangle className="w-5 h-5 text-warning" />;
      default: return <FileText className="w-5 h-5 text-accent-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary">
            Export Center
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Generate and export fully-certified compliance reports, prompt audits, and optimization receipts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="py-2 px-4 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[3px]" />
          Compile Report
        </button>
      </div>

      {/* Templates index list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <div 
            key={tpl.id}
            className="glass-card p-5 rounded-xl border border-border-subtle flex items-start justify-between gap-4 hover:border-border transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Type Icon */}
              <div className="p-3 bg-surface border border-border-subtle rounded-lg shrink-0 mt-0.5">
                {getTemplateIcon(tpl.type)}
              </div>

              {/* Meta */}
              <div className="space-y-1.5 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-display font-bold uppercase tracking-wider text-text-muted">{tpl.type} Log</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-[10px] text-text-secondary font-display font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-accent-primary" /> {tpl.date}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-text-primary truncate">
                  {tpl.name}
                </h4>
                <span className="text-[10px] text-text-secondary font-display font-bold uppercase">Size: {tpl.size}</span>
              </div>
            </div>

            {/* Action Download CTA */}
            <div className="shrink-0">
              {tpl.status === 'generating' ? (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded bg-warning/10 border border-warning/20 text-warning font-semibold text-[10px] uppercase font-display select-none">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling
                </div>
              ) : (
                <button
                  onClick={() => handleDownload(tpl.name)}
                  className="py-1.5 px-3 rounded bg-surface hover:bg-surface-hover border border-border hover:border-accent-primary text-[10px] font-display font-bold uppercase tracking-wider text-text-primary transition-all cursor-pointer flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-accent-primary" /> Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Generate New Report Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isCompiling && setModalOpen(false)} />

          {/* Modal Container */}
          <div className="glass-card rounded-2xl p-6 border border-border max-w-md w-full relative z-10 overflow-hidden shadow-2xl">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-primary to-accent-secondary" />

            <div className="flex items-center justify-between border-b border-border pb-3.5 mb-5">
              <h3 className="text-base font-display font-bold text-text-primary uppercase tracking-wider">
                Compile Document Registry
              </h3>
              {!isCompiling && (
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent hover:border-border transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {isCompiling ? (
              <div className="py-10 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-accent-primary animate-spin mx-auto" />
                <h4 className="text-sm font-display font-bold text-text-primary animate-pulse uppercase tracking-wider">Scrutinizing Compliance logs...</h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                  Aggregating verifier consensus voting, calculating provider reliability ratios, and compiling overall audit ledger outputs.
                </p>
              </div>
            ) : (
              <form onSubmit={handleGenerateReport} className="space-y-4">
                <div>
                  <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted mb-1.5 block">
                    Telemetry Focus Category
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full bg-bg-primary border border-border-subtle focus:border-accent-primary focus:outline-none rounded-lg p-2.5 text-xs text-text-primary font-medium cursor-pointer"
                  >
                    <option value="Executive">Executive Trust Dashboard</option>
                    <option value="Security">Operational Security & Hallucinations</option>
                    <option value="Cost">Prompt Optimizations & Budgets</option>
                    <option value="Alignment">Verifier Consensus Alignment</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted mb-1.5 block">
                    Telemetry Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle focus:border-accent-primary focus:outline-none rounded-lg p-2.5 text-xs text-text-primary font-medium cursor-pointer"
                  >
                    <option value="Last 24 Hours">Last 24 Hours</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days (Consensus Term)</option>
                    <option value="Month-To-Date">Month-To-Date (Telemetry Audit)</option>
                  </select>
                </div>

                <div className="border-t border-border pt-4 mt-6">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-98"
                  >
                    Generate Document
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
