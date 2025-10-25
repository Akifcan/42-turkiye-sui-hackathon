import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, TextField, Flex, Text } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export function RegisterName() {
  const suilinkPackageId = useNetworkVariable("suilinkPackageId");
  const registryId = useNetworkVariable("registryId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [waitingForTxn, setWaitingForTxn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    aboutObjectId: "",
  });

  const register = () => {
    setWaitingForTxn(true);

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(registryId),
        tx.pure.string(formData.name),
        tx.pure.id(formData.aboutObjectId),
      ],
      target: `${suilinkPackageId}::registry::register`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (tx) => {
          suiClient
            .waitForTransaction({ digest: tx.digest, options: { showEffects: true } })
            .then(() => {
              console.log("✅ Name registered successfully!");
              console.log("Name:", formData.name);
              console.log("About Object ID:", formData.aboutObjectId);
              console.log(`URL: abc.com/${formData.name}`);

              setWaitingForTxn(false);

              // Reset form
              setFormData({
                name: "",
                aboutObjectId: "",
              });
            });
        },
        onError: (error) => {
          console.error("Registration failed:", error);
          setWaitingForTxn(false);
        },
      },
    );
  };

  return (
    <Container>
      <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
        <Text size="5" weight="bold">Register Your Name</Text>
        <Text size="2" color="gray">
          Register a unique name to create your custom URL
        </Text>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Name (Your URL Path)</Text>
          <TextField.Root
            placeholder="xyz (will be: abc.com/xyz)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">About Object ID</Text>
          <TextField.Root
            placeholder="0x..."
            value={formData.aboutObjectId}
            onChange={(e) => setFormData({ ...formData, aboutObjectId: e.target.value })}
            disabled={waitingForTxn}
          />
        </Flex>

        <Button
          size="3"
          onClick={() => {
            register();
          }}
          disabled={waitingForTxn || !formData.name || !formData.aboutObjectId}
        >
          {waitingForTxn ? (
            <ClipLoader size={20} />
          ) : (
            "Register Name"
          )}
        </Button>

        {formData.name && (
          <Text size="2" color="green">
            Your URL will be: abc.com/{formData.name}
          </Text>
        )}
      </Flex>
    </Container>
  );
}
