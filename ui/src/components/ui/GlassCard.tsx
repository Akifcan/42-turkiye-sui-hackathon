import { CSSProperties, ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function GlassCard({ children, style, className = '' }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px) saturate(200%)',
        WebkitBackdropFilter: 'blur(20px) saturate(200%)',
        borderRadius: 'var(--radius-m)',
        padding: 'var(--spacing-xl)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: `
          0 8px 32px 0 rgba(104, 184, 215, 0.2),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
          0 4px 16px 0 rgba(255, 255, 255, 0.1)
        `,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `
          0 16px 48px 0 rgba(104, 184, 215, 0.3),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.4),
          0 8px 24px 0 rgba(255, 255, 255, 0.15)
        `;
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `
          0 8px 32px 0 rgba(104, 184, 215, 0.2),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
          0 4px 16px 0 rgba(255, 255, 255, 0.1)
        `;
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
      }}
    >
      {/* Liquid glass shimmer effect */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
          pointerEvents: 'none',
          opacity: 0.6,
          transform: 'rotate(45deg)',
        }}
      />
      
      {/* Top glass shine */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      
      {/* Bottom liquid reflection */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(104, 184, 215, 0.15) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

