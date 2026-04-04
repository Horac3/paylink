import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-lg border px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            error ? 'border-status-error' : 'border-border'
          } ${className}`}
          {...props}
        />
        {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
        {error && <p className="text-xs text-status-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
