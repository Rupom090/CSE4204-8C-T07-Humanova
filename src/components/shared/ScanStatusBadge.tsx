import React from 'react';
import { Loader2, CheckCircle2, AlertOctagon, Clock } from 'lucide-react';

interface ScanStatusBadgeProps {
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

export const ScanStatusBadge: React.FC<ScanStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'queued':
        return {
          label: 'Queued',
          color: 'text-info bg-info/10 border-info/30',
          icon: <Clock className="w-3.5 h-3.5" />,
          dot: 'bg-info',
        };
      case 'processing':
        return {
          label: 'Processing',
          color: 'text-warning bg-warning/10 border-warning/30',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
          dot: 'bg-warning animate-pulse',
        };
      case 'completed':
        return {
          label: 'Verified',
          color: 'text-success bg-success/10 border-success/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          dot: 'bg-success',
        };
      case 'failed':
        return {
          label: 'Failed',
          color: 'text-danger bg-danger/10 border-danger/30',
          icon: <AlertOctagon className="w-3.5 h-3.5" />,
          dot: 'bg-danger',
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-text-secondary bg-surface border-border-subtle',
          icon: null,
          dot: 'bg-text-secondary',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${config.color}`}>
      {config.icon}
      <span>{config.label}</span>
      {status === 'processing' && (
        <span className="relative flex h-1.5 w-1.5 ml-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-warning"></span>
        </span>
      )}
    </div>
  );
};
