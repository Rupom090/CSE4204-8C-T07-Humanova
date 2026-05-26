import React from 'react';
import { Cpu } from 'lucide-react';

interface ProviderBadgeProps {
  provider: 'openai' | 'gemini' | 'deepseek';
  model?: string;
  reliability?: number;
  status?: 'operational' | 'degraded' | 'offline';
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({
  provider,
  model,
  reliability,
  status = 'operational',
}) => {
  const getProviderConfig = () => {
    switch (provider) {
      case 'openai':
        return {
          name: 'OpenAI',
          color: 'text-[#10a37f] bg-[#10a37f]/10 border-[#10a37f]/30',
          dot: 'bg-[#10a37f]',
        };
      case 'gemini':
        return {
          name: 'Gemini',
          color: 'text-[#3876e0] bg-[#3876e0]/10 border-[#3876e0]/30',
          dot: 'bg-[#3876e0]',
        };
      case 'deepseek':
        return {
          name: 'DeepSeek',
          color: 'text-[#2e5ef4] bg-[#2e5ef4]/10 border-[#2e5ef4]/30',
          dot: 'bg-[#2e5ef4]',
        };
      default:
        return {
          name: 'Provider',
          color: 'text-text-secondary bg-surface border-border-subtle',
          dot: 'bg-text-secondary',
        };
    }
  };

  const config = getProviderConfig();

  // Status indicator color
  const getStatusColor = () => {
    if (status === 'degraded') return 'bg-warning';
    if (status === 'offline') return 'bg-danger';
    return 'bg-success';
  };

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      {/* Icon logo */}
      <span className="flex items-center gap-1.5">
        <Cpu className="w-3.5 h-3.5" />
        <span className="font-display font-bold">{config.name}</span>
      </span>

      {model && (
        <>
          <span className="w-1 h-1 rounded-full bg-currentopacity-40" />
          <span className="font-mono text-[10px] font-medium tracking-tight text-text-primary">
            {model}
          </span>
        </>
      )}

      {reliability !== undefined && (
        <>
          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
          <span className="text-[10px] font-display text-text-secondary">
            Rel: <strong className="text-text-primary">{reliability}%</strong>
          </span>
        </>
      )}

      {status && (
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`} />
        </span>
      )}
    </div>
  );
};
