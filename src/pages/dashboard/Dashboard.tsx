import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Percent, 
  Coins, 
  CheckSquare, 
  Activity, 
  Terminal,
  ArrowRight,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { StatCard } from '@/components/shared/StatCard';
import { FactualWave } from '@/components/shared/FactualWave';
import { EditorialFrame } from '@/components/shared/EditorialFrame';
import { useScanStore } from '@/stores/scanStore';
import { useUiStore } from '@/stores/uiStore';

// Charts Data
const lineChartData = [
  { name: 'May 20', OpenAI: 12.4, Gemini: 18.2 },
  { name: 'May 21', OpenAI: 14.1, Gemini: 19.5 },
  { name: 'May 22', OpenAI: 11.2, Gemini: 16.8 },
  { name: 'May 23', OpenAI: 13.5, Gemini: 17.4 },
  { name: 'May 24', OpenAI: 9.8, Gemini: 18.9 },
  { name: 'May 25', OpenAI: 10.4, Gemini: 15.3 },
  { name: 'May 26', OpenAI: 11.0, Gemini: 14.2 },
];

const providerReliabilityData = [
  { name: 'OpenAI', value: 95.8, color: '#10a37f' },
  { name: 'Gemini', value: 94.2, color: '#3876e0' },
  { name: 'DeepSeek', value: 90.5, color: '#2e5ef4' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
}

// Custom tooltips for Recharts
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border-subtle p-3 rounded-lg shadow-xl text-xs font-sans">
        <p className="text-text-primary font-bold mb-1.5">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="flex items-center gap-1.5 font-medium" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { scans, startScan, isScanning } = useScanStore();
  const { addNotification } = useUiStore();

  const [quickPrompt, setQuickPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'gemini' | 'deepseek'>('openai');

  const handleQuickScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || isScanning) return;

    try {
      addNotification('Quick scan started. Auditing model response...', 'info');
      // Set appropriate model based on provider
      const model = selectedProvider === 'openai' ? 'GPT-4o' : selectedProvider === 'gemini' ? 'Gemini 1.5 Pro' : 'DeepSeek V3';
      const scan = await startScan(quickPrompt, selectedProvider, model);
      addNotification(`Scan ${scan.id} verified successfully!`, 'success');
      navigate(`/verification/${scan.id}`);
    } catch (err) {
      addNotification('Quick scan failed.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary">
          Trust Console
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Real-time AI hallucination detection, citation auditing, and security compliance dashboards.
        </p>
      </div>

      {/* Row 1 — Hero Stats Strip (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Scans Audited"
          value="2,847"
          trend="+14.2%"
          trendDirection="up"
          accentColor="#22D3EE"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <StatCard
          label="Avg Hallucination Rate"
          value="18.3%"
          trend="-2.4%"
          trendDirection="up" // down is good for hallucination rates, but we want positive visual cue
          accentColor="#F59E0B"
          icon={<Percent className="w-5 h-5" />}
        />
        <StatCard
          label="Token Optimization"
          value="₸ 124K"
          trend="+8.7%"
          trendDirection="up"
          accentColor="#22D3EE"
          icon={<Coins className="w-5 h-5" />}
        />
        <StatCard
          label="Engine Reliability"
          value="94.2%"
          trend="+0.9%"
          trendDirection="up"
          accentColor="#10B981"
          icon={<CheckSquare className="w-5 h-5" />}
        />
      </div>

      {/* Row 2 — Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hallucination Rate Trend Line chart */}
        <div className="lg:col-span-8 relative glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
          <EditorialFrame />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-display font-semibold text-text-primary">
                Hallucination Rates Over Time
              </h3>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Comparison of daily hallucination rates (%) across integrated model providers.
              </p>
            </div>
            <div className="flex gap-4 text-xs font-display font-bold">
              <span className="flex items-center gap-1 text-[#10a37f]">
                <span className="w-2.5 h-2.5 rounded bg-[#10a37f]" /> OpenAI
              </span>
              <span className="flex items-center gap-1 text-[#3876e0]">
                <span className="w-2.5 h-2.5 rounded bg-[#3876e0]" /> Gemini
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="openaiGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10a37f" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10a37f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-muted)" 
                  fontSize={10} 
                  fontFamily="DM Mono" 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={10} 
                  fontFamily="DM Mono" 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, 25]} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="OpenAI" 
                  stroke="#10a37f" 
                  strokeWidth={2.5} 
                  activeDot={{ r: 6 }} 
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="Gemini" 
                  stroke="#3876e0" 
                  strokeWidth={2.5} 
                  activeDot={{ r: 6 }}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Provider Reliability Donut chart */}
        <div className="lg:col-span-4 relative glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
          <EditorialFrame />
          <div>
            <h3 className="text-base font-display font-semibold text-text-primary">
              Engine Performance
            </h3>
            <p className="text-[10px] text-text-secondary mt-0.5">
              Reliability scoring ratio comparison among prompt execution networks.
            </p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerReliabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {providerReliabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Reliability']} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-bold text-text-primary">93.5%</span>
              <span className="text-[9px] uppercase tracking-wider text-text-secondary font-display">Combined</span>
            </div>
          </div>

          <div className="space-y-2">
            {providerReliabilityData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs border-b border-border-subtle/40 pb-1.5 last:border-0 last:pb-0">
                <span className="flex items-center gap-2 text-text-secondary font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="font-display font-bold text-text-primary">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — Activity Feed + Quick Scan Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Activity Feed */}
        <div className="lg:col-span-8 relative glass-card p-6 rounded-xl border border-border-subtle">
          <EditorialFrame />
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-accent-primary" />
            <h3 className="text-base font-display font-semibold text-text-primary">
              Recent Trust Logs
            </h3>
          </div>

          <div className="space-y-4">
            {scans.slice(0, 3).map((scan) => {
              const hasHallucination = scan.claims.some(c => c.category === 'hallucinated');
              const hasUncertainty = scan.claims.some(c => c.category === 'uncertain');

              return (
                <div 
                  key={scan.id}
                  onClick={() => navigate(`/verification/${scan.id}`)}
                  className="p-4 rounded-lg bg-surface/50 hover:bg-surface border border-border-subtle hover:border-border transition-all flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5 overflow-hidden">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-display text-xs font-bold text-accent-primary">
                        #{scan.id}
                      </span>
                      <span className="text-[10px] text-text-secondary font-mono">
                        {scan.model}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {new Date(scan.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-text-primary font-medium line-clamp-1">
                      "{scan.prompt}"
                    </p>
                    <div className="flex items-center gap-3">
                      {hasHallucination && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded border border-danger/20 uppercase tracking-wide">
                          <Flame className="w-3 h-3" /> Hallucination Flagged
                        </span>
                      )}
                      {hasUncertainty && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded border border-warning/20 uppercase tracking-wide">
                          <AlertTriangle className="w-3 h-3" /> Uncertainty scanner
                        </span>
                      )}
                      {!hasHallucination && !hasUncertainty && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20 uppercase tracking-wide">
                          Verified Integrity
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span 
                      className="text-lg font-display font-black"
                      style={{
                        color: scan.confidenceScore >= 90 ? '#10B981' : scan.confidenceScore >= 70 ? '#22D3EE' : scan.confidenceScore >= 50 ? '#F59E0B' : '#EF4444'
                      }}
                    >
                      {scan.confidenceScore}%
                    </span>
                    <span className="text-[9px] font-display uppercase tracking-widest text-text-secondary">
                      Score
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Scan Console */}
        <div className="lg:col-span-4 relative glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
          <EditorialFrame />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-accent-primary" />
              <h3 className="text-base font-display font-semibold text-text-primary">
                Trust Sandbox
              </h3>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Verify claims directly by passing your prompt text to an LLM provider and reviewing live fact-checking.
            </p>
          </div>

          <FactualWave isScanning={isScanning} />

          <form onSubmit={handleQuickScan} className="space-y-4 my-4">
            <div>
              <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted mb-1.5 block">
                Target Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as any)}
                className="w-full bg-bg-primary border border-border-subtle rounded-lg py-1.5 px-3 text-xs text-text-primary font-medium focus:border-accent-primary focus:outline-none cursor-pointer"
              >
                <option value="openai">OpenAI GPT-4o</option>
                <option value="gemini">Google Gemini 1.5 Pro</option>
                <option value="deepseek">DeepSeek V3</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted mb-1.5 block">
                Verification Query
              </label>
              <textarea
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Type query or claim..."
                rows={4}
                className="w-full bg-bg-primary border border-border-subtle focus:border-accent-primary focus:ring-1 focus:ring-accent-glow focus:outline-none transition-all rounded-lg p-3 text-xs text-text-primary placeholder:text-text-muted font-sans font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isScanning || !quickPrompt.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isScanning ? 'Scrutinizing...' : 'Execute Audit'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
