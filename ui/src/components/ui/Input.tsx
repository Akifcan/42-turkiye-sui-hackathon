import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
      {label && (
        <label
          style={{
            fontSize: 'var(--font-size-small)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          padding: 'var(--spacing-s) var(--spacing-m)',
          borderRadius: 'var(--radius-s)',
          border: `var(--border-width-none) solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          fontSize: 'var(--font-size-body)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          transition: 'border-color var(--transition-base)',
          fontFamily: 'var(--font-family-body)',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            fontSize: 'var(--font-size-small)',
            color: 'var(--color-error)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

