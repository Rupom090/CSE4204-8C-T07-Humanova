import React from 'react';

export const EditorialFrame: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 font-display text-[7px] text-accent-primary/45">
      {/* Top Left Crop Target (Crosshair + Corner Ticks) */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
        <span className="font-bold tracking-tighter">+ Ingest</span>
        <span className="text-text-muted/30">|</span>
        <span className="text-[6px] text-text-muted/40">F.45</span>
      </div>

      {/* Top Right Alignment Mark & Grid Code */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
        <span className="text-[6px] text-text-muted/40 font-mono">REG.MARK //</span>
        <span className="font-black text-accent-primary/60">[ 09-C ]</span>
      </div>

      {/* Bottom Left Printing Press Color Calibration Chips */}
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
        <span className="text-[6px] text-text-muted/40 mr-1">CAL.CHIPS:</span>
        <span className="w-1.5 h-1.5 bg-accent-primary" />
        <span className="w-1.5 h-1.5 bg-accent-secondary" />
        <span className="w-1.5 h-1.5 bg-success" />
        <span className="w-1.5 h-1.5 bg-warning" />
      </div>

      {/* Bottom Right Trim Line & Scale Indicator */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
        <span className="text-[6px] text-text-muted/40">SCALE 1:1.02 //</span>
        <div className="w-6 h-[1px] bg-accent-primary/30" />
      </div>

      {/* Subtle thin corner tick marks */}
      <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t border-l border-accent-primary/30" />
      <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t border-r border-accent-primary/30" />
      <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b border-l border-accent-primary/30" />
      <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b border-r border-accent-primary/30" />
    </div>
  );
};
export default EditorialFrame;
