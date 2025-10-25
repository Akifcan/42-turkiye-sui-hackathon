import React, { useState } from "react";
import { Card, Input, Button, TextArea } from "../../components/ui";
import { useDonation } from "../../hooks/useDonation";
import ThankYouModal from "./ThankYouModal";

interface DonationWidgetProps {
  recipientAddress: string;
}

const DonationWidget: React.FC<DonationWidgetProps> = ({
  recipientAddress,
}) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { donate, isPending } = useDonation({
    onSuccess: () => {
      setIsModalOpen(true);
      setAmount("");
      setMessage("");
    },
  });

  const handleDonate = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    donate(recipientAddress, parseFloat(amount));
  };

  return (
    <>
      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-m)",
          }}
        >
          <h3 style={{ margin: 0, color: "var(--color-text-primary)" }}>
            Support Athlete
          </h3>
          <Input
            label="Amount (SUI)"
            type="number"
            placeholder="5"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isPending}
          />
          <TextArea
            label="Message (Optional) - (on-chain functionality coming soon)"
            placeholder="Keep up the great work!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            disabled={isPending}
          />
          <Button onClick={handleDonate} loading={isPending} variant="accent">
            Donate
          </Button>
        </div>
      </Card>
      <ThankYouModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DonationWidget;
