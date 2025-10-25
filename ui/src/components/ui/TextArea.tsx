import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, style, ...props }: TextAreaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
      {label && (
        <label
          style={{
            fontSize: 'var(--font-size-l)',
            fontWeight: '500',
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
        </label>
      )}
      <textarea
        style={{
          padding: 'var(--spacing-s) var(--spacing-m)',
          borderRadius: 'var(--radius-base)',
          border: `1px solid ${error ? 'var(--color-accent-orange)' : 'rgba(0, 0, 0, 0.2)'}`,
          fontSize: 'var(--font-size-l)',
          backgroundColor: 'var(--color-brand-primary)',
          color: 'var(--color-text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          resize: 'vertical',
          fontFamily: 'inherit',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            fontSize: 'var(--font-size-s)',
            color: 'var(--color-accent-orange)',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

