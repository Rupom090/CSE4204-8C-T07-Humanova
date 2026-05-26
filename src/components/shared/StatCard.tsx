import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { EditorialFrame } from './EditorialFrame';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  accentColor?: string; // e.g. '#22D3EE', '#10B981', '#F59E0B', '#EF4444'
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendDirection = 'neutral',
  icon,
  accentColor = '#22D3EE',
}) => {
  return (
    <div className="group relative glass-card p-6 rounded-xl border border-border-subtle hover:border-border transition-all duration-300 hover:shadow-2xl overflow-hidden cursor-default">
      {/* Editorial print crosshairs and crop alignment markers */}
      <EditorialFrame />

      {/* Accent glow line at the top */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-all duration-300"
        style={{ backgroundColor: accentColor }}
      />

      {/* Radial Hover glow */}
      <div 
        className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-[48px] opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between">
        {/* Left column */}
        <div className="space-y-3">
          <span className="text-xs font-display font-medium tracking-wider text-text-secondary uppercase">
            {label}
          </span>
          <h3 className="text-3xl font-display font-bold text-text-primary tracking-tight">
            {value}
          </h3>
        </div>

        {/* Right column (Icon) */}
        <div 
          className="p-3 rounded-lg border transition-all duration-300"
          style={{ 
            borderColor: `${accentColor}25`,
            backgroundColor: `${accentColor}10`,
            color: accentColor,
            boxShadow: `0 0 12px -3px ${accentColor}15`
          }}
        >
          {icon}
        </div>
      </div>

      {/* Trend indicator footer */}
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {trendDirection === 'up' && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-success/15 text-success font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {trend}
            </span>
          )}
          {trendDirection === 'down' && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-danger/15 text-danger font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {trend}
            </span>
          )}
          {trendDirection === 'neutral' && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-surface border border-border-subtle text-text-secondary font-medium">
              {trend}
            </span>
          )}
          <span className="text-text-muted">vs last period</span>
        </div>
      )}
    </div>
  );
};
