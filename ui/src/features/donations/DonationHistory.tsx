import { useDonationHistory } from "../../hooks/useDonationHistory";
import { Card } from "../../components/ui";

interface DonationHistoryProps {
  profileOwnerAddress: string | null;
}

const DonationHistory: React.FC<DonationHistoryProps> = ({
  profileOwnerAddress,
}) => {
  const { history, isLoading, error } = useDonationHistory(profileOwnerAddress);

  return (
    <Card>
      <h3
        style={{
          margin: "0 0 var(--spacing-m) 0",
          color: "var(--color-text-primary)",
        }}
      >
        Recent Donations
      </h3>
      {isLoading && (
        <p style={{ color: "var(--color-text-secondary)" }}>
          Loading donation history...
        </p>
      )}
      {error && (
        <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
          💡 Donation tracking coming soon! (Smart contract module pending)
        </p>
      )}
      {!isLoading && !error && history.length === 0 && (
        <p style={{ color: "var(--color-text-secondary)" }}>
          🎁 Be the first to support this athlete! Donations will appear here.
        </p>
      )}
      {!isLoading && !error && history.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-s)",
          }}
        >
          {history.map((donation, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "var(--spacing-s)",
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: "var(--radius-s)",
              }}
            >
              <span
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "monospace",
                }}
              >
                {donation.donor.slice(0, 6)}...{donation.donor.slice(-4)}
              </span>
              <span
                style={{ color: "var(--color-accent)", fontWeight: "bold" }}
              >
                {donation.amount} SUI
              </span>
              <span
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "0.8rem",
                }}
              >
                {donation.timestamp}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default DonationHistory;
