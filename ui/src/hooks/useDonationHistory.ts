import { useSuiClient } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useNetworkVariable } from "../networkConfig";

// Assuming a structure for donation events from your smart contract
interface DonationEvent {
  donor: string;
  amount: string; // Comes as a string from the API
  timestamp: string; // Comes as a string from the API
}

export const useDonationHistory = (profileOwnerAddress: string | null) => {
  const [history, setHistory] = useState<DonationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suiClient = useSuiClient();
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");

  useEffect(() => {
    if (!profileOwnerAddress) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This is a placeholder for how you might query for custom events.
        // You would need to adjust the `queryEvents` call based on your actual Move event structure.
        const events = await suiClient.queryEvents({
          query: {
            MoveModule: {
              package: suilinkPackageId,
              module: "donation", // Assuming a 'donation' module
            },
            // This is a simplified filter. You might need a more complex one.
            // For example, filtering by a recipient field if your event has one.
          },
          order: "descending",
        });

        const donationHistory = events.data
          .map((event) => {
            // NOTE: The structure of `event.parsedJson` depends entirely on your Move event definition.
            // You MUST adapt this section to match your `DonationEvent` struct in Move.
            const { donor, amount, timestamp, recipient } =
              event.parsedJson as any;
            if (recipient === profileOwnerAddress) {
              return {
                donor,
                amount: (BigInt(amount) / BigInt(10 ** 9)).toString(), // Example: Converting MIST to SUI
                timestamp: new Date(parseInt(timestamp, 10)).toLocaleString(),
              };
            }
            return null;
          })
          .filter((event): event is DonationEvent => event !== null);

        setHistory(donationHistory);
      } catch (e: any) {
        console.error("Failed to fetch donation history:", e);
        setError(e.message || "Failed to fetch donation history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [profileOwnerAddress, suiClient, suilinkPackageId]);

  return { history, isLoading, error };
};
