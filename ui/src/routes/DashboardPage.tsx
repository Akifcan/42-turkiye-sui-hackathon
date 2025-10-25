import { SocialLinksManager } from "../features/athlete/SocialLinksManager";
import { NFTGalleryManager } from "../features/athlete/NFTGalleryManager";
import { Link } from "react-router-dom";

export function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xxl)",
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            color: "var(--color-brand-primary)",
            textDecoration: "none",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          ← Back to Home
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-xxl)",
        }}
      >
        <SocialLinksManager />
        <NFTGalleryManager />
      </div>
    </div>
  );
}
