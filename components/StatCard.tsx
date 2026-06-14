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
  subLabelClassName?: string;
  subValueClassName?: string;
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
  subLabelClassName = "opacity-75",
  subValueClassName = "font-bold",
}) => {
  return (
    <div 
      className={`
        relative p-4 rounded-xl border transition-all duration-300 shadow-sm flex flex-col justify-between
        ${colorStyles[accentColor]}
        ${highlight ? 'shadow-md ring-1 ring-offset-1 ring-emerald-500/20' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-75">{title}</h3>
        {icon && <div className="p-1.5 bg-white/40 rounded-md scale-90">{icon}</div>}
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl md:text-2xl font-black tracking-tight">{mainValue}</span>
          {mainLabel && <span className="text-[10px] font-bold opacity-75 uppercase">{mainLabel}</span>}
        </div>

        {(subValue || extraValue) && (
          <div className="mt-2 pt-2 border-t border-black/5 flex flex-col gap-1 text-[11px]">
            {subValue && (
              <div className="flex justify-between items-center">
                <span className={subLabelClassName}>{subLabel}</span>
                <span className={subValueClassName}>{subValue}</span>
              </div>
            )}
            {extraValue && (
              <div className="flex justify-between items-center">
                <span className="opacity-75">{extraLabel}</span>
                <span className="font-bold">{extraValue}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};