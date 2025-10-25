import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, style, ...props }: TextAreaProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xs)",
      }}
    >
      {label && (
        <label
          style={{
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          {label}
        </label>
      )}
      <textarea
        style={{
          padding: "var(--spacing-s) var(--spacing-m)",
          borderRadius: "var(--radius-s)",
          border: `var(--border-width-none) solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
          fontSize: "var(--font-size-body)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-primary)",
          outline: "none",
          transition: "border-color var(--transition-base)",
          resize: "vertical",
          fontFamily: "var(--font-family-body)",
          ...style,
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            fontSize: "var(--font-size-small)",
            color: "var(--color-error)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
