import React, { useEffect, useState, useRef } from 'react';

interface CipherHeadlineProps {
  text: string;
  className?: string;
}

export const CipherHeadline: React.FC<CipherHeadlineProps> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const [triggered, setTriggered] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*-+=';
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (triggered) {
      let iteration = 0;
      clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " " || char === "\n") return char;
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        
        if (iteration >= text.length) {
          clearInterval(intervalRef.current);
        }
        
        iteration += 1 / 3; // Fluid scrambling speed
      }, 25);
    }
    return () => clearInterval(intervalRef.current);
  }, [text, triggered]);

  return (
    <span ref={containerRef} className={`${className} inline-block`} style={{ contentVisibility: 'auto' }}>
      {displayText}
    </span>
  );
};
