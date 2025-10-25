import { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Card({ children, style, className = "" }: CardProps) {
  return (
    <div
      className={`card ${className}`}
      style={{
        position: "relative",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px) saturate(200%)",
        WebkitBackdropFilter: "blur(20px) saturate(200%)",
        borderRadius: "var(--radius-m)",
        padding: "var(--spacing-xl)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: `
          0 8px 32px 0 rgba(104, 184, 215, 0.2),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
          0 4px 16px 0 rgba(255, 255, 255, 0.1)
        `,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Liquid glass shimmer effect */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)",
          pointerEvents: "none",
          opacity: 0.6,
          transform: "rotate(45deg)",
        }}
      />

      {/* Top glass shine */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>

      {/* Bottom liquid reflection */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(to top, rgba(104, 184, 215, 0.15) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
