import React, { useState } from 'react';
import { 
  Users, 
  ChevronUp, 
  ChevronDown, 
  Filter, 
  ShieldCheck, 
  MessageSquare,
  Award,
  AlertOctagon,
  CheckCircle,
  ThumbsUp
} from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { mockReports } from '@/services/api';
import { ModerationReport } from '@/types';

const verifiersLeaderboard = [
  { rank: 1, name: 'Dr. Sarah Connor', score: 1420, badge: 'Expert', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', color: '#EAB308' },
  { rank: 2, name: 'Aiden Vance', score: 940, badge: 'Expert', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80', color: '#EAB308' },
  { rank: 3, name: 'Alan Turing', score: 810, badge: 'Trusted', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', color: '#22D3EE' },
  { rank: 4, name: 'Grace Hopper', score: 790, badge: 'Trusted', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80', color: '#22D3EE' },
  { rank: 5, name: 'Linus B.', score: 340, badge: 'Beginner', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', color: '#94A3B8' },
];

export const Community: React.FC = () => {
  const { addNotification } = useUiStore();
  
  const [activeTab, setActiveTab] = useState<'queue' | 'leaderboard'>('queue');
  const [reports, setReports] = useState<ModerationReport[]>(mockReports);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedReason, setSelectedReason] = useState<string>('all');

  const handleVote = (id: string, dir: 'up' | 'down') => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        
        // Prevent voting multiple times simple toggle
        if (r.userVote === dir) {
          // Remove vote
          return {
            ...r,
            userVote: undefined,
            votes: {
              upvotes: dir === 'up' ? r.votes.upvotes - 1 : r.votes.upvotes,
              downvotes: dir === 'down' ? r.votes.downvotes - 1 : r.votes.downvotes,
            }
          };
        }

        const upDiff = dir === 'up' ? 1 : r.userVote === 'up' ? -1 : 0;
        const downDiff = dir === 'down' ? 1 : r.userVote === 'down' ? -1 : 0;

        return {
          ...r,
          userVote: dir,
          votes: {
            upvotes: r.votes.upvotes + upDiff,
            downvotes: r.votes.downvotes + downDiff,
          }
        };
      })
    );
    addNotification('Vote logged successfully in verifier consensus ledger.', 'success');
  };

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
    addNotification(`Incident Report ${id} has been marked as RESOLVED.`, 'success');
  };

  // Filter logic
  const filteredReports = reports.filter((r) => {
    if (selectedSeverity !== 'all' && r.severity !== selectedSeverity) return false;
    if (selectedReason !== 'all' && r.reason !== selectedReason) return false;
    return true;
  });

  const getSeverityBorder = (sev: string) => {
    if (sev === 'high') return 'border-l-4 border-l-danger';
    if (sev === 'medium') return 'border-l-4 border-l-warning';
    return 'border-l-4 border-l-info';
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case 'FAKE_CITATION': return 'bg-danger/15 text-danger border-danger/20';
      case 'FABRICATED_STAT': return 'bg-danger/15 text-danger border-danger/20';
      case 'CONTRADICTION': return 'bg-warning/15 text-warning border-warning/20';
      default: return 'bg-info/15 text-info border-info/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary">
            Consensus Moderation
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Community-driven hallucination reporting, peer review logs, and reputational verifier leaderboards.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-surface/50 border border-border-subtle p-0.5 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer ${
              activeTab === 'queue' ? 'bg-surface text-accent-primary border border-border-subtle shadow-md' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Reports Queue
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer ${
              activeTab === 'leaderboard' ? 'bg-surface text-accent-primary border border-border-subtle shadow-md' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TABS */}

      {/* TAB 1: REPORTS QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Filters card */}
          <div className="glass-card p-4 rounded-xl border border-border-subtle flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <Filter className="w-4 h-4 text-accent-primary" />
              <span className="font-display font-bold uppercase tracking-wider">Filter Reports:</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-text-muted font-medium">Severity:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-bg-primary border border-border-subtle rounded px-2.5 py-1 text-text-primary focus:border-accent-primary focus:outline-none cursor-pointer font-medium"
                >
                  <option value="all">All Severities</option>
                  <option value="high">High Severity</option>
                  <option value="medium">Medium Severity</option>
                  <option value="low">Low Severity</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-text-muted font-medium">Incident:</span>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="bg-bg-primary border border-border-subtle rounded px-2.5 py-1 text-text-primary focus:border-accent-primary focus:outline-none cursor-pointer font-medium"
                >
                  <option value="all">All Categories</option>
                  <option value="FAKE_CITATION">Fake Citation</option>
                  <option value="FABRICATED_STAT">Fabricated Stat</option>
                  <option value="CONTRADICTION">Self-Contradiction</option>
                </select>
              </div>
            </div>
          </div>

          {/* Queue reports grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.length > 0 ? (
              filteredReports.map((r) => {
                const totalVotes = r.votes.upvotes - r.votes.downvotes;

                return (
                  <div 
                    key={r.id} 
                    className={`glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between space-y-4 hover:border-border hover:shadow-xl transition-all relative ${getSeverityBorder(r.severity)}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-[10px] font-display font-bold text-accent-primary">#{r.id}</span>
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-display font-bold tracking-wider ${getReasonBadge(r.reason)}`}>
                          {r.reason.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-text-primary">
                        {r.title}
                      </h3>

                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                        {r.description}
                      </p>
                    </div>

                    <div className="border-t border-border-subtle/50 pt-4 flex items-center justify-between gap-4">
                      {/* Left: Reporter badge details */}
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-accent-primary shrink-0" />
                        <div>
                          <span className="text-[10px] font-semibold text-text-primary block leading-none">{r.reporter.name}</span>
                          <span className="text-[8px] font-display uppercase tracking-widest text-text-muted font-bold block mt-0.5">
                            {r.reporter.badge} verifier
                          </span>
                        </div>
                      </div>

                      {/* Right: consensus voting & actions */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-bg-primary/50 border border-border-subtle rounded-md">
                          <button
                            onClick={() => handleVote(r.id, 'up')}
                            className={`p-1 hover:text-success transition-all cursor-pointer ${r.userVote === 'up' ? 'text-success' : 'text-text-secondary'}`}
                            title="Upvote Consensus"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <span className="px-1 text-[10px] font-display font-bold text-text-primary min-w-[12px] text-center">
                            {totalVotes}
                          </span>
                          <button
                            onClick={() => handleVote(r.id, 'down')}
                            className={`p-1 hover:text-danger transition-all cursor-pointer ${r.userVote === 'down' ? 'text-danger' : 'text-text-secondary'}`}
                            title="Downvote Consensus"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        {r.status === 'pending' ? (
                          <button
                            onClick={() => handleResolve(r.id)}
                            className="py-1 px-2.5 rounded bg-success hover:brightness-110 text-bg-primary font-display font-black uppercase text-[9px] tracking-wider transition-all cursor-pointer"
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-success/15 text-success font-semibold text-[9px] uppercase font-display border border-success/20">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-2 text-center p-12 glass-card rounded-xl border border-border-subtle">
                <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
                <h4 className="text-sm font-display font-bold text-text-primary">Consensus Clear</h4>
                <p className="text-xs text-text-secondary mt-1">There are no flagged incidents matching selected filters in the queue.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="glass-card rounded-xl border border-border-subtle p-6 space-y-6">
          <div>
            <h3 className="text-base font-display font-bold uppercase tracking-wider text-text-primary">
              Verifier Reputation Rankings
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Top organizational verifiers measured by alignment scores, audit frequencies, and voter trust.
            </p>
          </div>

          <div className="space-y-3">
            {verifiersLeaderboard.map((v) => (
              <div 
                key={v.name} 
                className="p-4 rounded-lg bg-surface/40 hover:bg-surface border border-border-subtle hover:border-border transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Rank circle */}
                  <span className="w-6 font-display font-black text-center text-sm text-text-muted">
                    {v.rank}
                  </span>
                  
                  {/* Avatar */}
                  <img
                    src={v.avatar}
                    alt={v.name}
                    className="w-10 h-10 rounded-full object-cover border border-border-subtle shrink-0"
                  />

                  {/* Profile info */}
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary leading-none">{v.name}</h4>
                    <span 
                      className="text-[9px] font-display font-bold tracking-widest uppercase block mt-1.5"
                      style={{ color: v.color }}
                    >
                      {v.badge} Level
                    </span>
                  </div>
                </div>

                {/* Reputation Score */}
                <div className="text-right">
                  <span className="text-lg font-display font-bold text-accent-primary flex items-center gap-1 justify-end">
                    <ThumbsUp className="w-4 h-4 stroke-[2.5px]" />
                    {v.score}
                  </span>
                  <span className="text-[9px] font-display uppercase tracking-wider text-text-secondary block mt-0.5">Reputation</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
