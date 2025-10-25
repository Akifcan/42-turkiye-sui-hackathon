import { useTopSupporters } from "../../hooks/useTopSupporters";
import { Card } from "../../components/ui";

interface TopSupportersProps {
  profileOwnerAddress: string | null;
}

const TopSupporters: React.FC<TopSupportersProps> = ({
  profileOwnerAddress,
}) => {
  const { supporters, isLoading, error } =
    useTopSupporters(profileOwnerAddress);

  return (
    <Card>
      <h3
        style={{
          margin: "0 0 var(--spacing-m) 0",
          color: "var(--color-text-primary)",
        }}
      >
        Top Supporters
      </h3>
      {isLoading && (
        <p style={{ color: "var(--color-text-secondary)" }}>
          Loading supporters...
        </p>
      )}
      {error && (
        <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
          💡 Supporter leaderboard coming soon! (Smart contract module pending)
        </p>
      )}
      {!isLoading && !error && supporters.length === 0 && (
        <p style={{ color: "var(--color-text-secondary)" }}>
          🏆 Support this athlete to appear on the leaderboard!
        </p>
      )}
      {!isLoading && !error && supporters.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-s)",
          }}
        >
          {supporters.map((supporter, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "var(--spacing-s)",
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: "var(--radius-s)",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "var(--color-text-primary)",
                  fontWeight: "bold",
                }}
              >
                #{index + 1}
              </span>
              <span
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "monospace",
                }}
              >
                {supporter.donor.slice(0, 6)}...{supporter.donor.slice(-4)}
              </span>
              <span
                style={{ color: "var(--color-accent)", fontWeight: "bold" }}
              >
                {supporter.totalDonated.toFixed(2)} SUI
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TopSupporters;
