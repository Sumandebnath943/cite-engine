import React, { useState } from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  className,
  id,
  value,
  defaultValue,
  rows = 4,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = Boolean(currentValue && String(currentValue).length > 0);
  const isFloated = focused || hasValue;

  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <div className="relative">
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'absolute left-3 pointer-events-none transition-all duration-200 z-10',
              isFloated
                ? 'top-2 text-[10px] font-medium text-indigo-400'
                : 'top-4 text-sm text-white/40'
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          onChange={value === undefined ? (e) => setInternalValue(e.target.value) : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={clsx(
            'w-full bg-bg-elevated border rounded-input text-white',
            'text-sm placeholder-white/30 resize-none',
            'transition-all duration-200 outline-none',
            'px-3',
            label ? 'pt-6 pb-3' : 'py-3',
            error
              ? 'border-danger/50 focus:border-danger focus:shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
              : 'border-white/8 focus:border-indigo-500/60 focus:shadow-[0_0_0_2px_rgba(99,102,241,0.12)]'
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger pl-1">{error}</p>}
      {hint && !error && <p className="text-xs text-white/35 pl-1">{hint}</p>}
    </div>
  );
};
