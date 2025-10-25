import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

// ✅ Deployed on Sui Testnet (Updated with is_profile_photo)
const NFT_REGISTRY_PACKAGE_ID = "0xbf0f12628a279d56b15889ddac0ff0d9ba327b8e637ef82bdbbad17f8ca67505";
const NFT_REGISTRY_OBJECT_ID = "0xd20e480fa168b33285824acc2011325311377a2ecee45bb6cf2e5bd65a09ca09";

export interface NFTItem {
  nft_url: string;
  title: string;
  description: string;
  is_profile_photo: boolean;
}

export function useNFTRegistry() {
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add an NFT to a user's list
   * @param username - The username to add the NFT to
   * @param nftUrl - URL of the NFT image
   * @param title - Title of the NFT
   * @param description - Description of the NFT
   */
  const addNFT = async (
    username: string,
    nftUrl: string,
    title: string,
    description: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${NFT_REGISTRY_PACKAGE_ID}::nft_list::add_nft`,
        arguments: [
          tx.object(NFT_REGISTRY_OBJECT_ID), // registry
          tx.pure.string(username), // name
          tx.pure.string(nftUrl), // nft_url
          tx.pure.string(title), // title
          tx.pure.string(description), // description
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log("✅ NFT added successfully:", result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add NFT";
      setError(errorMessage);
      console.error("❌ Error adding NFT:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all NFTs for a user
   * @param username - The username to fetch NFTs for
   * @returns Array of NFT items
   */
  const getNFTs = async (username: string): Promise<NFTItem[]> => {
    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${NFT_REGISTRY_PACKAGE_ID}::nft_list::get_nfts`,
        arguments: [
          tx.object(NFT_REGISTRY_OBJECT_ID), // registry
          tx.pure.string(username), // name
        ],
      });

      const result = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      // Parse the result
      if (result.results && result.results[0]?.returnValues) {
        const returnValue = result.results[0].returnValues[0];
        // TODO: Parse BCS bytes to NFTItem[]
        // This requires proper BCS deserialization
        console.log("📦 Raw NFT data:", returnValue);
        return [];
      }

      return [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get NFTs";
      setError(errorMessage);
      console.error("❌ Error getting NFTs:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear all NFTs for a user
   * @param username - The username to clear NFTs for
   */
  const clearNFTs = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${NFT_REGISTRY_PACKAGE_ID}::nft_list::clear_nfts`,
        arguments: [
          tx.object(NFT_REGISTRY_OBJECT_ID), // registry
          tx.pure.string(username), // name
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log("✅ NFTs cleared successfully:", result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear NFTs";
      setError(errorMessage);
      console.error("❌ Error clearing NFTs:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addNFT,
    getNFTs,
    clearNFTs,
    loading,
    error,
  };
}
