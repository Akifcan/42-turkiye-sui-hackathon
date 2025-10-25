import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

interface DonationEvent {
  donor: string;
  amount: string;
  timestamp: string;
}

export const useDonationHistory = (profileOwnerAddress: string | null) => {
  const [history, setHistory] = useState<DonationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suiClient = useSuiClient();

  useEffect(() => {
    if (!profileOwnerAddress) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Query transaction blocks where this address received SUI
        const txns = await suiClient.queryTransactionBlocks({
          filter: {
            ToAddress: profileOwnerAddress,
          },
          options: {
            showEffects: true,
            showInput: true,
            showBalanceChanges: true,
          },
          order: "descending",
          limit: 20,
        });

        const donationHistory: DonationEvent[] = [];

        for (const txn of txns.data) {
          if (!txn.balanceChanges) continue;

          // Look for SUI balance increases (incoming transfers)
          const suiReceived = txn.balanceChanges.filter(
            (change) =>
              change.owner?.AddressOwner === profileOwnerAddress &&
              change.coinType === "0x2::sui::SUI" &&
              BigInt(change.amount) > 0,
          );

          if (suiReceived.length > 0) {
            // Try to get the sender from effects or transaction sender
            const sender = txn.transaction?.data.sender || "Unknown";
            const totalAmount = suiReceived.reduce(
              (sum, change) => sum + BigInt(change.amount),
              BigInt(0),
            );

            donationHistory.push({
              donor: sender,
              amount: (Number(totalAmount) / 10 ** 9).toFixed(2),
              timestamp: new Date(
                parseInt(txn.timestampMs || "0"),
              ).toLocaleString(),
            });
          }
        }

        setHistory(donationHistory);
      } catch (e: any) {
        console.error("Failed to fetch donation history:", e);
        setError(e.message || "Failed to fetch donation history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [profileOwnerAddress, suiClient]);

  return { history, isLoading, error };
};
