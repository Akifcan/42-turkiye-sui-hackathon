import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useNFTRegistry } from "../../hooks/useNFTRegistry";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import toast from "react-hot-toast";

/**
 * Example component demonstrating NFT Registry usage
 *
 * This component shows how to:
 * - Add NFTs to a user's collection
 * - Fetch NFTs from the blockchain
 * - Clear all NFTs
 */
export function NFTRegistryExample() {
  const currentAccount = useCurrentAccount();
  const { addNFT, getNFTs, clearNFTs, loading } = useNFTRegistry();

  // Form state
  const [username, setUsername] = useState("");
  const [nftUrl, setNftUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Handle add NFT
  const handleAddNFT = async () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!username || !nftUrl || !title) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await addNFT(username, nftUrl, title, description);
      toast.success("NFT added successfully!");

      // Clear form
      setNftUrl("");
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to add NFT");
      console.error(error);
    }
  };

  // Handle fetch NFTs
  const handleFetchNFTs = async () => {
    if (!username) {
      toast.error("Please enter a username");
      return;
    }

    try {
      const nfts = await getNFTs(username);
      console.log("📦 NFTs for", username, ":", nfts);
      toast.success(`Found ${nfts.length} NFTs`);
    } catch (error) {
      toast.error("Failed to fetch NFTs");
      console.error(error);
    }
  };

  // Handle clear NFTs
  const handleClearNFTs = async () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!username) {
      toast.error("Please enter a username");
      return;
    }

    if (!window.confirm(`Are you sure you want to clear all NFTs for ${username}?`)) {
      return;
    }

    try {
      await clearNFTs(username);
      toast.success("NFTs cleared successfully!");
    } catch (error) {
      toast.error("Failed to clear NFTs");
      console.error(error);
    }
  };

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-l)" }}>
        {/* Header */}
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "var(--font-family-heading)",
              marginBottom: "var(--spacing-xs)",
              color: "var(--color-text-primary)",
            }}
          >
            NFT Registry Example
          </h2>
          <p
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Test the NFT Registry smart contract
          </p>
        </div>

        {/* Connection Status */}
        {!currentAccount && (
          <div
            style={{
              padding: "var(--spacing-m)",
              borderRadius: "var(--radius-m)",
              backgroundColor: "rgba(236, 15, 235, 0.1)",
              border: "1px solid var(--color-error)",
            }}
          >
            <p
              style={{
                color: "var(--color-error)",
                fontSize: "var(--font-size-body)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              ⚠️ Please connect your wallet to add or clear NFTs
            </p>
          </div>
        )}

        {/* Username Input */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "var(--font-size-body)",
              fontWeight: "var(--font-weight-medium)",
              marginBottom: "var(--spacing-xs)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Username *
          </label>
          <Input
            placeholder="e.g., usain-bolt"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            disabled={loading}
          />
        </div>

        {/* Add NFT Section */}
        <div
          style={{
            padding: "var(--spacing-m)",
            borderRadius: "var(--radius-m)",
            backgroundColor: "rgba(16, 149, 236, 0.05)",
            border: "1px solid rgba(16, 149, 236, 0.2)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "var(--font-family-heading)",
              marginBottom: "var(--spacing-m)",
              color: "var(--color-text-primary)",
            }}
          >
            Add NFT
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-m)" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--font-size-small)",
                  fontWeight: "var(--font-weight-medium)",
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                NFT URL *
              </label>
              <Input
                placeholder="https://example.com/nft.png"
                value={nftUrl}
                onChange={(e) => setNftUrl(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--font-size-small)",
                  fontWeight: "var(--font-weight-medium)",
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                Title *
              </label>
              <Input
                placeholder="Championship Trophy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "var(--font-size-small)",
                  fontWeight: "var(--font-weight-medium)",
                  marginBottom: "var(--spacing-xs)",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                Description
              </label>
              <Input
                placeholder="Won at World Championships 2024"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleAddNFT}
              disabled={loading || !currentAccount || !username || !nftUrl || !title}
              loading={loading}
              variant="accent"
            >
              Add NFT
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "var(--spacing-m)", flexWrap: "wrap" }}>
          <Button
            onClick={handleFetchNFTs}
            disabled={loading || !username}
            loading={loading}
            variant="primary"
          >
            Fetch NFTs
          </Button>

          <Button
            onClick={handleClearNFTs}
            disabled={loading || !currentAccount || !username}
            loading={loading}
            variant="secondary"
          >
            Clear All NFTs
          </Button>
        </div>

        {/* Info */}
        <div
          style={{
            padding: "var(--spacing-m)",
            borderRadius: "var(--radius-m)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-small)",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-family-body)",
              lineHeight: "1.6",
            }}
          >
            <strong>Contract Info:</strong>
            <br />
            Package: 0x0ae72b...8fe6fd
            <br />
            Registry: 0xd8fcc0...58cc1e
            <br />
            <br />
            Check browser console for NFT fetch results.
          </p>
        </div>
      </div>
    </Card>
  );
}
