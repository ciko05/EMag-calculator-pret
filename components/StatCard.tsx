import React from 'react';

interface StatCardProps {
  title: string;
  mainValue: string;
  mainLabel?: string;
  subValue?: string;
  subLabel?: string;
  extraValue?: string;
  extraLabel?: string;
  icon?: React.ReactNode;
  accentColor?: 'blue' | 'green' | 'red' | 'amber' | 'slate';
  highlight?: boolean;
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  slate: 'bg-white text-slate-800 border-slate-200',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  mainValue,
  mainLabel,
  subValue,
  subLabel,
  extraValue,
  extraLabel,
  icon,
  accentColor = 'slate',
  highlight = false,
}) => {
  return (
    <div 
      className={`
        relative p-6 rounded-2xl border transition-all duration-300 shadow-sm
        ${colorStyles[accentColor]}
        ${highlight ? 'shadow-md ring-2 ring-offset-2 ring-emerald-500/20' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">{title}</h3>
        {icon && <div className="p-2 bg-white/50 rounded-lg">{icon}</div>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight">{mainValue}</span>
          {mainLabel && <span className="text-sm font-medium opacity-70">{mainLabel}</span>}
        </div>

        {(subValue || extraValue) && (
          <div className="mt-4 pt-4 border-t border-black/5 flex flex-col gap-2">
            {subValue && (
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">{subLabel}</span>
                <span className="font-semibold">{subValue}</span>
              </div>
            )}
            {extraValue && (
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-70">{extraLabel}</span>
                <span className="font-semibold">{extraValue}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};