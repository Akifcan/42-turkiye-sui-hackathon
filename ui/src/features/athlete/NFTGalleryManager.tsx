import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../networkConfig";
import { useState } from "react";
import { useEnokiSponsoredTransaction } from "../../hooks/useEnokiSponsoredTransaction";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { AddNFTFormData } from "../../types";

export function NFTGalleryManager() {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const nftRegistryId = useNetworkVariable("nftRegistryId");
  const suiClient = useSuiClient();
  const { executeSponsoredTransaction } = useEnokiSponsoredTransaction();

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<AddNFTFormData>({
    username: "",
    nft_url: "",
    title: "",
    description: "",
  });

  const addNFT = () => {
    setWaitingForTxn(true);
    setSuccess(false);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(nftRegistryId),
        tx.pure.string(formData.username),
        tx.pure.string(formData.nft_url),
        tx.pure.string(formData.title),
        tx.pure.string(formData.description),
      ],
      target: `${suilinkPackageId}::nft_list::add_nft`,
    });

    executeSponsoredTransaction(tx, {
      onSuccess: (tx) => {
        suiClient
          .waitForTransaction({ digest: tx.digest, options: { showEffects: true } })
          .then(() => {
            console.log("✅ NFT added successfully!");
            setSuccess(true);
            setWaitingForTxn(false);

            // Reset form (keep username)
            setFormData({
              username: formData.username,
              nft_url: "",
              title: "",
              description: "",
            });
          });
      },
      onError: (error) => {
        console.error("❌ Failed to add NFT:", error);
        setWaitingForTxn(false);
      },
    });
  };

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
        <div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'var(--font-weight-bold)', 
            fontFamily: 'var(--font-family-heading)',
            marginBottom: 'var(--spacing-xs)',
            color: 'var(--color-text-primary)',
          }}>
            Add NFT to Gallery
          </h2>
          <p style={{ 
            fontSize: 'var(--font-size-body)', 
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-family-body)',
          }}>
            Add NFTs to your athlete profile gallery
          </p>
        </div>

        {success && (
          <div
            style={{
              padding: 'var(--spacing-m)',
              borderRadius: 'var(--radius-m)',
              backgroundColor: 'rgba(16, 149, 236, 0.15)',
              border: 'var(--border-width-none) solid var(--color-brand-primary)',
            }}
          >
            <p style={{ 
              color: 'var(--color-brand-primary)', 
              fontWeight: 'var(--font-weight-medium)',
              fontFamily: 'var(--font-family-body)',
            }}>
              ✓ NFT added successfully!
            </p>
          </div>
        )}

        <Input
          label="Username"
          placeholder="your-username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
          }
          disabled={waitingForTxn}
        />

        <Input
          label="NFT Title"
          placeholder="My Amazing NFT"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={waitingForTxn}
        />

        <Input
          label="NFT URL"
          placeholder="https://example.com/nft/1234"
          value={formData.nft_url}
          onChange={(e) => setFormData({ ...formData, nft_url: e.target.value })}
          disabled={waitingForTxn}
        />

        <TextArea
          label="Description (Optional)"
          placeholder="Description of the NFT"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={waitingForTxn}
          rows={3}
        />

        <Button
          onClick={addNFT}
          disabled={waitingForTxn || !formData.username || !formData.nft_url || !formData.title}
          loading={waitingForTxn}
          variant="accent"
        >
          Add NFT
        </Button>
      </div>
    </Card>
  );
}

