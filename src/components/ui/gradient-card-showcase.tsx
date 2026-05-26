import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SkewCardItem {
  title: string;
  desc: string;
  gradientFrom: string;
  gradientTo: string;
  link: string;
}

const defaultPillars: SkewCardItem[] = [
  {
    title: 'Hallucination Check',
    desc: 'Advanced semantic similarity vector models audit completions, flagging claims contradictions and source citation mismatches.',
    gradientFrom: '#22d3ee', // Cyan
    gradientTo: '#3b82f6', // Blue
    link: '/ai-studio',
  },
  {
    title: 'Source Authority',
    desc: 'Verifies reference URL endpoints, status codes, domain credibility, and active SSL validation credentials in real time.',
    gradientFrom: '#10b981', // Emerald
    gradientTo: '#22d3ee', // Cyan
    link: '/verification',
  },
  {
    title: 'Prompt Pruning',
    desc: 'Localized prompt compression caches compress redundancy out of instructions to slash target API expense by up to 35%.',
    gradientFrom: '#f59e0b', // Amber
    gradientTo: '#fb0094', // Pink
    link: '/ai-studio',
  },
  {
    title: 'Consensus Ledger',
    desc: 'Verifier peer-voting consensus registries map compliance telemetry, fully meeting ISO 42001 and EU AI Act auditing standards.',
    gradientFrom: '#6366f1', // Indigo
    gradientTo: '#fb0094', // Pink
    link: '/community',
  },
];

export default function SkewCards() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center flex-wrap py-6 bg-transparent gap-8 md:gap-12 w-full">
      {defaultPillars.map(({ title, desc, gradientFrom, gradientTo, link }, idx) => (
        <div
          key={idx}
          className="group relative w-[280px] h-[360px] md:w-[300px] md:h-[380px] transition-all duration-500"
        >
          {/* Skewed gradient panels */}
          <span
            className="absolute top-0 left-[40px] w-1/2 h-full rounded-xl transform skew-x-[12deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[15px] group-hover:w-[calc(100%-30px)]"
            style={{
              background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
            }}
          />
          <span
            className="absolute top-0 left-[40px] w-1/2 h-full rounded-xl transform skew-x-[12deg] blur-[24px] opacity-70 transition-all duration-500 group-hover:skew-x-0 group-hover:left-[15px] group-hover:w-[calc(100%-30px)] group-hover:opacity-90"
            style={{
              background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
            }}
          />

          {/* Animated float blobs */}
          <span className="pointer-events-none absolute inset-0 z-10">
            <span className="absolute top-0 left-0 w-0 h-0 rounded-full opacity-0 bg-[rgba(255,255,255,0.08)] backdrop-blur-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all duration-300 animate-blob group-hover:top-[-40px] group-hover:left-[40px] group-hover:w-[80px] group-hover:h-[80px] group-hover:opacity-100" />
            <span className="absolute bottom-0 right-0 w-0 h-0 rounded-full opacity-0 bg-[rgba(255,255,255,0.08)] backdrop-blur-[8px] shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all duration-500 animate-blob animation-delay-1000 group-hover:bottom-[-40px] group-hover:right-[40px] group-hover:w-[80px] group-hover:h-[80px] group-hover:opacity-100" />
          </span>

          {/* Glassmorphism content card */}
          <div className="absolute inset-0 z-20 p-6 md:p-8 bg-surface/80 hover:bg-surface/60 border border-border-subtle hover:border-accent-primary/30 backdrop-blur-[12px] shadow-2xl rounded-xl text-text-primary transition-all duration-500 flex flex-col justify-between group-hover:scale-[1.02]">
            <div className="space-y-3">
              <span className="text-[9px] font-display font-bold uppercase tracking-widest text-text-secondary bg-surface-hover/80 px-2 py-0.5 rounded border border-border-subtle">
                PILLAR 0{idx + 1}
              </span>
              <h3 className="text-lg md:text-xl font-display font-bold uppercase leading-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent group-hover:text-white transition-all">
                {title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed font-sans font-medium line-clamp-4">
                {desc}
              </p>
            </div>
            
            <button
              onClick={() => navigate(link)}
              className="inline-flex items-center justify-center text-[10px] font-display font-black uppercase tracking-wider text-bg-primary bg-text-primary hover:bg-accent-primary rounded-lg py-2 px-4 transition-all w-full shadow-lg cursor-pointer"
            >
              Access Tool
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
