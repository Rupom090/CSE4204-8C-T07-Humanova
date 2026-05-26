import React from 'react';
import { cn } from '@/lib/utils';

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<RainbowButtonProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <button 
      className={cn(
        "rainbow-border relative flex items-center justify-center gap-2.5 px-6 bg-black rounded-xl border-none text-white cursor-pointer font-black transition-all duration-200 text-xs font-display uppercase tracking-wider h-10 min-w-[140px] hover:scale-[1.02] active:scale-[0.98] select-none", 
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
