import React, { useState } from "react";
import { Input, Button } from "../../components/ui";

const DonationSettings: React.FC = () => {
  const [minDonation, setMinDonation] = useState("");

  const handleSaveSettings = () => {
    // This would typically involve a smart contract call to set the threshold.
    console.log("Saving minimum donation amount:", minDonation);
    alert(
      `Minimum donation amount set to ${minDonation} SUI. (Frontend simulation)`,
    );
  };

  return (
    <div style={{ marginTop: "var(--spacing-xl)" }}>
      <h3
        style={{
          margin: "0 0 var(--spacing-m) 0",
          color: "var(--color-text-primary)",
        }}
      >
        Donation Settings
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-m)",
        }}
      >
        <Input
          label="Minimum Donation Amount (SUI)"
          type="number"
          placeholder="e.g., 1 SUI"
          value={minDonation}
          onChange={(e) => setMinDonation(e.target.value)}
        />
        <Button onClick={handleSaveSettings} variant="secondary">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default DonationSettings;
