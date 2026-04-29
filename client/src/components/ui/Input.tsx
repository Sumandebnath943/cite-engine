import React, { useState } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  iconRight,
  className,
  id,
  value,
  defaultValue,
  placeholder,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = Boolean(currentValue && String(currentValue).length > 0);
  const isFloated = focused || hasValue;

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <div className="relative">
        {/* Floating Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'absolute left-3 pointer-events-none transition-all duration-200 z-10',
              icon && 'left-10',
              isFloated
                ? 'top-2 text-[10px] font-medium text-indigo-400'
                : 'top-1/2 -translate-y-1/2 text-sm text-white/40'
            )}
          >
            {label}
          </label>
        )}

        {/* Left Icon */}
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 flex items-center z-10">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          placeholder={label ? undefined : placeholder}
          onChange={value === undefined ? (e) => setInternalValue(e.target.value) : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={clsx(
            'w-full bg-bg-elevated border rounded-input text-white',
            'text-sm placeholder-white/30',
            'transition-all duration-200',
            'outline-none',
            icon ? 'pl-10' : 'pl-3',
            iconRight ? 'pr-10' : 'pr-3',
            label ? 'pt-5 pb-2' : 'py-3',
            error
              ? 'border-danger/50 focus:border-danger focus:shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
              : 'border-white/8 focus:border-indigo-500/60 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.12)]'
          )}
          {...props}
        />

        {/* Right Icon */}
        {iconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 flex items-center">
            {iconRight}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-danger pl-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-white/35 pl-1">{hint}</p>
      )}
    </div>
  );
};
