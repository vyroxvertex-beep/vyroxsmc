import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark' | 'compact';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'full', 
  className = '', 
  showSubtitle = true 
}) => {
  if (variant === 'mark') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1E2A4A] via-[#1A2133] to-[#0B0F17] border border-[#E5A82B]/40 flex items-center justify-center shadow-lg shadow-[#E5A82B]/10 overflow-hidden group">
          <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#E5A82B]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Precision institutional geometric V and X mark */}
            <path d="M8 9L20 29L32 9" stroke="#E5A82B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 19L26 19" stroke="#3DDC97" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="20" cy="29" r="2.5" fill="#E5A82B" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Mark */}
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1E2A4A] via-[#1A2133] to-[#0F1522] border border-[#E5A82B]/40 flex items-center justify-center shadow-md shadow-[#E5A82B]/10 shrink-0">
        <svg viewBox="0 0 40 40" className="w-5 h-5 text-[#E5A82B]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9L20 29L32 9" stroke="#E5A82B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 19L26 19" stroke="#3DDC97" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="29" r="2.2" fill="#E5A82B" />
        </svg>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-extrabold tracking-wider text-xl text-[#F2F4F8] font-sans">
            VYR<span className="text-[#E5A82B]">OX</span>
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#E5A82B] bg-[#3A2D0C] px-1.5 py-0.5 rounded border border-[#E5A82B]/30 font-semibold">
            SMC
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] tracking-[0.16em] uppercase text-[#9AA6BD] font-medium mt-0.5 font-mono">
            Smart Money Concepts
          </span>
        )}
      </div>
    </div>
  );
};
