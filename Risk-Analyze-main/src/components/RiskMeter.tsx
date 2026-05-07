import React from 'react';
import { motion } from 'motion/react';

interface RiskMeterProps {
  score: number;
  level: 'Low' | 'Medium' | 'High';
}

export default function RiskMeter({ score, level }: RiskMeterProps) {
  const getColor = () => {
    if (level === 'Low') return 'var(--color-risk-low)';
    if (level === 'Medium') return 'var(--color-risk-med)';
    return 'var(--color-risk-high)';
  };

  const color = getColor();

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="w-[140px] h-[140px] rounded-full border-[10px] border-[#1a1a1c] relative flex flex-col items-center justify-center">
        {/* Progress Gauge Overlay */}
        <svg className="absolute -inset-[10px] w-[140px] h-[140px] transform -rotate-90 overflow-visible">
          <motion.circle
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="70"
            cy="70"
            r="65"
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            style={{ 
              filter: `drop-shadow(0 0 8px ${color})`,
              strokeDasharray: '1'
            }}
          />
        </svg>
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold text-white"
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-text-dim font-bold uppercase tracking-widest">RISK SCORE</span>
        </div>
      </div>
    </div>
  );
}
