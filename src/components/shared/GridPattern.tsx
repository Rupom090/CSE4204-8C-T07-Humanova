import React from 'react';

interface GridPatternProps {
  type?: 'dots' | 'grid';
  className?: string;
}

export const GridPattern: React.FC<GridPatternProps> = ({ type = 'dots', className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none -z-10 overflow-hidden ${className}`}>
      {type === 'dots' ? (
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(var(--text-secondary) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      ) : (
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--text-secondary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--text-secondary) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      )}
      {/* Dynamic gradient fading to edges */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,var(--bg-primary)_90%]" />
    </div>
  );
};
