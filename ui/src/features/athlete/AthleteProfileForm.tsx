import { Transaction } from "@mysten/sui/transactions";
import { useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../networkConfig";
import { useState } from "react";
import { useEnokiSponsoredTransaction } from "../../useEnokiSponsoredTransaction";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { CreateProfileFormData } from "../../types";

export function AthleteProfileForm() {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const registryId = useNetworkVariable("registryId");
  const suiClient = useSuiClient();
  const { executeSponsoredTransaction } = useEnokiSponsoredTransaction();

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateProfileFormData>({
    username: "",
    name: "",
    lastname: "",
    website: "",
    about: "",
  });

  const create = () => {
    setWaitingForTxn(true);
    setSuccess(false);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.pure.string(formData.name),
        tx.pure.string(formData.lastname),
        tx.pure.string(formData.website),
        tx.pure.string(formData.about),
      ],
      target: `${suilinkPackageId}::about::create`,
    });

    executeSponsoredTransaction(tx, {
      onSuccess: (txResult) => {
        suiClient
          .waitForTransaction({ digest: txResult.digest, options: { showEffects: true, showObjectChanges: true } })
          .then(async (result) => {
            const aboutObjectId = result.effects?.created?.[0]?.reference?.objectId;
            if (aboutObjectId) {
              console.log("✅ About Object Created:", aboutObjectId);

              if (formData.username) {
                const registryTx = new Transaction();
                registryTx.moveCall({
                  arguments: [
                    registryTx.object(registryId),
                    registryTx.pure.string(formData.username),
                    registryTx.pure.id(aboutObjectId),
                  ],
                  target: `${suilinkPackageId}::registry::register`,
                });

                executeSponsoredTransaction(registryTx, {
                  onSuccess: (regTx) => {
                    suiClient.waitForTransaction({ digest: regTx.digest }).then(() => {
                      console.log(`✅ Profile created: athlifi.com/${formData.username}`);
                      setSuccess(true);
                      setWaitingForTxn(false);
                      setFormData({
                        username: "",
                        name: "",
                        lastname: "",
                        website: "",
                        about: "",
                      });
                    });
                  },
                  onError: (error) => {
                    console.error("❌ Registration failed:", error);
                    setWaitingForTxn(false);
                  },
                });
              }
            }
          });
      },
      onError: (error) => {
        console.error("Transaction failed:", error);
        setWaitingForTxn(false);
      },
    });
  };

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
            Create Your Athlete Profile
          </h2>
          <p style={{ fontSize: 'var(--font-size-l)', color: 'rgba(0, 0, 0, 0.6)' }}>
            Set up your AthliFi profile to connect with your supporters
          </p>
        </div>

        {success && (
          <div
            style={{
              padding: 'var(--spacing-m)',
              borderRadius: 'var(--radius-base)',
              backgroundColor: 'rgba(7, 191, 217, 0.1)',
              border: '1px solid var(--color-accent-cyan)',
            }}
          >
            <p style={{ color: 'var(--color-accent-cyan)', fontWeight: '600' }}>
              ✓ Profile created successfully! Your URL: athlifi.com/{formData.username || 'your-username'}
            </p>
          </div>
        )}

        <Input
          label="Username (Your AthliFi URL)"
          placeholder="usain-bolt"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
          }
          disabled={waitingForTxn}
        />
        {formData.username && (
          <p style={{ fontSize: 'var(--font-size-s)', color: 'var(--color-accent-cyan)', marginTop: '-12px' }}>
            Your URL: athlifi.com/{formData.username}
          </p>
        )}

        <Input
          label="First Name"
          placeholder="Usain"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={waitingForTxn}
        />

        <Input
          label="Last Name"
          placeholder="Bolt"
          value={formData.lastname}
          onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
          disabled={waitingForTxn}
        />

        <Input
          label="Website (Optional)"
          placeholder="https://example.com"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          disabled={waitingForTxn}
        />

        <TextArea
          label="About"
          placeholder="Tell your supporters about your athletic journey..."
          value={formData.about}
          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
          disabled={waitingForTxn}
          rows={4}
        />

        <Button
          onClick={create}
          disabled={waitingForTxn || !formData.username || !formData.name || !formData.lastname}
          loading={waitingForTxn}
          variant="accent"
        >
          Create Profile
        </Button>
      </div>
    </Card>
  );
}

