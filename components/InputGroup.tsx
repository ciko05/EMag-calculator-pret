import React from 'react';

interface InputGroupProps {
  label: string;
  value: number | '';
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  helperText?: string;
  step?: string;
  enableSlider?: boolean;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder = "0.00",
  helperText,
  step = "0.01",
  enableSlider = false,
  sliderMin = 0,
  sliderMax = 100,
  sliderStep = 1
}) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      <div className="flex justify-between items-baseline">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
      </div>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-2.5 text-slate-400 font-medium text-xs z-10 select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min="0"
          className={`
            w-full bg-white border border-slate-200 rounded-lg py-1.5 text-sm
            ${prefix ? 'pl-7' : 'pl-2.5'} 
            ${suffix ? 'pr-7' : 'pr-2.5'} 
            text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all outline-none shadow-sm placeholder:font-normal placeholder:text-slate-300
          `}
        />
        {suffix && (
          <span className="absolute right-2.5 text-slate-400 text-xs font-medium select-none">
            {suffix}
          </span>
        )}
      </div>
      
      {enableSlider && (
        <div className="mt-1 px-0.5">
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={value === '' ? 0 : value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{helperText}</p>}
    </div>
  );
};