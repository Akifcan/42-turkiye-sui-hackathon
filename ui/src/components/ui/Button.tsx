import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "accent" | "tab";
  loading?: boolean;
  active?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  active = false,
  style,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "accent":
        return {
          backgroundColor: "var(--color-brand-primary)",
          color: "var(--color-background-base)",
          border: "var(--border-width-none) solid var(--color-brand-primary)",
        };
      case "secondary":
        return {
          backgroundColor: "transparent",
          color: "var(--color-text-primary)",
          border: "var(--border-width-xs) solid var(--color-text-primary)",
        };
      case "tab":
        return {
          background: active ? "rgba(255, 255, 255, 0.9)" : "transparent",
          border: active
            ? "1px solid rgba(255, 255, 255, 0.9)"
            : "1px solid transparent",
          color: active
            ? "var(--color-text-primary)"
            : "var(--color-text-muted)",
          fontWeight: active
            ? "var(--font-weight-bold)"
            : "var(--font-weight-medium)",
          borderRadius: "var(--radius-m)",
          padding: "var(--spacing-s) var(--spacing-m)",
          transition: "all var(--transition-base)",
          boxShadow: active ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        };
      default:
        return {
          backgroundColor: "var(--color-text-primary)",
          color: "var(--color-background-base)",
          border: "var(--border-width-none) solid var(--color-text-primary)",
        };
    }
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        padding: "var(--spacing-s) var(--spacing-m)",
        borderRadius: "var(--radius-m)",
        fontFamily: "var(--font-family-body)",
        fontSize: "var(--font-size-xs)",
        fontWeight: "var(--font-weight-medium)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all var(--transition-base)",
        opacity: disabled || loading ? 0.6 : 1,
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
