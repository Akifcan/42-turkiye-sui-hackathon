import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../networkConfig";
import { useState } from "react";
import { useEnokiSponsoredTransaction } from "../../hooks/useEnokiSponsoredTransaction";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { AddLinkFormData } from "../../types";

export function SocialLinksManager() {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const listRegistryId = useNetworkVariable("listRegistryId");
  const suiClient = useSuiClient();
  const { executeSponsoredTransaction } = useEnokiSponsoredTransaction();

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<AddLinkFormData>({
    username: "",
    sitename: "",
    siteurl: "",
    description: "",
    iconurl: "",
  });

  const addLink = () => {
    setWaitingForTxn(true);
    setSuccess(false);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(listRegistryId),
        tx.pure.string(formData.username),
        tx.pure.string(formData.sitename),
        tx.pure.string(formData.siteurl),
        tx.pure.string(formData.description),
        tx.pure.string(formData.iconurl),
      ],
      target: `${suilinkPackageId}::list::add_link`,
    });

    executeSponsoredTransaction(tx, {
      onSuccess: (tx) => {
        suiClient
          .waitForTransaction({
            digest: tx.digest,
            options: { showEffects: true },
          })
          .then(() => {
            console.log("✅ Social link added successfully!");
            setSuccess(true);
            setWaitingForTxn(false);

            // Reset form (keep username)
            setFormData({
              username: formData.username,
              sitename: "",
              siteurl: "",
              description: "",
              iconurl: "",
            });
          });
      },
      onError: (error) => {
        console.error("❌ Failed to add link:", error);
        setWaitingForTxn(false);
      },
    });
  };

  return (
    <Card>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-m)",
        }}
      >
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
            Add Social Link
          </h2>
          <p
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-family-body)",
            }}
          >
            Add social media links to your athlete profile
          </p>
        </div>

        {success && (
          <div
            style={{
              padding: "var(--spacing-m)",
              borderRadius: "var(--radius-m)",
              backgroundColor: "rgba(16, 149, 236, 0.15)",
              border:
                "var(--border-width-none) solid var(--color-brand-primary)",
            }}
          >
            <p
              style={{
                color: "var(--color-brand-primary)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "var(--font-family-body)",
              }}
            >
              ✓ Social link added successfully!
            </p>
          </div>
        )}

        <Input
          label="Username"
          placeholder="your-username"
          value={formData.username}
          onChange={(e) =>
            setFormData({
              ...formData,
              username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
            })
          }
          disabled={waitingForTxn}
        />

        <Input
          label="Site Name"
          placeholder="Twitter"
          value={formData.sitename}
          onChange={(e) =>
            setFormData({ ...formData, sitename: e.target.value })
          }
          disabled={waitingForTxn}
        />

        <Input
          label="Site URL"
          placeholder="https://twitter.com/username"
          value={formData.siteurl}
          onChange={(e) =>
            setFormData({ ...formData, siteurl: e.target.value })
          }
          disabled={waitingForTxn}
        />

        <TextArea
          label="Description (Optional)"
          placeholder="Follow me on Twitter"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={waitingForTxn}
          rows={2}
        />

        <Input
          label="Icon URL (Optional)"
          placeholder="https://example.com/twitter-icon.png"
          value={formData.iconurl}
          onChange={(e) =>
            setFormData({ ...formData, iconurl: e.target.value })
          }
          disabled={waitingForTxn}
        />

        <Button
          onClick={addLink}
          disabled={
            waitingForTxn ||
            !formData.username ||
            !formData.sitename ||
            !formData.siteurl
          }
          loading={waitingForTxn}
          variant="accent"
        >
          Add Social Link
        </Button>
      </div>
    </Card>
  );
}
