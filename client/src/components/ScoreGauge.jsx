import React from 'react';

const ScoreGauge = ({ score = 0, size = 160, strokeWidth = 12, label = 'ATS Score', subtitle = 'Readiness Index' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const offset = circumference - (clampedScore / 100) * circumference;

  // Dynamic color palette based on score bracket
  let strokeColor = '#10b981'; // Emerald 500 (80-100)
  let glowColor = 'rgba(16, 185, 129, 0.3)';
  let textColor = 'text-emerald-400';
  let badgeText = 'Strong Match';

  if (clampedScore < 50) {
    strokeColor = '#f43f5e'; // Rose 500
    glowColor = 'rgba(244, 63, 94, 0.3)';
    textColor = 'text-rose-400';
    badgeText = 'Needs Work';
  } else if (clampedScore < 75) {
    strokeColor = '#f59e0b'; // Amber 500
    glowColor = 'rgba(245, 158, 11, 0.3)';
    textColor = 'text-amber-400';
    badgeText = 'Moderate Match';
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center drop-shadow-md"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0px 0px 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Inner Score Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${textColor}`}>
            {clampedScore}
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <div className="text-sm font-semibold text-slate-200">{label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
        <div className="mt-2">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${
              clampedScore >= 75
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : clampedScore >= 50
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {badgeText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
