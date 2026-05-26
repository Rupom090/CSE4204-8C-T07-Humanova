import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Cpu, 
  Coins, 
  ShieldAlert, 
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { ProviderBadge } from '@/components/shared/ProviderBadge';

// Tab data
const areaChartData = [
  { day: '01 May', rate: 21.4 },
  { day: '05 May', rate: 19.8 },
  { day: '10 May', rate: 18.2 },
  { day: '15 May', rate: 19.5 },
  { day: '20 May', rate: 18.9 },
  { day: '25 May', rate: 18.3 },
];

const confidenceDistData = [
  { range: '90-100%', count: 1240, color: '#10B981' },
  { range: '70-89%', count: 860, color: '#22D3EE' },
  { range: '50-69%', count: 480, color: '#F59E0B' },
  { range: 'Below 50%', count: 267, color: '#EF4444' },
];

const categoryData = [
  { category: 'Fabricated Citation', rate: 38 },
  { category: 'Fake Statistics', rate: 28 },
  { category: 'Self-Contradiction', rate: 18 },
  { category: 'Misrepresentation', rate: 16 },
];

const tokenOverTimeData = [
  { name: 'May 20', optimized: 240, standard: 340 },
  { name: 'May 21', optimized: 280, standard: 390 },
  { name: 'May 22', optimized: 210, standard: 310 },
  { name: 'May 23', optimized: 310, standard: 450 },
  { name: 'May 24', optimized: 250, standard: 360 },
  { name: 'May 25', optimized: 290, standard: 420 },
  { name: 'May 26', optimized: 270, standard: 380 },
];

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'tokens' | 'moderation'>('overview');

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary">
            Security Intelligence
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Aggregated audit telemetry, token cost saving metrics, and hallucination distribution intelligence.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface/50 border border-border-subtle p-0.5 rounded-lg w-fit">
          {(['overview', 'providers', 'tokens', 'moderation'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer capitalize ${
                activeTab === tab 
                  ? 'bg-surface text-accent-primary border border-border-subtle shadow-md' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER ACTIVE TABS */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Hallucination Rate area chart */}
            <div className="glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary">
                  Monthly Hallucination Curve
                </h3>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Visual mapping of prompt response hallucination ratings over the last 30 days.
                </p>
              </div>

              <div className="h-64 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} fontFamily="DM Mono" tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} domain={[15, 25]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#22D3EE" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score distribution bar chart */}
            <div className="glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary">
                  Confidence Index Distribution
                </h3>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Quantity metrics of scans categorized under trust ratings.
                </p>
              </div>

              <div className="h-64 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={confidenceDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="range" stroke="var(--text-muted)" fontSize={10} fontFamily="DM Mono" tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {confidenceDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row 2: Categories of Hallucinations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 glass-card p-6 rounded-xl border border-border-subtle">
              <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary mb-6">
                Incident Vectors Breakdown
              </h3>
              <div className="space-y-4">
                {categoryData.map((c) => (
                  <div key={c.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary font-medium">{c.category}</span>
                      <span className="font-display font-bold text-text-primary">{c.rate}%</span>
                    </div>
                    <div className="h-2 bg-surface border border-border-subtle rounded-full overflow-hidden">
                      <div className="h-full bg-accent-secondary rounded-full" style={{ width: `${c.rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary">
                  Engine Compliance Heatmap
                </h3>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Provider comparison showing latency versus hallucination risk index.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-surface/50 border border-border-subtle rounded-lg p-4 text-center space-y-1.5">
                  <span className="text-[10px] font-display uppercase tracking-wider text-text-muted font-bold block">GPT-4o</span>
                  <span className="text-lg font-display font-bold text-success">95.8%</span>
                  <span className="text-[9px] text-text-secondary block">Compliance rating</span>
                </div>
                <div className="bg-surface/50 border border-border-subtle rounded-lg p-4 text-center space-y-1.5">
                  <span className="text-[10px] font-display uppercase tracking-wider text-text-muted font-bold block">Gemini Pro</span>
                  <span className="text-lg font-display font-bold text-success">94.2%</span>
                  <span className="text-[9px] text-text-secondary block">Compliance rating</span>
                </div>
                <div className="bg-surface/50 border border-border-subtle rounded-lg p-4 text-center space-y-1.5">
                  <span className="text-[10px] font-display uppercase tracking-wider text-text-muted font-bold block">DeepSeek V3</span>
                  <span className="text-lg font-display font-bold text-warning">90.5%</span>
                  <span className="text-[9px] text-text-secondary block">Compliance rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROVIDERS */}
      {activeTab === 'providers' && (
        <div className="glass-card rounded-xl border border-border-subtle overflow-hidden p-6 space-y-6">
          <div>
            <h3 className="text-base font-display font-bold uppercase tracking-wider text-text-primary">
              AI Integrations Audit
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Live service status, latency indices, and historical accuracy scores of operational endpoints.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary uppercase tracking-wider font-display font-bold">
                  <th className="py-3 px-4">Provider Engine</th>
                  <th className="py-3 px-4">Operational Status</th>
                  <th className="py-3 px-4">Reliability</th>
                  <th className="py-3 px-4">Avg Latency</th>
                  <th className="py-3 px-4 text-right">Optimization Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-text-primary">
                <tr className="hover:bg-surface/30 transition-colors">
                  <td className="py-4 px-4 font-semibold">OpenAI GPT-4o</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/15 text-success font-semibold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" /> Operational
                    </span>
                  </td>
                  <td className="py-4 px-4 font-display font-bold text-success">95.8%</td>
                  <td className="py-4 px-4 font-display text-text-secondary">420ms</td>
                  <td className="py-4 px-4 text-right font-display font-bold text-accent-primary">34.5%</td>
                </tr>
                <tr className="hover:bg-surface/30 transition-colors">
                  <td className="py-4 px-4 font-semibold">Google Gemini 1.5 Pro</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/15 text-success font-semibold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" /> Operational
                    </span>
                  </td>
                  <td className="py-4 px-4 font-display font-bold text-success">94.2%</td>
                  <td className="py-4 px-4 font-display text-text-secondary">350ms</td>
                  <td className="py-4 px-4 text-right font-display font-bold text-accent-primary">28.1%</td>
                </tr>
                <tr className="hover:bg-surface/30 transition-colors">
                  <td className="py-4 px-4 font-semibold">DeepSeek V3</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning/15 text-warning font-semibold text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning" /> Degraded Performance
                    </span>
                  </td>
                  <td className="py-4 px-4 font-display font-bold text-warning">90.5%</td>
                  <td className="py-4 px-4 font-display text-text-secondary">890ms</td>
                  <td className="py-4 px-4 text-right font-display font-bold text-accent-primary">42.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TOKENS */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Savings stats card (4 cols) */}
            <div className="lg:col-span-4 glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
              <div className="space-y-2">
                <Coins className="w-8 h-8 text-accent-primary" />
                <h3 className="text-base font-display font-bold uppercase tracking-wider text-text-primary">
                  Token Budgets Optimizer
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Calculated cost optimization margins generated through pre-compiled LLM prompts, mapping redundancies before API execution.
                </p>
              </div>

              <div className="my-6 space-y-4">
                <div className="bg-surface p-4 border border-border-subtle rounded-lg">
                  <span className="text-[10px] font-display uppercase tracking-widest text-text-muted font-bold">Estimated Savings</span>
                  <div className="text-3xl font-display font-black text-success mt-1">₸ 124,840</div>
                  <span className="text-[9px] text-text-secondary block mt-1">Across 2.4 Million optimized tokens</span>
                </div>
              </div>

              <div className="text-[10px] text-text-muted italic">
                *Optimization utilizes local caching protocols.
              </div>
            </div>

            {/* Token optimization curves (8 cols) */}
            <div className="lg:col-span-8 glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-display font-bold uppercase tracking-wider text-text-primary">
                  Volume Compression Telemetry
                </h3>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Comparison between raw token sizes (standard) and optimized system prompts sizes (optimized).
                </p>
              </div>

              <div className="h-64 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tokenOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} fontFamily="DM Mono" tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="standard" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="optimized" stroke="#10B981" strokeWidth={2.5} activeDot={{ r: 6 }} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: MODERATION */}
      {activeTab === 'moderation' && (
        <div className="glass-card rounded-xl border border-border-subtle p-6 space-y-6">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-accent-primary" />
            <div>
              <h3 className="text-base font-display font-bold uppercase tracking-wider text-text-primary">
                Trust Governance Metrics
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Consensus reports and alignment indicators evaluated across the verifier ecosystem.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface/40 border border-border-subtle rounded-lg p-5 text-center space-y-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-text-muted font-bold">Accuracy Index</span>
              <div className="text-4xl font-display font-black text-success">98.4%</div>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Aggregated ratio of consensus-verified prompt reports matches.
              </p>
            </div>

            <div className="bg-surface/40 border border-border-subtle rounded-lg p-5 text-center space-y-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-text-muted font-bold">Incidents Flagged</span>
              <div className="text-4xl font-display font-black text-warning">42</div>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Hallucinations reported and logged by organizational verifiers.
              </p>
            </div>

            <div className="bg-surface/40 border border-border-subtle rounded-lg p-5 text-center space-y-2">
              <span className="text-[10px] font-display uppercase tracking-widest text-text-muted font-bold">Active Audits</span>
              <div className="text-4xl font-display font-black text-accent-primary">14</div>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Open fact-check queues pending secondary validator audits.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
