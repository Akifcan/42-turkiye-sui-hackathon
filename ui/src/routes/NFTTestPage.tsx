import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";

// ✅ Deployed on Sui Testnet (Updated with is_profile_photo)
const NFT_REGISTRY_PACKAGE_ID = "0xbf0f12628a279d56b15889ddac0ff0d9ba327b8e637ef82bdbbad17f8ca67505";
const NFT_REGISTRY_OBJECT_ID = "0xd20e480fa168b33285824acc2011325311377a2ecee45bb6cf2e5bd65a09ca09";

interface NFTItem {
  nft_url: string;
  title: string;
  description: string;
  is_profile_photo: boolean;
}

export function NFTTestPage() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const [loading, setLoading] = useState(false);
  const [fetchedNFTs, setFetchedNFTs] = useState<NFTItem[]>([]);

  // Form state
  const [username, setUsername] = useState("");
  const [nftUrl, setNftUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isProfilePhoto, setIsProfilePhoto] = useState(false);

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

    setLoading(true);

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
          tx.pure.bool(isProfilePhoto), // is_profile_photo
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      console.log("✅ NFT added successfully:", result);
      toast.success("NFT added successfully!");

      // Clear form
      setNftUrl("");
      setTitle("");
      setDescription("");
      setIsProfilePhoto(false);
    } catch (error) {
      toast.error("Failed to add NFT");
      console.error("❌ Error adding NFT:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle fetch NFTs
  const handleFetchNFTs = async () => {
    if (!username) {
      toast.error("Please enter a username");
      return;
    }

    setLoading(true);

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
        sender: currentAccount?.address || "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      console.log("📦 Raw NFT data:", result);

      // Parse the return values
      if (result.results && result.results[0]?.returnValues) {
        const returnValue = result.results[0].returnValues[0];
        console.log("Return value bytes:", returnValue);

        // Parse BCS bytes
        try {
          // Define BCS structure for NFTItem
          const NFTItemBCS = bcs.struct("NFTItem", {
            nft_url: bcs.string(),
            title: bcs.string(),
            description: bcs.string(),
            is_profile_photo: bcs.bool(),
          });

          // The return value is a vector of NFTItems
          const NFTVectorBCS = bcs.vector(NFTItemBCS);

          // Parse the bytes
          const bytes = Uint8Array.from(returnValue[0]);
          const parsed = NFTVectorBCS.parse(bytes);

          console.log("✅ Parsed NFTs:", parsed);

          setFetchedNFTs(parsed as NFTItem[]);
          toast.success(`Found ${parsed.length} NFT(s)!`);
        } catch (parseError) {
          console.error("❌ Parse error:", parseError);
          toast.error("Failed to parse NFT data");
          setFetchedNFTs([]);
        }
      } else {
        toast.info("No NFTs found or unable to parse");
        setFetchedNFTs([]);
      }
    } catch (error: any) {
      console.error("❌ Error fetching NFTs:", error);

      // Check if it's "not found" error
      if (error?.message?.includes("field does not exist")) {
        toast.info("No NFTs found for this username");
        setFetchedNFTs([]);
      } else {
        toast.error("Failed to fetch NFTs");
      }
    } finally {
      setLoading(false);
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

    setLoading(true);

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
      toast.success("NFTs cleared successfully!");
    } catch (error) {
      toast.error("Failed to clear NFTs");
      console.error("❌ Error clearing NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xl)",
      }}
    >
      <div>
        <a
          href="/"
          style={{
            color: "var(--color-brand-primary)",
            textDecoration: "none",
            fontSize: "var(--font-size-body)",
            fontFamily: "var(--font-family-body)",
          }}
        >
          ← Back to Home
        </a>
      </div>

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
              NFT Registry Test
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

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-s)",
                  padding: "var(--spacing-m)",
                  borderRadius: "var(--radius-s)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <input
                  type="checkbox"
                  id="isProfilePhoto"
                  checked={isProfilePhoto}
                  onChange={(e) => setIsProfilePhoto(e.target.checked)}
                  disabled={loading}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                />
                <label
                  htmlFor="isProfilePhoto"
                  style={{
                    fontSize: "var(--font-size-body)",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-family-body)",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  🖼️ Use as Profile Photo
                </label>
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

          {/* Fetched NFTs Display */}
          {fetchedNFTs.length > 0 && (
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
                Fetched NFTs ({fetchedNFTs.length})
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-m)" }}>
                {fetchedNFTs.map((nft, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "var(--spacing-m)",
                      borderRadius: "var(--radius-s)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-s)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "var(--font-weight-bold)",
                          fontFamily: "var(--font-family-body)",
                          color: "var(--color-text-primary)",
                          margin: 0,
                        }}
                      >
                        {nft.title}
                      </h4>
                      {nft.is_profile_photo && (
                        <span
                          style={{
                            fontSize: "var(--font-size-small)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-s)",
                            backgroundColor: "rgba(16, 149, 236, 0.2)",
                            color: "var(--color-brand-primary)",
                            fontWeight: "var(--font-weight-medium)",
                            fontFamily: "var(--font-family-body)",
                          }}
                        >
                          📸 Profile Photo
                        </span>
                      )}
                    </div>
                    {nft.description && (
                      <p
                        style={{
                          fontSize: "var(--font-size-small)",
                          color: "var(--color-text-secondary)",
                          fontFamily: "var(--font-family-body)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        {nft.description}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: "var(--font-size-small)",
                        color: "var(--color-text-secondary)",
                        fontFamily: "var(--font-family-body)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      <strong>Profile Photo:</strong>{" "}
                      <span
                        style={{
                          color: nft.is_profile_photo ? "var(--color-brand-primary)" : "var(--color-text-muted)",
                          fontWeight: "var(--font-weight-medium)",
                        }}
                      >
                        {nft.is_profile_photo ? "✅ Yes" : "❌ No"}
                      </span>
                    </p>
                    <a
                      href={nft.nft_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "var(--font-size-small)",
                        color: "var(--color-brand-primary)",
                        fontFamily: "var(--font-family-body)",
                        textDecoration: "none",
                      }}
                    >
                      View NFT →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              Package: {NFT_REGISTRY_PACKAGE_ID}
              <br />
              Registry: {NFT_REGISTRY_OBJECT_ID}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
