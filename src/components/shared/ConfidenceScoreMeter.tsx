import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface ConfidenceScoreMeterProps {
  score: number; // 0 to 100
  size?: number; // size in px
  strokeWidth?: number;
  showLabel?: boolean;
}

export const ConfidenceScoreMeter: React.FC<ConfidenceScoreMeterProps> = ({
  score,
  size = 180,
  strokeWidth = 12,
  showLabel = true,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const controls = useAnimation();

  // Determine colors based on score
  const getColor = (val: number) => {
    if (val >= 90) return '#10B981'; // Emerald
    if (val >= 70) return '#22D3EE'; // Cyan
    if (val >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const getStatusLabel = (val: number) => {
    if (val >= 90) return 'Highly Verified';
    if (val >= 70) return 'Reliable';
    if (val >= 50) return 'Uncertain';
    return 'Likely Hallucinated';
  };

  const currentColor = getColor(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Animate display score count-up
    const start = 0;
    const end = score;
    if (start === end) return;

    const duration = 1.2; // seconds
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor((duration * 1000) / range));
    
    const timer = setInterval(() => {
      current += increment;
      setDisplayScore(current);
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime || 12);

    controls.start({
      strokeDashoffset: circumference - (score / 100) * circumference,
      transition: { duration: 1.2, ease: 'easeOut' },
    });

    return () => clearInterval(timer);
  }, [score, circumference, controls]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Glow effect matching color */}
        <div 
          className="absolute inset-0 rounded-full blur-[24px] opacity-20 pointer-events-none transition-all duration-500"
          style={{ backgroundColor: currentColor }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-border-subtle"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Foreground Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={currentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={controls}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Text readout */}
        <div className="absolute flex flex-col items-center justify-center">
          <span 
            className="text-4xl md:text-5xl font-display font-bold tracking-tight transition-all duration-300"
            style={{ color: currentColor }}
          >
            {displayScore}%
          </span>
          {showLabel && (
            <span className="text-[10px] md:text-xs text-text-secondary uppercase tracking-widest font-display font-medium mt-1">
              Trust Score
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="mt-4 flex flex-col items-center">
          <span 
            className="text-sm font-semibold px-3 py-1 rounded-full bg-surface border border-border-subtle transition-all duration-300"
            style={{ color: currentColor, boxShadow: `0 0 10px 0 ${currentColor}15` }}
          >
            {getStatusLabel(score)}
          </span>
        </div>
      )}
    </div>
  );
};
