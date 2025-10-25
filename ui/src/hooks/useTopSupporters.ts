import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useNetworkVariable } from "../networkConfig";

// Assuming a structure for donation events from your smart contract
interface DonationEvent {
  donor: string;
  amount: string;
}

interface Supporter extends DonationEvent {
  totalDonated: number;
}

export const useTopSupporters = (profileOwnerAddress: string | null) => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suiClient = useSuiClient();
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");

  useEffect(() => {
    if (!profileOwnerAddress) return;

    const fetchSupporters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const events = await suiClient.queryEvents({
          query: {
            MoveModule: {
              package: suilinkPackageId,
              module: "donation",
            },
          },
        });

        const donations = events.data
          .map((event) => {
            const { donor, amount, recipient } = event.parsedJson as any;
            if (recipient === profileOwnerAddress) {
              return {
                donor,
                amount: (BigInt(amount) / BigInt(10 ** 9)).toString(),
              };
            }
            return null;
          })
          .filter((event): event is DonationEvent => event !== null);

        const supporterMap = new Map<string, number>();
        donations.forEach((donation) => {
          const currentTotal = supporterMap.get(donation.donor) || 0;
          supporterMap.set(
            donation.donor,
            currentTotal + parseFloat(donation.amount),
          );
        });

        const sortedSupporters = Array.from(supporterMap.entries())
          .map(([donor, totalDonated]) => ({
            donor,
            amount: totalDonated.toString(),
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
  }, [profileOwnerAddress, suiClient, suilinkPackageId]);

  return { supporters, isLoading, error };
};
