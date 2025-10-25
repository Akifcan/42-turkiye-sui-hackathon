import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'accent':
        return {
          backgroundColor: 'var(--color-accent-cyan)',
          color: 'var(--color-brand-primary)',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          border: '2px solid var(--color-text-primary)',
        };
      default:
        return {
          backgroundColor: 'var(--color-text-primary)',
          color: 'var(--color-brand-primary)',
        };
    }
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        padding: 'var(--spacing-s) var(--spacing-xl)',
        borderRadius: 'var(--radius-base)',
        border: 'none',
        fontSize: 'var(--font-size-l)',
        fontWeight: '600',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled || loading ? 0.6 : 1,
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

