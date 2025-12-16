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
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder = "0.00",
  helperText,
  step = "0.01"
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-400 font-medium z-10 select-none">
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
            w-full bg-white border border-slate-300 rounded-lg py-2.5 
            ${prefix ? 'pl-9' : 'pl-3'} 
            ${suffix ? 'pr-9' : 'pr-3'} 
            text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition-all outline-none shadow-sm placeholder:font-normal
          `}
        />
        {suffix && (
          <span className="absolute right-3 text-slate-400 font-medium select-none">
            {suffix}
          </span>
        )}
      </div>
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};