import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "var(--spacing-xl)",
      }}
    >
      <Card>
        <div
          style={{
            textAlign: "center",
            padding: "var(--spacing-xl)",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "var(--font-family-heading)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-m)",
            }}
          >
            404
          </h1>

          <p
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-family-body)",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            Profile not found. This athlete doesn't exist yet.
          </p>

          <Link to="/">
            <button
              style={{
                padding: "var(--spacing-m) var(--spacing-l)",
                backgroundColor: "var(--color-brand-primary)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-m)",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
                fontWeight: "var(--font-weight-medium)",
                cursor: "pointer",
              }}
            >
              Go Home
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
