import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, TextField, TextArea, Flex, Text } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export function CreateAbout({
  onCreated,
}: {
  onCreated?: (id: string) => void;
}) {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const registryId = useNetworkVariable("registryId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [formData, setFormData] = useState({
    username: "", // For registry - abc.com/username
    name: "",
    lastname: "",
    website: "",
    about: "",
  });

  const create = () => {
    setWaitingForTxn(true);

    const tx = new Transaction();

    // 1. Create About object
    tx.moveCall({
      arguments: [
        tx.pure.string(formData.name),
        tx.pure.string(formData.lastname),
        tx.pure.string(formData.website),
        tx.pure.string(formData.about),
      ],
      target: `${suilinkPackageId}::about::create`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (txResult) => {
          suiClient
            .waitForTransaction({ digest: txResult.digest, options: { showEffects: true, showObjectChanges: true } })
            .then(async (result) => {
              const aboutObjectId = result.effects?.created?.[0]?.reference?.objectId;
              if (aboutObjectId) {
                console.log("✅ About Object Created!");
                console.log("About Object ID:", aboutObjectId);

                // Fetch the full object to log it
                const aboutObject = await suiClient.getObject({
                  id: aboutObjectId,
                  options: { showContent: true },
                });

                console.log("About Object:", aboutObject);

                // 2. Register username in registry
                if (formData.username) {
                  console.log("📝 Registering username:", formData.username);

                  const registryTx = new Transaction();
                  registryTx.moveCall({
                    arguments: [
                      registryTx.object(registryId),
                      registryTx.pure.string(formData.username),
                      registryTx.pure.id(aboutObjectId),
                    ],
                    target: `${suilinkPackageId}::registry::register`,
                  });

                  signAndExecute(
                    { transaction: registryTx },
                    {
                      onSuccess: (regTx) => {
                        suiClient.waitForTransaction({ digest: regTx.digest }).then(() => {
                          console.log("✅ Username registered successfully!");
                          console.log(`🔗 Your URL: abc.com/${formData.username}`);
                        });
                      },
                      onError: (error) => {
                        console.error("❌ Registration failed:", error);
                      },
                    }
                  );
                }

                if (onCreated) {
                  onCreated(aboutObjectId);
                }
                setWaitingForTxn(false);

                // Reset form
                setFormData({
                  username: "",
                  name: "",
                  lastname: "",
                  website: "",
                  about: "",
                });
              }
            });
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
          setWaitingForTxn(false);
        },
      },
    );
  };

  return (
    <Container>
      <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
        <Text size="5" weight="bold">Create Your About Profile</Text>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Username (Your URL)</Text>
          <TextField.Root
            placeholder="xyz (will be: abc.com/xyz)"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
            disabled={waitingForTxn}
          />
          {formData.username && (
            <Text size="1" color="green">
              Your URL: abc.com/{formData.username}
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Name</Text>
          <TextField.Root
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Last Name</Text>
          <TextField.Root
            placeholder="Enter your last name"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Website</Text>
          <TextField.Root
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">About</Text>
          <TextArea
            placeholder="Tell us about yourself..."
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            disabled={waitingForTxn}
            rows={4}
          />
        </Flex>

        <Button
          size="3"
          onClick={() => {
            create();
          }}
          disabled={waitingForTxn || !formData.username || !formData.name || !formData.lastname}
        >
          {waitingForTxn ? (
            <ClipLoader size={20} />
          ) : (
            "Create About Profile & Register"
          )}
        </Button>
      </Flex>
    </Container>
  );
}
