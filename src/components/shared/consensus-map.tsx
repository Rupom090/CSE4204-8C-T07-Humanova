import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Activity, Zap, CheckCircle2 } from 'lucide-react';

interface VerifierNode {
  id: string;
  name: string;
  latency: string;
  weight: string;
  trust: string;
  status: string;
  color: string;
  glowColor: string;
  description: string;
  position: { x: number; y: number };
}

const nodes: VerifierNode[] = [
  {
    id: 'openai',
    name: 'OpenAI Auditor Node',
    latency: '14ms',
    weight: '85%',
    trust: '98.2%',
    status: 'Operational',
    color: '#ea1c24', // Crimson Accent
    glowColor: 'rgba(234, 28, 36, 0.25)',
    description: 'Executes rapid semantic extraction, classification, and strict incident moderation.',
    position: { x: 25, y: 25 }
  },
  {
    id: 'gemini',
    name: 'Gemini Auditor Node',
    latency: '12ms',
    weight: '90%',
    trust: '99.4%',
    status: 'Operational',
    color: '#10B981', // Emerald
    glowColor: 'rgba(16, 185, 129, 0.25)',
    description: 'Validates source citation pathways and parses structure matching guidelines.',
    position: { x: 75, y: 25 }
  },
  {
    id: 'deepseek',
    name: 'DeepSeek Auditor Node',
    latency: '18ms',
    weight: '75%',
    trust: '96.8%',
    status: 'Operational',
    color: '#111111', // Bold Black
    glowColor: 'rgba(17, 17, 17, 0.25)',
    description: 'Scores vector-space embeddings and measures factual alignment indices.',
    position: { x: 50, y: 75 }
  }
];

export const ConsensusMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<VerifierNode | null>(nodes[0]);
  const [activePulse, setActivePulse] = useState(0);

  useEffect(() => {
    const handle = setInterval(() => {
      setActivePulse(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(handle);
  }, []);

  return (
    <div className="relative w-full max-w-[500px] mx-auto aspect-[4/3] bg-white/70 border border-border-subtle rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-sm">
      {/* Background grid canvas texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,17,17,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      
      {/* Connecting vector wires */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-border stroke-[1.5] opacity-35">
        <line x1="25%" y1="25%" x2="50%" y2="50%" />
        <line x1="75%" y1="25%" x2="50%" y2="50%" />
        <line x1="50%" y1="75%" x2="50%" y2="50%" />
      </svg>
      
      {/* Top dashboard title bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-border-subtle pb-3">
        <span className="text-[9px] font-display font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-accent-primary animate-pulse" /> Consensus Network Map
        </span>
        <span className="text-[9px] font-display font-bold uppercase text-success flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Consensus Secured
        </span>
      </div>

      {/* Interactive central nodes */}
      <div className="relative w-full h-[180px] flex items-center justify-center">
        {/* Consensus Hub center target */}
        <div className="absolute w-12 h-12 rounded-full border-2 border-dashed border-accent-primary/30 flex items-center justify-center bg-[#FAF8F5]">
          <div className="w-6 h-6 rounded-full bg-accent-glow border border-accent-primary flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-primary" />
          </div>
          {/* Glowing pulse rings */}
          <span className="absolute inset-0 rounded-full border border-accent-primary/20 animate-ping opacity-60" />
        </div>

        {/* Auditor Nodes mapper */}
        {nodes.map((node, i) => {
          const isSelected = selectedNode?.id === node.id;
          const isPulsing = activePulse === i;

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="absolute group transition-all duration-300 z-10 flex flex-col items-center gap-1.5 focus:outline-none"
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Floating outer nodes */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 transition-all duration-300 shadow-md cursor-pointer"
                style={{
                  borderColor: isSelected ? node.color : 'var(--border)',
                  boxShadow: isSelected || isPulsing ? `0 0 15px 4px ${node.glowColor}` : '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              >
                <Cpu 
                  className="w-4 h-4 transition-transform group-hover:scale-110" 
                  style={{ color: node.id === 'deepseek' && !isSelected ? 'var(--text-primary)' : node.color }} 
                />
              </div>
              
              {/* Minimalist monospaced node details label */}
              <span className="text-[8px] font-display font-black uppercase tracking-wider bg-white/95 px-2 py-0.5 rounded border border-border-subtle shadow-sm pointer-events-none select-none">
                {node.id === 'openai' ? 'OpenAI' : node.id === 'gemini' ? 'Gemini' : 'DeepSeek'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Details inspector card */}
      <div className="relative z-10 min-h-[90px] bg-[#FAF8F5]/80 backdrop-blur border border-border-subtle rounded-xl p-3.5 flex flex-col justify-between shadow-inner">
        <AnimatePresence mode="wait">
          {selectedNode ? (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-1.5 text-left h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-display font-black uppercase tracking-wider text-text-primary">
                  {selectedNode.name}
                </span>
                <span 
                  className="text-[8px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                  style={{
                    color: selectedNode.id === 'deepseek' ? 'var(--text-primary)' : selectedNode.color,
                    borderColor: selectedNode.id === 'deepseek' ? 'var(--border)' : selectedNode.color + '40',
                    backgroundColor: selectedNode.id === 'deepseek' ? 'var(--surface-hover)' : selectedNode.color + '08'
                  }}
                >
                  {selectedNode.latency} Latency
                </span>
              </div>
              
              <p className="text-[10px] leading-relaxed text-text-secondary font-sans font-medium">
                {selectedNode.description}
              </p>

              <div className="flex items-center gap-4 pt-1.5 border-t border-border-subtle/40 text-[8px] font-display font-bold text-text-muted">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-accent-primary" /> Factual Weight: <strong className="text-text-primary">{selectedNode.weight}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-success" /> Trust Score: <strong className="text-text-primary">{selectedNode.trust}</strong>
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center text-center h-full text-[10px] font-display font-bold text-text-muted">
              Select any active verifier node above to inspect live consensus weights.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
