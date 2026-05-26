import React from 'react';

export const BeamsBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-bg-primary overflow-hidden">
      {/* Spotlight effect */}
      <div 
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-glow rounded-full blur-[160px] pointer-events-none opacity-60 mix-blend-screen"
        style={{
          transform: 'translate(-50%, -20%)',
        }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[140px] pointer-events-none opacity-40 mix-blend-screen"
        style={{
          transform: 'translate(50%, 20%)',
        }}
      />

      {/* Animated Beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="beam2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#6366F1" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Drifting paths */}
          <path d="M-100,-100 L1200,800" stroke="url(#beam1)" strokeWidth="3" strokeDasharray="10 15" fill="none">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="200 200"
              dur="25s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M1400,-100 L200,1000" stroke="url(#beam2)" strokeWidth="2.5" fill="none">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-150 150"
              dur="35s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M-50,300 L1600,400" stroke="url(#beam1)" strokeWidth="1.5" strokeDasharray="5 5" fill="none">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="-100 0"
              to="100 0"
              dur="40s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Subtle overlay grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Actual page contents */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};
