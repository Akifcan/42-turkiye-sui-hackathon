import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

interface Supporter {
  donor: string;
  amount: string;
  totalDonated: number;
}

export const useTopSupporters = (profileOwnerAddress: string | null) => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suiClient = useSuiClient();

  useEffect(() => {
    if (!profileOwnerAddress) return;

    const fetchSupporters = async () => {
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
          limit: 50, // Get more for aggregation
        });

        const supporterMap = new Map<string, number>();

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
            const sender = txn.transaction?.data.sender || "Unknown";
            if (sender === "Unknown") continue;

            const totalAmount = suiReceived.reduce(
              (sum, change) => sum + BigInt(change.amount),
              BigInt(0),
            );

            const amountInSUI = Number(totalAmount) / 10 ** 9;
            const currentTotal = supporterMap.get(sender) || 0;
            supporterMap.set(sender, currentTotal + amountInSUI);
          }
        }

        const sortedSupporters = Array.from(supporterMap.entries())
          .map(([donor, totalDonated]) => ({
            donor,
            amount: totalDonated.toFixed(2),
            totalDonated,
          }))
          .sort((a, b) => b.totalDonated - a.totalDonated)
          .slice(0, 10); // Top 10

        setSupporters(sortedSupporters);
      } catch (e: any) {
        console.error("Failed to fetch top supporters:", e);
        setError(e.message || "Failed to fetch top supporters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupporters();
  }, [profileOwnerAddress, suiClient]);

  return { supporters, isLoading, error };
};
