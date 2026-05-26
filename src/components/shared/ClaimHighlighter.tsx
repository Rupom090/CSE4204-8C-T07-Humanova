import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, AlertTriangle, AlertOctagon, ExternalLink } from 'lucide-react';
import { Claim } from '@/types';

interface ClaimHighlighterProps {
  text: string;
  claims: Claim[];
}

export const ClaimHighlighter: React.FC<ClaimHighlighterProps> = ({ text, claims }) => {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  // Parse text and claims into interactive HTML
  // To keep it clean and robust, we sort claims by index or match exact substrings.
  // We can do a smart substring replacement or split based on claim texts.
  const renderHighlightedText = () => {
    if (!claims || claims.length === 0) return <p className="text-text-primary leading-relaxed whitespace-pre-wrap">{text}</p>;

    // We want to sort claims by their appearance in text to prevent overlapping issues
    const sortedClaims = [...claims].sort((a, b) => {
      const idxA = text.indexOf(a.text);
      const idxB = text.indexOf(b.text);
      return idxA - idxB;
    });

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedClaims.forEach((claim) => {
      const claimIndex = text.indexOf(claim.text, lastIndex);
      if (claimIndex === -1) return; // not found

      // Append text before claim
      if (claimIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`} className="text-text-primary leading-relaxed whitespace-pre-wrap">
            {text.substring(lastIndex, claimIndex)}
          </span>
        );
      }

      // Determine claim colors
      let underlineColor = 'border-success decoration-success hover:bg-success/5';
      if (claim.category === 'uncertain') {
        underlineColor = 'border-warning decoration-warning hover:bg-warning/5';
      } else if (claim.category === 'hallucinated') {
        underlineColor = 'border-danger decoration-danger hover:bg-danger/5';
      }

      // Append interactive highlighted claim span
      elements.push(
        <motion.span
          key={`claim-${claim.id}`}
          onClick={() => setSelectedClaim(claim)}
          className={`cursor-pointer border-b-2 border-dotted pb-0.5 font-medium transition-all duration-200 decoration-skip-ink-none ${underlineColor}`}
          whileHover={{ scale: 1.01 }}
          layoutId={`highlight-${claim.id}`}
        >
          {claim.text}
        </motion.span>
      );

      lastIndex = claimIndex + claim.text.length;
    });

    // Append remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${lastIndex}`} className="text-text-primary leading-relaxed whitespace-pre-wrap">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return <div className="leading-relaxed font-sans">{elements}</div>;
  };

  return (
    <div className="relative">
      {renderHighlightedText()}

      {/* Side Slide-out Drawer for Claim Details */}
      <AnimatePresence>
        {selectedClaim && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClaim(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-secondary border-l border-border-subtle z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
                  <h3 className="text-lg font-display font-semibold flex items-center gap-2">
                    {selectedClaim.category === 'verified' && <ShieldCheck className="text-success w-5 h-5" />}
                    {selectedClaim.category === 'uncertain' && <AlertTriangle className="text-warning w-5 h-5" />}
                    {selectedClaim.category === 'hallucinated' && <AlertOctagon className="text-danger w-5 h-5" />}
                    Claim Verification
                  </h3>
                  <button
                    onClick={() => setSelectedClaim(null)}
                    className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent hover:border-border-subtle transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Claim Statement */}
                <div className="mb-6">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-display font-semibold">Claimed Statement</span>
                  <div className="p-4 bg-surface rounded-lg border border-border-subtle mt-2 font-medium">
                    "{selectedClaim.text}"
                  </div>
                </div>

                {/* Verification Rating */}
                <div className="mb-6">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-display font-semibold">Status Rating</span>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-3xl font-display font-bold" style={{
                      color: selectedClaim.category === 'verified' ? '#10B981' : selectedClaim.category === 'uncertain' ? '#F59E0B' : '#EF4444'
                    }}>
                      {selectedClaim.score}%
                    </div>
                    <div>
                      <div className="font-semibold text-sm capitalize">{selectedClaim.category}</div>
                      <div className="text-xs text-text-secondary">Based on similarity and source integrity metrics.</div>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mb-6">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-display font-semibold">Audit Details</span>
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                    {selectedClaim.details}
                  </p>
                </div>

                {/* Evidence Sources */}
                <div className="mb-6">
                  <span className="text-xs text-text-muted uppercase tracking-wider font-display font-semibold">Evidence Citations</span>
                  {selectedClaim.evidence && selectedClaim.evidence.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {selectedClaim.evidence.map((src) => (
                        <div key={src.id} className="p-3 bg-surface hover:bg-surface-hover rounded-lg border border-border-subtle transition-all flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-text-primary line-clamp-1">{src.title}</span>
                            <a href={src.url} target="_blank" rel="noreferrer" className="text-accent-primary hover:text-cyan-300">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-text-secondary mt-1">
                            <span className="flex items-center gap-1">
                              Authority: <strong className="text-text-primary">{src.authorityScore}%</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              Retrieval: <strong className="text-text-primary">{src.retrievalScore}%</strong>
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                              src.trustRating === 'high' ? 'bg-success/15 text-success' : src.trustRating === 'medium' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'
                            }`}>
                              {src.trustRating} Trust
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-text-muted italic mt-2">No citation evidence could be retrieved.</div>
                  )}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4 mt-6">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="w-full py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-center text-sm font-semibold text-text-primary transition-all cursor-pointer"
                >
                  Dismiss Audit Details
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
