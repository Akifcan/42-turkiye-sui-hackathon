import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Card({ children, style, className = '' }: CardProps) {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: 'var(--color-brand-primary)',
        borderRadius: 'var(--radius-base)',
        padding: 'var(--spacing-xl)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

