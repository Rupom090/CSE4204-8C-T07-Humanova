import React, { useEffect, useRef } from 'react';

interface FactualWaveProps {
  isScanning: boolean;
}

export const FactualWave: React.FC<FactualWaveProps> = ({ isScanning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines (cybernetic layout look)
      ctx.strokeStyle = 'rgba(17, 17, 17, 0.04)';
      ctx.lineWidth = 0.5;

      // Vertical grid lines
      const gridSpacing = 20;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal centerline
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Side grid ticks
      ctx.strokeStyle = 'rgba(234, 28, 36, 0.15)';
      ctx.lineWidth = 1;
      for (let y = 10; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(5, y);
        ctx.lineTo(10, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width - 5, y);
        ctx.lineTo(width - 10, y);
        ctx.stroke();
      }

      // Animate wave variables based on scanning state
      const targetSpeed = isScanning ? 0.35 : 0.05;
      phaseRef.current += targetSpeed;

      const mainAmplitude = isScanning ? height * 0.32 : height * 0.08;
      const noiseAmplitude = isScanning ? height * 0.12 : height * 0.02;

      // Draw Wave 3 (Deep background wave)
      ctx.beginPath();
      ctx.strokeStyle = isScanning ? 'rgba(94, 106, 210, 0.12)' : 'rgba(17, 17, 17, 0.04)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 3 + phaseRef.current * 0.8;
        const noise = Math.sin(angle * 3.5) * noiseAmplitude * 0.5;
        const y = height / 2 + Math.sin(angle) * mainAmplitude * 0.8 + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Wave 2 (Glowing middle-layer wave)
      ctx.beginPath();
      ctx.strokeStyle = isScanning ? 'rgba(234, 28, 36, 0.25)' : 'rgba(234, 28, 36, 0.06)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 4 - phaseRef.current * 1.2;
        const y = height / 2 + Math.cos(angle) * mainAmplitude * 0.5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Wave 1 (Primary active scanning wave)
      ctx.beginPath();
      ctx.strokeStyle = isScanning ? 'rgba(234, 28, 36, 0.85)' : 'rgba(17, 17, 17, 0.25)';
      ctx.lineWidth = isScanning ? 2.5 : 1.2;
      
      // Shadow glow only active during scanning
      if (isScanning) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(234, 28, 36, 0.5)';
      } else {
        ctx.shadowBlur = 0;
      }

      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 2.5 + phaseRef.current;
        // Introduce micro-glitches in wave path when scanning
        let glitch = 0;
        if (isScanning && Math.random() > 0.985) {
          glitch = (Math.random() - 0.5) * 15;
        }
        const y = height / 2 + Math.sin(angle) * mainAmplitude + glitch;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // Draw text indicators on the canvas
      ctx.fillStyle = isScanning ? '#EA1C24' : 'rgba(17, 17, 17, 0.5)';
      ctx.font = 'bold 7px "DM Mono", monospace';
      ctx.fillText(
        isScanning ? 'RESOLVING NODES // SWEEP ACTIVE' : 'FACTUAL RESONANCE: IDLE',
        15,
        15
      );

      ctx.fillStyle = 'rgba(17, 17, 17, 0.4)';
      ctx.fillText(
        isScanning ? 'ATTENUATION: 0.14dB' : 'LATENCY: STANDBY',
        width - 110,
        15
      );

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning]);

  return (
    <div className="relative w-full h-16 bg-[#0D0E16]/3 border border-border-subtle rounded-lg overflow-hidden my-3">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Decorative scanner horizontal laser sweep */}
      {isScanning && (
        <div className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-[#EA1C24] to-transparent animate-pulse"
             style={{
               animation: 'sweep 1.8s linear infinite',
               left: '0%',
             }} 
        />
      )}
      <style>{`
        @keyframes sweep {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
