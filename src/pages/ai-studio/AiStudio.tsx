import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Check, ShieldAlert, FileText, Code } from 'lucide-react';
import { useScanStore } from '@/stores/scanStore';
import { useUiStore } from '@/stores/uiStore';
import { useProviderStore } from '@/stores/providerStore';
import { apiService } from '@/services/api';

export const AiStudio: React.FC = () => {
  const navigate = useNavigate();
  const { startScan, isScanning } = useScanStore();
  const { addNotification } = useUiStore();
  const { providers } = useProviderStore();

  const [prompt, setPrompt] = useState('Explain the environmental impact of training GPT-4.');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [savings, setSavings] = useState<number | null>(null);

  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'gemini' | 'deepseek'>('openai');
  const [enhancementMode, setEnhancementMode] = useState<'Professional' | 'Concise' | 'Research' | 'Structured' | 'Enterprise'>('Research');
  const [responseMode, setResponseMode] = useState<'Concise' | 'Balanced' | 'Detailed'>('Detailed');

  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;

    setIsEnhancing(true);
    try {
      addNotification('Running LLM semantic optimizer on prompt...', 'info');
      const res = await apiService.enhancePrompt(prompt, enhancementMode);
      setEnhancedPrompt(res.enhancedPrompt);
      setSavings(res.savings);
      addNotification('Prompt optimization complete!', 'success');
    } catch (err) {
      addNotification('Prompt enhancement failed.', 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if ((!prompt.trim() && !enhancedPrompt.trim()) || isGenerating) return;

    setIsGenerating(true);
    setAiResponse('');
    setScanResult(null);

    const activePrompt = enhancedPrompt || prompt;
    const model = selectedProvider === 'openai' ? 'GPT-4o' : selectedProvider === 'gemini' ? 'Gemini 1.5 Pro' : 'DeepSeek V3';

    try {
      addNotification(`Generating response using ${model}...`, 'info');
      const scan = await startScan(activePrompt, selectedProvider, model);
      
      // Simulate typing output stream
      let index = 0;
      const textToType = scan.response;
      const interval = setInterval(() => {
        setAiResponse((prev) => prev + textToType.charAt(index));
        index++;
        if (index >= textToType.length) {
          clearInterval(interval);
          setScanResult(scan);
          setIsGenerating(false);
          addNotification('Response generation and claim mapping complete!', 'success');
        }
      }, 10);
    } catch (err) {
      addNotification('Response generation failed.', 'error');
      setIsGenerating(false);
    }
  };

  const handleVerify = () => {
    if (!scanResult) return;
    navigate(`/verification/${scanResult.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary">
          AI Studio
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Optimize, test, and audit prompts inside a secure, sandboxed alignment and verification playground.
        </p>
      </div>

      {/* Main Split Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Panel: Prompt Editor & Configs */}
        <div className="glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-text-muted">
                Prompt Workspace
              </span>
              <span className="text-[10px] text-text-muted font-mono">
                {prompt.length} chars
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-bg-primary/50 focus:bg-bg-primary border border-border-subtle focus:border-accent-primary focus:ring-1 focus:ring-accent-glow focus:outline-none transition-all rounded-lg p-4 text-sm text-text-primary placeholder:text-text-muted font-sans font-medium"
              rows={6}
              placeholder="Enter your system prompt query here..."
            />

            {/* Mode selection pills */}
            <div>
              <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted mb-2 block">
                Optimizer Focus
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['Professional', 'Concise', 'Research', 'Structured', 'Enterprise'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setEnhancementMode(mode)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer border ${
                      enhancementMode === mode 
                        ? 'bg-surface text-accent-primary border-accent-primary' 
                        : 'bg-transparent text-text-secondary border-border-subtle hover:border-border hover:text-text-primary'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Engine Provider Selection cards */}
            <div className="grid grid-cols-3 gap-3">
              {providers.map((p) => {
                const isSelected = selectedProvider === p.id;
                let activeDotColor = 'bg-success';
                if (p.status === 'degraded') activeDotColor = 'bg-warning';
                if (p.status === 'offline') activeDotColor = 'bg-danger';

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p.id)}
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-surface border-accent-primary shadow-lg shadow-accent-glow' 
                        : 'bg-transparent border-border-subtle hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-display font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                        {p.name.split(' ')[0]}
                      </span>
                      <span className="flex h-2 w-2 relative shrink-0">
                        {p.status === 'operational' && isSelected && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${activeDotColor}`} />
                      </span>
                    </div>
                    <span className="text-[9px] text-text-muted font-display uppercase tracking-wider mt-3 font-semibold block">
                      Rel: {p.reliability}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border-subtle pt-4 flex gap-4">
            <button
              onClick={handleEnhancePrompt}
              disabled={isEnhancing || !prompt.trim()}
              className="flex-1 py-2 px-4 rounded-lg bg-surface hover:bg-surface-hover border border-border hover:border-accent-primary text-xs font-display font-black uppercase tracking-wider text-text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
              {isEnhancing ? 'Optimizing...' : 'Enhance Prompt'}
            </button>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || isScanning || (!prompt.trim() && !enhancedPrompt.trim())}
              className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-accent-secondary to-accent-primary hover:brightness-110 text-bg-primary text-xs font-display font-black uppercase tracking-wider shadow-lg shadow-accent-glow flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              Generate & Verify
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Panel: Output & Diff Viewer */}
        <div className="glass-card p-6 rounded-xl border border-border-subtle flex flex-col justify-between space-y-6">
          <div className="space-y-6 flex-1 flex flex-col">
            
            {/* Optimized prompt diff overlay if enhanced */}
            {enhancedPrompt && (
              <div className="space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-text-muted">
                    Optimized Prompt Result
                  </span>
                  {savings !== null && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-accent-primary bg-accent-glow px-2 py-0.5 rounded-full border border-accent-primary/20 uppercase tracking-widest font-display">
                      <Zap className="w-3 h-3 fill-current" /> {savings}% Token Reduction
                    </span>
                  )}
                </div>
                <div className="p-3 bg-bg-primary/45 rounded-lg border border-border-subtle text-xs leading-relaxed text-text-secondary max-h-24 overflow-y-auto">
                  <span className="text-success font-semibold mr-1">[OPTIMIZED]</span> {enhancedPrompt}
                </div>
              </div>
            )}

            {/* Main AI Generation Output Terminal */}
            <div className="flex-1 flex flex-col min-h-[250px] relative">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-text-muted mb-2 block shrink-0">
                Sandboxed Engine Response
              </span>

              <div className="flex-1 bg-bg-primary border border-border-subtle rounded-lg p-4 font-sans text-sm text-text-primary leading-relaxed overflow-y-auto relative whitespace-pre-wrap select-text">
                {isGenerating && !aiResponse && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-bg-primary/80 backdrop-blur-sm rounded-lg">
                    <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
                    <span className="text-xs font-display text-text-secondary uppercase tracking-widest animate-pulse font-medium">Scrutinizing sources...</span>
                  </div>
                )}
                
                {aiResponse ? (
                  aiResponse
                ) : (
                  !isGenerating && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-text-muted p-6 italic">
                      Configure your prompt options and click "Generate & Verify" to see live, audited LLM responses here.
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Bottom Verification overlay card if scan completed */}
          {scanResult && (
            <div className="mt-4 p-4 rounded-lg bg-accent-glow/5 border border-accent-primary/20 flex items-center justify-between gap-4 shrink-0 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface border border-accent-primary/20">
                  <ShieldAlert className="w-5 h-5 text-accent-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-display font-semibold text-text-primary">Claims Audited & Keyed</h4>
                  <p className="text-[10px] text-text-secondary">Scan confidence score evaluated at <strong className="text-accent-primary">{scanResult.confidenceScore}%</strong></p>
                </div>
              </div>
              <button
                onClick={handleVerify}
                className="py-1.5 px-3.5 rounded-lg bg-accent-primary hover:bg-cyan-300 text-bg-primary text-xs font-display font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                Inspect Results
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
